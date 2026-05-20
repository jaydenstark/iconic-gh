/**
 * News Crawler Service — Iconic AI Author
 * Fetches RSS feeds from Ghana/Africa news sources, parses them,
 * paraphrases with Gemini AI, and prepares articles for posting.
 */

export interface RssItem {
  title: string;
  link: string;
  description: string;
  image: string;
  pubDate: string;
  category: string;
  source: string;
}

export interface ParaphrasedArticle {
  title: string;
  excerpt: string;
  body: string[];
  category: string;
  readTime: string;
  image: string;
  sourceUrl: string;
  sourceName: string;
}

// ============================================================
// RSS Feed Sources — Ghana & Africa focused
// ============================================================
export const RSS_FEEDS: { name: string; url: string; category: string; enabled: boolean }[] = [
  { name: 'GhanaWeb', url: 'https://www.ghanaweb.com/GhanaHomePage/rss.xml', category: 'Ghana', enabled: true },
  { name: 'MyJoyOnline', url: 'https://www.myjoyonline.com/feed/', category: 'Ghana', enabled: true },
  { name: 'Pulse Ghana', url: 'https://pulse.com.gh/rss.xml', category: 'Ghana', enabled: true },
  { name: 'Graphic Online', url: 'https://www.graphic.com.gh/feed', category: 'Ghana', enabled: true },
  { name: 'Modern Ghana', url: 'https://www.modernghana.com/rss/news.asp', category: 'Ghana', enabled: true },
  { name: 'BBC Africa', url: 'https://feeds.bbci.co.uk/news/world/africa/rss.xml', category: 'Africa', enabled: true },
  { name: 'CNN Africa', url: 'https://rss.cnn.com/rss/edition_africa.rss', category: 'Africa', enabled: true },
  { name: 'AllAfrica', url: 'https://allafrica.com/tools/rss/africa.rss', category: 'Africa', enabled: true },
];

// Map category keywords from RSS to site categories
const CATEGORY_MAP: Record<string, string> = {
  politics: 'Politics',
  government: 'Politics',
  election: 'Politics',
  parliament: 'Politics',
  economy: 'Business',
  finance: 'Business',
  business: 'Business',
  market: 'Business',
  trade: 'Business',
  sports: 'Sports',
  football: 'Sports',
  soccer: 'Sports',
  athletics: 'Sports',
  entertainment: 'Entertainment',
  music: 'Entertainment',
  film: 'Entertainment',
  celebrity: 'Entertainment',
  health: 'Health',
  medical: 'Health',
  covid: 'Health',
  technology: 'Technology',
  tech: 'Technology',
  digital: 'Technology',
  africa: 'Africa',
  ghana: 'Ghana',
};

// ============================================================
// RSS Fetcher
// ============================================================
export async function fetchRssFeed(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'ICONIC-GH-Bot/1.0 (news aggregator)',
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
    },
    next: { revalidate: 0 }, // Always fresh
    signal: AbortSignal.timeout(10000), // 10s timeout per feed
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  }
  return res.text();
}

// ============================================================
// Mini RSS/Atom XML Parser (no external deps)
// ============================================================
function extractTag(xml: string, tag: string): string {
  // Try CDATA first
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, 'i'));
  if (cdataMatch) return cdataMatch[1].trim();
  // Plain content
  const plainMatch = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  if (plainMatch) return plainMatch[1].replace(/<[^>]+>/g, '').trim();
  return '';
}

function extractAttribute(xml: string, tag: string, attr: string): string {
  const tagMatch = xml.match(new RegExp(`<${tag}[^>]+${attr}="([^"]+)"`, 'i'));
  return tagMatch ? tagMatch[1] : '';
}

export function parseRssItems(xml: string, sourceName: string, defaultCategory: string): RssItem[] {
  const items: RssItem[] = [];

  // Split on <item> or <entry> (Atom)
  const itemPattern = /<item[\s>]([\s\S]*?)<\/item>|<entry[\s>]([\s\S]*?)<\/entry>/gi;
  let match;
  let count = 0;

  while ((match = itemPattern.exec(xml)) !== null && count < 10) {
    const block = match[1] || match[2];
    if (!block) continue;

    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link') || extractAttribute(block, 'link', 'href');
    const description = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const rawCategory = extractTag(block, 'category') || defaultCategory;

    // Image: try media:content, enclosure, or og image from description
    let image = extractAttribute(block, 'media:content', 'url')
      || extractAttribute(block, 'media:thumbnail', 'url')
      || extractAttribute(block, 'enclosure', 'url');

    // Fallback: extract first img from description HTML
    if (!image) {
      const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i);
      if (imgMatch) image = imgMatch[1];
    }

    // African/Ghana fallback image
    if (!image) {
      image = 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?q=80&w=1200&auto=format&fit=crop';
    }

    // Map category
    const catLower = rawCategory.toLowerCase();
    let mappedCategory = defaultCategory;
    for (const [keyword, cat] of Object.entries(CATEGORY_MAP)) {
      if (catLower.includes(keyword)) {
        mappedCategory = cat;
        break;
      }
    }

    if (title && link) {
      items.push({
        title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
        link,
        description: description.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim().slice(0, 800),
        image,
        pubDate: pubDate || new Date().toISOString(),
        category: mappedCategory,
        source: sourceName,
      });
      count++;
    }
  }

  return items;
}

// ============================================================
// URL Deduplication Hash
// ============================================================
export async function hashUrl(url: string): Promise<string> {
  // Use built-in Web Crypto API (available in Next.js Edge/Node)
  const encoder = new TextEncoder();
  const data = encoder.encode(url.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

// ============================================================
// Gemini AI Paraphraser
// ============================================================
export async function paraphraseWithGemini(item: RssItem, apiKey: string): Promise<ParaphrasedArticle | null> {
  const prompt = `You are Iconic, the AI journalist for ICONIC GH — Ghana's premier digital news platform.

Your task: Rewrite the following news story in your own words for a Ghanaian and African audience. 

RULES:
- Write a NEW headline (punchy, journalistic, max 12 words)
- Write a one-sentence excerpt/teaser (max 30 words)
- Write 4-6 body paragraphs expanding on the story. Add Ghanaian/African context where relevant.
- Use professional newspaper journalism style — factual, clear, engaging.
- Do NOT copy the original text verbatim. Paraphrase everything.
- Choose ONE category from: Ghana, Africa, Politics, Business, Sports, Entertainment, Health, Technology
- Estimate reading time (e.g. "3 min read")

INPUT STORY:
Title: ${item.title}
Source: ${item.source}
Summary: ${item.description}

Respond ONLY with valid JSON in this exact structure:
{
  "title": "...",
  "excerpt": "...",
  "body": ["paragraph 1", "paragraph 2", "paragraph 3", "paragraph 4"],
  "category": "...",
  "readTime": "... min read"
}`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 1024,
          responseMimeType: 'application/json',
        },
      }),
      signal: AbortSignal.timeout(30000),
    }
  );

  if (!res.ok) {
    console.error(`Gemini API error: ${res.status} ${res.statusText}`);
    return null;
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  try {
    // Strip markdown code fences if present
    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || item.title,
      excerpt: parsed.excerpt || item.description.slice(0, 120),
      body: Array.isArray(parsed.body) ? parsed.body : [parsed.body],
      category: parsed.category || item.category,
      readTime: parsed.readTime || '3 min read',
      image: item.image,
      sourceUrl: item.link,
      sourceName: item.source,
    };
  } catch (e) {
    console.error('Failed to parse Gemini JSON response:', e, text);
    return null;
  }
}
