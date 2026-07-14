/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Iconic AI Author — Cron Crawl API Route
 * 
 * Called by Vercel Cron every 30 minutes (configured in vercel.json).
 * Also callable manually from the Admin Dashboard for immediate runs.
 * 
 * Security: Validates the Authorization header against CRON_SECRET env var.
 * 
 * Flow:
 * 1. Validate CRON_SECRET
 * 2. Check if Iconic is enabled (Firestore iconic_config doc)
 * 3. Fetch & parse each active RSS feed
 * 4. Deduplicate against iconic_seen_urls collection
 * 5. Paraphrase new items with Gemini AI
 * 6. Write articles to Firestore posts collection
 * 7. Record seen URLs and update last-run timestamp
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  fetchRssFeed,
  parseRssItems,
  paraphraseWithGemini,
  hashUrl,
  RSS_FEEDS,
} from '@/services/newsCrawler';

// ============================================================
// Firestore imports (dynamic to avoid SSR issues)
// ============================================================
async function getFirestoreClient() {
  const { initializeApp, getApps, getApp } = await import('firebase/app');
  const { getFirestore, doc, getDoc, setDoc, addDoc, collection } = await import('firebase/firestore');

  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return { db, doc, getDoc, setDoc, addDoc, collection };
}

// ============================================================
// Stats tracking
// ============================================================
interface CrawlStats {
  feedsProcessed: number;
  newArticles: number;
  skippedDuplicates: number;
  errors: string[];
  articlesPublished: string[];
}

// ============================================================
// Main Handler
// ============================================================
export async function POST(request: NextRequest) {
  // 1. Validate cron secret
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get('authorization');
  const manualToken = request.headers.get('x-iconic-admin');

  const isValidCron = cronSecret && authHeader === `Bearer ${cronSecret}`;
  const isManualAdmin = manualToken === (process.env.CRON_SECRET || 'dev-trigger');
  const isDev = process.env.NODE_ENV === 'development';

  if (!isValidCron && !isManualAdmin && !isDev) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 });
  }

  const stats: CrawlStats = {
    feedsProcessed: 0,
    newArticles: 0,
    skippedDuplicates: 0,
    errors: [],
    articlesPublished: [],
  };

  const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';

  // 2. Check if Firestore is available and Iconic is enabled
  const seenUrls = new Set<string>();
  let firestore: Awaited<ReturnType<typeof getFirestoreClient>> | null = null;

  if (useFirestore) {
    try {
      firestore = await getFirestoreClient();
      const { db, doc, getDoc } = firestore;

      // Check if Iconic is paused
      const configRef = doc(db, 'iconic_config', 'settings');
      const configSnap = await getDoc(configRef);
      if (configSnap.exists() && configSnap.data()?.paused === true) {
        return NextResponse.json({
          message: 'Iconic AI Author is currently paused.',
          stats,
        });
      }

      // Load seen URLs
      const { getDocs, collection } = await import('firebase/firestore');
      const seenSnap = await getDocs(collection(db, 'iconic_seen_urls'));
      seenSnap.forEach(d => seenUrls.add(d.id));
    } catch (err) {
      stats.errors.push(`Firestore init error: ${err}`);
      console.error('Firestore init failed:', err);
    }
  }

  // Get active feeds
  const activeFeeds = RSS_FEEDS.filter(f => f.enabled);

  // 3. Fetch all active feeds in parallel (fast, no rate limits for fetch)
  const allItems: { item: any; feedName: string }[] = [];
  const feedResults = await Promise.allSettled(
    activeFeeds.map(async (feed) => {
      try {
        const xml = await fetchRssFeed(feed.url);
        const items = parseRssItems(xml, feed.name, feed.category);
        stats.feedsProcessed++;
        for (const item of items) {
          allItems.push({ item, feedName: feed.name });
        }
      } catch (err) {
        throw new Error(`Failed to process feed ${feed.name}: ${err}`);
      }
    })
  );

  // Collect feed-level errors
  for (const r of feedResults) {
    if (r.status === 'rejected') {
      stats.errors.push(r.reason?.message || String(r.reason));
    }
  }

  // 4. Find the first unseen article across all feeds
  let selectedItem: any = null;
  let selectedUrlHash: string = '';

  for (const candidate of allItems) {
    const urlHash = await hashUrl(candidate.item.link);
    if (seenUrls.has(urlHash)) {
      stats.skippedDuplicates++;
      continue;
    }
    // We found our first unseen article!
    selectedItem = candidate.item;
    selectedUrlHash = urlHash;
    break; // Only process one new article per run to stay well under the Gemini 5 RPM rate limit
  }

  // 5. Paraphrase and publish the single selected article
  if (selectedItem) {
    try {
      const paraphrased = await paraphraseWithGemini(selectedItem, geminiKey);
      if (paraphrased) {
        const articleId = `iconic-${selectedUrlHash}`;
        const wordCount = paraphrased.body.join(' ').split(/\s+/).length;
        const estimatedReadTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

        const newPost = {
          id: articleId,
          title: paraphrased.title,
          slug: paraphrased.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 80),
          excerpt: paraphrased.excerpt,
          content: paraphrased.body,
          featuredImage: paraphrased.image,
          category: paraphrased.category,
          authorId: 'iconic-ai',
          tags: ['Ghana', 'Africa', paraphrased.category, 'AI Journalist'],
          views: 0,
          likes: 0,
          isBreaking: false,
          isFeatured: false,
          status: 'approved',
          sourceUrl: paraphrased.sourceUrl,
          sourceName: paraphrased.sourceName,
          readTime: paraphrased.readTime || estimatedReadTime,
          aiGenerated: true,
        };

        // Write to Firestore
        if (useFirestore && firestore) {
          const { db, doc, setDoc } = firestore;
          const { serverTimestamp } = await import('firebase/firestore');
          await setDoc(doc(db, 'posts', articleId), {
            ...newPost,
            publishDate: serverTimestamp(),
            createdAt: serverTimestamp(),
          });
          await setDoc(doc(db, 'iconic_seen_urls', selectedUrlHash), {
            url: selectedItem.link,
            title: selectedItem.title,
            seenAt: serverTimestamp(),
          });
          seenUrls.add(selectedUrlHash);
        } else {
          console.log('[Iconic Dev] Would publish:', paraphrased.title);
        }

        stats.newArticles = 1;
        stats.articlesPublished.push(paraphrased.title);
      } else {
        stats.errors.push(`Failed to paraphrase: ${selectedItem.title}`);
      }
    } catch (err) {
      stats.errors.push(`Error during paraphrase/publish: ${err}`);
    }
  } else {
    console.log('[Iconic] No new unseen articles found across feeds.');
  }


  // Update last-run timestamp
  if (useFirestore && firestore) {
    try {
      const { db, doc, setDoc } = firestore;
      const { serverTimestamp } = await import('firebase/firestore');
      await setDoc(
        doc(db, 'iconic_config', 'settings'),
        { lastRun: serverTimestamp(), lastRunStats: stats },
        { merge: true }
      );
    } catch (e) {
      console.error('Failed to update iconic_config:', e);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Iconic crawl complete. ${stats.newArticles} new articles published.`,
    stats,
  });
}

// Also support GET for Vercel Cron (it sends GET requests)
export async function GET(request: NextRequest) {
  return POST(request);
}
