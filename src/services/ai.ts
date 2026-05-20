/**
 * AI Summarization Service
 * Integrates Google Gemini via Firebase AI Logic with a premium local NLP sentence extractor fallback.
 */

// Resilient local summarizer fallback
const generateLocalSummary = (bodyParagraphs: string[]): string => {
  const allText = bodyParagraphs.join(' ');
  const sentences = allText.match(/[^.!?]+[.!?]+/g) || [];
  
  if (sentences.length <= 2) {
    return allText;
  }

  // NLP Heuristics: Rank sentences by length, position (prefer first sentences), and key terms
  const keyTerms = ['ai', 'intelligence', 'climate', 'global', 'agreement', 'technology', 'market', 'future', 'carbon', 'leaders', 'mixed reality'];
  
  const scored = sentences.map((sentence, idx) => {
    const cleanSentence = sentence.trim().toLowerCase();
    let score = 0;
    
    // Position weighting (first sentences are highly descriptive in journalism)
    if (idx === 0) score += 10;
    if (idx === 1) score += 5;
    
    // Key term matches
    keyTerms.forEach(term => {
      if (cleanSentence.includes(term)) {
        score += 3;
      }
    });

    // Length penalty/bonus (avoid extremely short or excessively long sentences)
    const words = cleanSentence.split(/\s+/).length;
    if (words >= 10 && words <= 25) {
      score += 4;
    }

    return { sentence: sentence.trim(), score };
  });

  // Sort and select top 2 or 3 sentences, then arrange them in chronolgical order
  const topScored = [...scored]
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const selectedSentences = scored
    .filter(s => topScored.some(ts => ts.sentence === s.sentence))
    .map(s => s.sentence);

  return selectedSentences.join(' ');
};

export const AIService = {
  /**
   * Generates a 2-3 sentence key takeaway summary of an article
   */
  summarizeArticle: async (title: string, bodyParagraphs: string[]): Promise<string> => {
    // 1. Try Firebase AI Logic / Gemini if credentials are set
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (apiKey && apiKey !== 'YOUR_FIREBASE_API_KEY') {
      try {
        // Dynamically import to ensure no build dependencies if unused
        const { initializeApp, getApps, getApp } = await import('firebase/app');
        const { getAI, getGenerativeModel, GoogleAIBackend } = await import('firebase/ai');
        
        const firebaseConfig = {
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        };

        const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        const ai = getAI(app, { backend: new GoogleAIBackend() });
        const model = getGenerativeModel(ai, { 
          model: 'gemini-2.5-flash-lite',
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: 200
          }
        });

        const prompt = `Summarize this news article in exactly two or three concise, high-impact bullet points or sentences for a busy reader. 
        Title: "${title}"
        Body: ${bodyParagraphs.join('\n')}`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        if (responseText) {
          return responseText.trim();
        }
      } catch (e) {
        console.warn('Firebase AI Logic error, falling back to local extractor:', e);
      }
    }

    // 2. Fallback to advanced sentence extraction
    // Simulate minor network delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateLocalSummary(bodyParagraphs);
  }
};
