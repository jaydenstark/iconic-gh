/**
 * Unified Articles Service
 * Manages article data, persistence (via localStorage with SSR fallbacks),
 * view tracking, and the trending score algorithm.
 */

import { FirestoreService } from './firebase/firestoreService';

export interface Author {
  name: string;
  avatar: string;
  bio: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string; // ISO string e.g., '2026-05-19'
  readTime: string;
  views: number;
  author: Author;
  body: string[];
  summary?: string;
  trendingScore?: number;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface ArticleComment {
  id: string;
  postId: string;
  authorName: string;
  content: string;
  createdAt: string; // ISO string
}


// Iconic AI Author profile — the autonomous Ghana/Africa news journalist
export const ICONIC_AUTHOR: Author = {
  name: "Iconic AI",
  avatar: "/iconic-ai-avatar.png",
  bio: "Iconic is ICONIC GH's autonomous AI journalist. Constantly monitoring the web for the latest Ghana and Africa news, curating and reporting 24/7 so you never miss a story."
};

const DEFAULT_AUTHORS: Record<string, Author> = {
  iconic: ICONIC_AUTHOR,
  sarah: {
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    bio: "Sarah is a senior technology journalist reporting on artificial intelligence, cybernetics, and future society trends for over a decade."
  },
  david: {
    name: "David Atten",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
    bio: "David is an award-winning environmental advocate and investigative reporter focusing on climate policy, ecosystems, and conservation strategies."
  },
  marcus: {
    name: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=100&auto=format&fit=crop",
    bio: "Marcus reports on consumer electronics, enterprise hardware innovations, and venture dynamics in Silicon Valley."
  }
};

const DEFAULT_ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Future of AI: How New Models are Reshaping Industries",
    excerpt: "An in-depth look at the latest generative AI developments and their impact on global markets, healthcare, and education.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-19T10:00:00.000Z",
    readTime: "6 min read",
    views: 1420,
    author: DEFAULT_AUTHORS.sarah,
    body: [
      "Artificial intelligence has transitioned from a conceptual science-fiction dream into a fundamental structural block of global enterprise. Over the past year, massive advancements in large multimodal models have redefined how humans and systems collaborate.",
      "From healthcare algorithms that detect anomalies with precision exceeding human limits, to automated engineering flows that draft codebases overnight, the economic footprint of cognitive automation is expanding rapidly.",
      "Critics suggest that the speed of scaling leaves regulatory pipelines in the dust, bringing significant questions around security, authorship, and structural employment shifts. However, early adopters are realizing unprecedented efficiency leaps.",
      "As we look toward the final half of the decade, the boundary between digital orchestration and physical labor will blur even further, calling for a unified standard of safety and human-centric design in autonomous execution."
    ],
    summary: "Generative AI is shifting from science-fiction to core enterprise infrastructure, sparking high efficiency gains across tech and health. However, the speed of adoption raises key regulatory, employment, and security challenges as human-system integration deepens."
  },
  {
    id: "2",
    title: "Global Summit Reaches Historic Agreement on Climate Action",
    excerpt: "World leaders pledge unprecedented funding to combat climate change, aiming for net-zero emissions by 2040.",
    category: "World",
    image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-18T14:30:00.000Z",
    readTime: "8 min read",
    views: 2890,
    author: DEFAULT_AUTHORS.david,
    body: [
      "In an extraordinary concluding session, world leaders from over 160 nations have formally signed the 2026 Accord, establishing a legally binding pathway to reach carbon-neutral operations by 2040.",
      "The policy includes global carbon pricing mechanisms, a complete phase-out of traditional high-emission subsidy lines, and a monumental financial fund dedicated to climate adaptation projects in developing regions.",
      "Negotiators spent over three weeks in continuous sessions to hammer out details, overcoming severe differences between industrialized zones and growing economies.",
      "This accord marks a significant milestone in global unified action, bringing a renewed sense of optimism and clear operational guidelines for international corporations and regional leaders alike."
    ],
    summary: "Over 160 nations signed the historic 2026 Accord, binding them to carbon neutrality by 2040. Key pillars include uniform carbon pricing, ending fossil fuel subsidies, and establishing climate adaptation funds for developing economies."
  },
  {
    id: "3",
    title: "Tech Giant Unveils Revolutionary Mixed Reality Headset",
    excerpt: "The long-awaited device promises to blend digital and physical worlds with unprecedented fidelity and ease of use.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-17T09:15:00.000Z",
    readTime: "5 min read",
    views: 3110,
    author: DEFAULT_AUTHORS.marcus,
    body: [
      "The consumer electronics market received a major shakeup today as the leading hardware enterprise officially launched its long-rumored mixed reality device.",
      "Integrating native micro-OLED displays with custom-silicon latency tracking, the headset projects virtual workspaces and high-resolution assets into physical surroundings with absolute precision.",
      "Analysts suggest this launch marks the first viable step towards post-smartphone interfaces, with major implications for remote collaboration, professional design workflows, and immersive education.",
      "Early pre-order queues have exceeded standard launch expectations, showing a massive public appetite for mature, well-integrated spatial computing solutions."
    ]
  },
  {
    id: "4",
    title: "The Rise of Quantum Computing in Finance",
    excerpt: "Financial brokerages deploy super-velocity quantum processors to revolutionize risk mitigation and algorithmic trades.",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-16T11:00:00.000Z",
    readTime: "7 min read",
    views: 980,
    author: DEFAULT_AUTHORS.sarah,
    body: [
      "Quantum computer grids are moving beyond research labs and entering the core infrastructure of the world's largest financial brokerages.",
      "By utilizing superposition and quantum entanglement, these systems can process risk calculations and portfolio optimization models in seconds that would occupy traditional supercomputer clusters for years.",
      "Major firms are actively recruiting quantum specialists to design proprietary algorithmic strategies, preparing for a future where transactional velocity is dictated by subatomic physics.",
      "While general-purpose quantum processors are still a work in progress, specialized annealers and hybrid quantum-classic stacks are already delivering verifiable alpha in modern markets."
    ]
  },
  {
    id: "5",
    title: "New Health Guidelines Emphasize Preventive Care",
    excerpt: "The WHO shifts policy away from reactive treatment to proactive wellness, sleep, and metabolic guidelines.",
    category: "Health",
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-15T08:00:00.000Z",
    readTime: "4 min read",
    views: 1120,
    author: DEFAULT_AUTHORS.david,
    body: [
      "The World Health Organization has released its most comprehensive update to health and wellness guidelines in two decades, placing a heavy accent on preventative care.",
      "Moving away from reactive medical interventions, the guidelines present structured pathways for metabolic optimization, proactive sleep hygiene, and personalized nutritional strategies.",
      "Clinical data shows that minor lifestyle adjustments, when scaled across populations, reduce chronic conditions and ease structural pressure on national healthcare budgets.",
      "The WHO plans to launch joint education programs with regional schools and city planning committees to integrate these concepts into daily municipal life."
    ]
  },
  {
    id: "6",
    title: "Electric Vehicle Adoption Surpasses Expectations",
    excerpt: "Solid-state battery research and localized fast charging systems push consumer registrations past prior predictions.",
    category: "Business",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=1200&auto=format&fit=crop",
    date: "2026-05-14T16:00:00.000Z",
    readTime: "5 min read",
    views: 1560,
    author: DEFAULT_AUTHORS.marcus,
    body: [
      "Electric vehicle registration metrics have smashed past previous Q1 predictions, showing that EV technology has crossed the chasm into mainstream adoption.",
      "The rapid expansion of localized ultra-fast charging points and next-generation solid-state batteries are successfully erasing traditional range anxieties.",
      "Traditional auto manufacturers are scaling back combustion assembly lines far faster than expected to redirect factory bandwidth toward fully electric chassis.",
      "As battery supply chains diversify and manufacturing yields optimize, EV affordability is projected to reach parity with gas-powered vehicles within the next twelve months."
    ]
  }
];

// Helper to calculate trending score
// Formula: Score = (Views * 1.5) / (AgeInHours + 2)^1.2
export const calculateTrendingScore = (article: Article): number => {
  const publishTime = new Date(article.date).getTime();
  const currentTime = typeof window !== 'undefined' ? Date.now() : new Date('2026-05-19T23:36:00Z').getTime();
  const ageInMs = Math.max(0, currentTime - publishTime);
  const ageInHours = ageInMs / (1000 * 60 * 60);
  
  return (article.views * 1.5) / Math.pow(ageInHours + 2, 1.2);
};

// Local storage helper
const STORAGE_KEY = 'iconic_gh_articles';

export const getArticlesFromStore = (): Article[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ARTICLES.map(a => ({ ...a, status: a.status || 'approved' }));
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const initial = DEFAULT_ARTICLES.map(a => ({ ...a, status: 'approved' as const }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(stored) as Article[];
    return parsed.map(a => ({ ...a, status: a.status || 'approved' }));
  } catch (e) {
    console.error('Failed to load articles from storage:', e);
    return DEFAULT_ARTICLES.map(a => ({ ...a, status: a.status || 'approved' }));
  }
};

export const saveArticlesToStore = (articles: Article[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (e) {
    console.error('Failed to save articles to storage:', e);
  }
};

const AUTHORS_STORAGE_KEY = 'iconic_gh_authors';
const CATEGORIES_STORAGE_KEY = 'iconic_gh_categories';

const DEFAULT_CATEGORIES_LIST = ['Technology', 'Business', 'Politics', 'Sports', 'Entertainment', 'World', 'Health'];

export const getAuthorsFromStore = (): Author[] => {
  if (typeof window === 'undefined') {
    return Object.values(DEFAULT_AUTHORS);
  }
  try {
    const stored = localStorage.getItem(AUTHORS_STORAGE_KEY);
    if (!stored) {
      const list = Object.values(DEFAULT_AUTHORS);
      localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(list));
      return list;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load authors:', e);
    return Object.values(DEFAULT_AUTHORS);
  }
};

export const saveAuthorsToStore = (authors: Author[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTHORS_STORAGE_KEY, JSON.stringify(authors));
  } catch (e) {
    console.error('Failed to save authors:', e);
  }
};

export const getCategoriesFromStore = (): string[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_CATEGORIES_LIST;
  }
  try {
    const stored = localStorage.getItem(CATEGORIES_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(DEFAULT_CATEGORIES_LIST));
      return DEFAULT_CATEGORIES_LIST;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load categories:', e);
    return DEFAULT_CATEGORIES_LIST;
  }
};

export const saveCategoriesToStore = (categories: string[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
  } catch (e) {
    console.error('Failed to save categories:', e);
  }
};

const COMMENTS_STORAGE_KEY = 'iconic_gh_comments';

export const getCommentsFromStore = (): ArticleComment[] => {
  if (typeof window === 'undefined') {
    return [
      { id: "c1", postId: "1", authorName: "Alex Rivera", content: "This is an incredibly detailed and well-written analysis. The shift in corporate infrastructure is real.", createdAt: "2026-05-19T21:30:00.000Z" },
      { id: "c2", postId: "1", authorName: "Elena Rostova", content: "Excellent piece! I am interested to see how standard regulatory commissions will respond to these scaling dynamics.", createdAt: "2026-05-19T22:00:00.000Z" }
    ];
  }
  try {
    const stored = localStorage.getItem(COMMENTS_STORAGE_KEY);
    if (!stored) {
      const initial = [
        { id: "c1", postId: "1", authorName: "Alex Rivera", content: "This is an incredibly detailed and well-written analysis. The shift in corporate infrastructure is real.", createdAt: "2026-05-19T21:30:00.000Z" },
        { id: "c2", postId: "1", authorName: "Elena Rostova", content: "Excellent piece! I am interested to see how standard regulatory commissions will respond to these scaling dynamics.", createdAt: "2026-05-19T22:00:00.000Z" }
      ];
      localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load comments:', e);
    return [];
  }
};

export const saveCommentsToStore = (comments: ArticleComment[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(comments));
  } catch (e) {
    console.error('Failed to save comments:', e);
  }
};


const mapAuthorToUI = (firestoreAuthor: any): Author => {
  // Special case: Iconic AI author
  if (firestoreAuthor.id === 'iconic-ai' || firestoreAuthor.fullName === 'Iconic AI') {
    return ICONIC_AUTHOR;
  }
  return {
    name: firestoreAuthor.fullName || firestoreAuthor.name || "Unknown Author",
    avatar: firestoreAuthor.image || firestoreAuthor.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
    bio: firestoreAuthor.bio || firestoreAuthor.title || "Contributor for ICONIC GH"
  };
};

const mapPostToArticle = (post: any, author: Author): Article => {
  // Resolve Iconic AI author directly
  const resolvedAuthor = post.authorId === 'iconic-ai' ? ICONIC_AUTHOR : author;

  const bodyParagraphs = post.content 
    ? (Array.isArray(post.content) ? post.content : post.content.split('\n\n').filter((p: string) => p.trim() !== '')) 
    : [];
  
  return {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt || "",
    category: post.category || "General",
    image: post.featuredImage || post.image || "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop",
    date: post.publishDate 
      ? (post.publishDate.toDate ? post.publishDate.toDate().toISOString() : new Date(post.publishDate).toISOString()) 
      : new Date().toISOString(),
    readTime: post.readTime || `${Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200))} min read`,
    views: post.views || 0,
    author: resolvedAuthor,
    body: bodyParagraphs,
    summary: post.summary || "",
    trendingScore: post.trendingScore || 0,
    status: post.status || 'approved'
  };
};

/**
 * Public Service Operations
 */

export const ArticlesService = {
  // Get all articles with optional filters and sorting
  getArticles: async (options?: { 
    category?: string; 
    sortBy?: 'trending' | 'recent' | 'views';
    limit?: number;
    includeUnapproved?: boolean;
  }): Promise<Article[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const firestoreOptions: any = {};
        if (options?.category) {
          firestoreOptions.category = options.category;
        }
        
        if (options?.sortBy === 'recent') {
          firestoreOptions.sortBy = 'publishDate';
          firestoreOptions.sortOrder = 'desc';
        } else if (options?.sortBy === 'views') {
          firestoreOptions.sortBy = 'views';
          firestoreOptions.sortOrder = 'desc';
        }
        
        if (options?.limit) {
          firestoreOptions.limitCount = options.limit;
        }
        
        const posts = await FirestoreService.getPosts(firestoreOptions);
        const authors = await FirestoreService.getAuthors();
        
        let list = posts.map(post => {
          const authorDoc = authors.find(a => a.id === post.authorId);
          const author = authorDoc ? mapAuthorToUI(authorDoc) : DEFAULT_AUTHORS.sarah;
          return mapPostToArticle(post, author);
        });

        // Filter out non-approved posts for public queries
        if (!options?.includeUnapproved) {
          list = list.filter(a => a.status === 'approved');
        }
        
        if (options?.sortBy === 'trending') {
          list = list.map(a => ({
            ...a,
            trendingScore: calculateTrendingScore(a)
          }));
          list.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
          if (options?.limit) {
            list = list.slice(0, options.limit);
          }
        }
        
        return list;
      } catch (err) {
        console.error('Failed to get articles from Firestore:', err);
      }
    }

    let list = [...getArticlesFromStore()];

    // Filter out non-approved posts for public queries
    if (!options?.includeUnapproved) {
      list = list.filter(a => a.status === 'approved');
    }
    
    // 1. Filter by category
    if (options?.category) {
      list = list.filter(a => a.category.toLowerCase() === options.category!.toLowerCase());
    }
    
    // 2. Compute trending scores
    list = list.map(a => ({
      ...a,
      trendingScore: calculateTrendingScore(a)
    }));
    
    // 3. Sort
    if (options?.sortBy === 'trending') {
      list.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0));
    } else if (options?.sortBy === 'recent') {
      list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (options?.sortBy === 'views') {
      list.sort((a, b) => b.views - a.views);
    }
    
    // 4. Limit
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    
    return list;
  },
  
  // Get detailed article by ID
  getArticleById: async (id: string): Promise<Article | undefined> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const post = await FirestoreService.getPostById(id);
        if (post) {
          const authors = await FirestoreService.getAuthors();
          const authorDoc = authors.find(a => a.id === post.authorId);
          const author = authorDoc ? mapAuthorToUI(authorDoc) : DEFAULT_AUTHORS.sarah;
          return mapPostToArticle(post, author);
        }
        return undefined;
      } catch (err) {
        console.error('Failed to get article by id from Firestore:', err);
      }
    }
    const list = getArticlesFromStore();
    return list.find(a => a.id === id);
  },
  
  // Increment view count of an article
  incrementViews: async (id: string): Promise<Article | undefined> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        await FirestoreService.incrementViews(id);
        const post = await FirestoreService.getPostById(id);
        if (post) {
          const authors = await FirestoreService.getAuthors();
          const authorDoc = authors.find(a => a.id === post.authorId);
          const author = authorDoc ? mapAuthorToUI(authorDoc) : DEFAULT_AUTHORS.sarah;
          return mapPostToArticle(post, author);
        }
        return undefined;
      } catch (err) {
        console.error('Failed to increment views in Firestore:', err);
      }
    }
    const list = getArticlesFromStore();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      list[idx].views += 1;
      saveArticlesToStore(list);
      return list[idx];
    }
    return undefined;
  },
  
  // Create / Save a new article
  addArticle: async (newArticleData: Omit<Article, 'id' | 'views' | 'date' | 'author'> & { authorName?: string; status?: 'draft' | 'pending' | 'approved' | 'rejected' }): Promise<Article> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const authors = await FirestoreService.getAuthors();
        let authorDoc = authors.find(a => a.fullName.toLowerCase() === (newArticleData.authorName || '').toLowerCase());
        if (!authorDoc && authors.length > 0) {
          authorDoc = authors[0];
        }
        
        const authorId = authorDoc ? authorDoc.id : 'sarah';
        const author = authorDoc ? mapAuthorToUI(authorDoc) : DEFAULT_AUTHORS.sarah;
        
        const content = newArticleData.body ? (Array.isArray(newArticleData.body) ? newArticleData.body.join('\n\n') : newArticleData.body) : '';
        
        const postData = {
          title: newArticleData.title,
          slug: newArticleData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          excerpt: newArticleData.excerpt,
          content: content,
          featuredImage: newArticleData.image,
          category: newArticleData.category,
          authorId: authorId,
          isBreaking: false,
          isFeatured: false,
          publishDate: new Date(),
          tags: [],
          status: newArticleData.status || 'pending'
        };
        
        const newPost = await FirestoreService.addPost(postData);
        return mapPostToArticle(newPost, author);
      } catch (err) {
        console.error('Failed to add article to Firestore:', err);
      }
    }

    const list = getArticlesFromStore();
    
    // Resolve dynamic author
    const authors = getAuthorsFromStore();
    const author = authors.find(a => a.name.toLowerCase() === (newArticleData.authorName || '').toLowerCase()) || 
                   authors[0] || 
                   DEFAULT_AUTHORS.sarah;
    
    // Exclude authorName from dynamic fields when saving
    const { authorName, ...restArticleData } = newArticleData as any;
    
    const newArticle: Article = {
      ...restArticleData,
      id: String(list.length + 1),
      views: 0,
      date: new Date().toISOString(),
      author,
      status: newArticleData.status || 'pending'
    };
    
    list.unshift(newArticle);
    saveArticlesToStore(list);
    return newArticle;
  },
  
  // Edit existing article
  updateArticle: async (id: string, updatedFields: Partial<Article> & { authorName?: string; status?: 'draft' | 'pending' | 'approved' | 'rejected' }): Promise<Article | undefined> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const currentPost = await FirestoreService.getPostById(id);
        if (!currentPost) return undefined;
        
        const updateData: any = {};
        if (updatedFields.title !== undefined) {
          updateData.title = updatedFields.title;
          updateData.slug = updatedFields.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (updatedFields.excerpt !== undefined) updateData.excerpt = updatedFields.excerpt;
        if (updatedFields.body !== undefined) {
          updateData.content = Array.isArray(updatedFields.body) ? updatedFields.body.join('\n\n') : updatedFields.body;
        }
        if (updatedFields.image !== undefined) updateData.featuredImage = updatedFields.image;
        if (updatedFields.category !== undefined) updateData.category = updatedFields.category;
        if (updatedFields.summary !== undefined) updateData.summary = updatedFields.summary;
        if (updatedFields.status !== undefined) updateData.status = updatedFields.status;
        
        if (updatedFields.authorName) {
          const authors = await FirestoreService.getAuthors();
          const authorDoc = authors.find(a => a.fullName.toLowerCase() === updatedFields.authorName!.toLowerCase());
          if (authorDoc) {
            updateData.authorId = authorDoc.id;
          }
        }
        
        await FirestoreService.updatePost(id, updateData);
        
        const post = await FirestoreService.getPostById(id);
        if (post) {
          const authors = await FirestoreService.getAuthors();
          const authorDoc = authors.find(a => a.id === post.authorId);
          const author = authorDoc ? mapAuthorToUI(authorDoc) : DEFAULT_AUTHORS.sarah;
          return mapPostToArticle(post, author);
        }
        return undefined;
      } catch (err) {
        console.error('Failed to update article in Firestore:', err);
      }
    }

    const list = getArticlesFromStore();
    const idx = list.findIndex(a => a.id === id);
    if (idx !== -1) {
      const { authorName, ...fields } = updatedFields;
      
      let updatedAuthor = list[idx].author;
      if (authorName) {
        const authors = getAuthorsFromStore();
        updatedAuthor = authors.find(a => a.name.toLowerCase() === authorName.toLowerCase()) || list[idx].author;
      }
      
      list[idx] = {
        ...list[idx],
        ...fields,
        author: updatedAuthor
      };
      
      saveArticlesToStore(list);
      return list[idx];
    }
    return undefined;
  },
  
  // Delete an article
  deleteArticle: async (id: string): Promise<boolean> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        await FirestoreService.deletePost(id);
        return true;
      } catch (err) {
        console.error('Failed to delete article in Firestore:', err);
        return false;
      }
    }

    const list = getArticlesFromStore();
    const initialLen = list.length;
    const filtered = list.filter(a => a.id !== id);
    if (filtered.length !== initialLen) {
      saveArticlesToStore(filtered);
      return true;
    }
    return false;
  },

  // Author dynamic services
  getAuthors: async (): Promise<Author[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const firestoreAuthors = await FirestoreService.getAuthors();
        if (firestoreAuthors.length > 0) {
          return firestoreAuthors.map(mapAuthorToUI);
        }
      } catch (err) {
        console.error('Failed to fetch authors from Firestore:', err);
      }
    }
    return getAuthorsFromStore();
  },
  
  addAuthor: async (author: Author): Promise<Author> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const docId = author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const newAuthor = await FirestoreService.addAuthor({
          id: docId,
          fullName: author.name,
          image: author.avatar,
          title: author.bio || "Reporter",
          socialLinks: {}
        });
        return mapAuthorToUI(newAuthor);
      } catch (err) {
        console.error('Failed to add author to Firestore:', err);
      }
    }

    const list = getAuthorsFromStore();
    const idx = list.findIndex(a => a.name.toLowerCase() === author.name.toLowerCase());
    if (idx !== -1) {
      list[idx] = author;
    } else {
      list.push(author);
    }
    saveAuthorsToStore(list);
    return author;
  },
  
  deleteAuthor: async (name: string): Promise<boolean> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const docId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await FirestoreService.deleteAuthor(docId);
        return true;
      } catch (err) {
        console.error('Failed to delete author in Firestore:', err);
        return false;
      }
    }

    const list = getAuthorsFromStore();
    const filtered = list.filter(a => a.name.toLowerCase() !== name.toLowerCase());
    if (filtered.length !== list.length) {
      saveAuthorsToStore(filtered);
      return true;
    }
    return false;
  },

  // Categories dynamic services
  getCategories: async (): Promise<string[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const categories = await FirestoreService.getCategories();
        if (categories.length > 0) {
          return categories.map(c => c.name);
        }
      } catch (err) {
        console.error('Failed to fetch categories from Firestore:', err);
      }
    }
    return getCategoriesFromStore();
  },
  
  addCategory: async (category: string): Promise<string> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const docId = category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        const newCategory = await FirestoreService.addCategory({
          id: docId,
          name: category.trim(),
          slug: docId
        });
        return newCategory.name;
      } catch (err) {
        console.error('Failed to add category to Firestore:', err);
      }
    }

    const list = getCategoriesFromStore();
    const trimmed = category.trim();
    if (trimmed && !list.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      list.push(trimmed);
      saveCategoriesToStore(list);
    }
    return trimmed;
  },
  
  deleteCategory: async (category: string): Promise<boolean> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const docId = category.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        await FirestoreService.deleteCategory(docId);
        return true;
      } catch (err) {
        console.error('Failed to delete category in Firestore:', err);
        return false;
      }
    }

    const list = getCategoriesFromStore();
    const filtered = list.filter(c => c.toLowerCase() !== category.toLowerCase());
    if (filtered.length !== list.length) {
      saveCategoriesToStore(filtered);
      return true;
    }
    return false;
  },

  getCommentsForArticle: async (postId: string): Promise<ArticleComment[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const list = await FirestoreService.getComments(postId);
        return list.map(c => ({
          id: c.id,
          postId: c.postId,
          authorName: c.userId || 'Anonymous',
          content: c.comment,
          createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : new Date(c.createdAt).toISOString()
        }));
      } catch (err) {
        console.error('Failed to get comments from Firestore:', err);
      }
    }
    const allComments = getCommentsFromStore();
    return allComments
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getAllComments: async (): Promise<ArticleComment[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const list = await FirestoreService.getAllComments();
        return list.map(c => ({
          id: c.id,
          postId: c.postId,
          authorName: c.userId || 'Anonymous',
          content: c.comment,
          createdAt: c.createdAt instanceof Date ? c.createdAt.toISOString() : new Date(c.createdAt).toISOString()
        }));
      } catch (err) {
        console.error('Failed to get all comments from Firestore:', err);
      }
    }
    return getCommentsFromStore();
  },

  addComment: async (postId: string, authorName: string, content: string): Promise<ArticleComment> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const newComment = await FirestoreService.addComment({
          postId,
          userId: authorName,
          comment: content
        });
        return {
          id: newComment.id,
          postId: newComment.postId,
          authorName: newComment.userId,
          content: newComment.comment,
          createdAt: newComment.createdAt instanceof Date ? newComment.createdAt.toISOString() : new Date(newComment.createdAt).toISOString()
        };
      } catch (err) {
        console.error('Failed to add comment to Firestore:', err);
      }
    }
    const allComments = getCommentsFromStore();
    const newComment: ArticleComment = {
      id: String(Date.now()),
      postId,
      authorName,
      content,
      createdAt: new Date().toISOString()
    };
    allComments.push(newComment);
    saveCommentsToStore(allComments);
    return newComment;
  },

  deleteComment: async (commentId: string): Promise<boolean> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        await FirestoreService.deleteComment(commentId);
        return true;
      } catch (err) {
        console.error('Failed to delete comment in Firestore:', err);
        return false;
      }
    }
    const allComments = getCommentsFromStore();
    const initialLen = allComments.length;
    const filtered = allComments.filter(c => c.id !== commentId);
    if (filtered.length !== initialLen) {
      saveCommentsToStore(filtered);
      return true;
    }
    return false;
  },

  syncLocalStorageToFirestore: async (): Promise<{ success: boolean; syncedArticles: number; syncedAuthors: number; syncedCategories: number; message: string }> => {
    try {
      const localArticles = getArticlesFromStore();
      const localAuthors = getAuthorsFromStore();
      const localCategories = getCategoriesFromStore();

      // 1. Sync Authors
      let syncedAuthorsCount = 0;
      for (const author of localAuthors) {
        const docId = author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await FirestoreService.addAuthor({
          id: docId,
          fullName: author.name,
          image: author.avatar,
          title: author.bio || "Reporter",
          socialLinks: {}
        });
        syncedAuthorsCount++;
      }

      // 2. Sync Categories
      let syncedCategoriesCount = 0;
      for (const cat of localCategories) {
        const docId = cat.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
        await FirestoreService.addCategory({
          id: docId,
          name: cat.trim(),
          slug: docId
        });
        syncedCategoriesCount++;
      }

      // 3. Sync Articles
      let syncedArticlesCount = 0;
      const authorsFromFS = await FirestoreService.getAuthors();
      
      for (const article of localArticles) {
        let authorDoc = authorsFromFS.find(a => a.fullName.toLowerCase() === article.author.name.toLowerCase());
        const authorId = authorDoc ? authorDoc.id : article.author.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const content = article.body ? (Array.isArray(article.body) ? article.body.join('\n\n') : article.body) : '';
        const docId = article.id;
        
        const postData = {
          id: docId,
          title: article.title,
          slug: article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          excerpt: article.excerpt,
          content: content,
          featuredImage: article.image,
          category: article.category,
          authorId: authorId,
          views: article.views || 0,
          likes: article.trendingScore ? Math.round(article.trendingScore) : 0,
          isBreaking: false,
          isFeatured: article.id === "1",
          publishDate: new Date(article.date),
          createdAt: new Date(),
          tags: []
        };
        await FirestoreService.syncPost(postData);
        syncedArticlesCount++;
      }

      return {
        success: true,
        syncedArticles: syncedArticlesCount,
        syncedAuthors: syncedAuthorsCount,
        syncedCategories: syncedCategoriesCount,
        message: 'Successfully synced local data to Cloud Firestore!'
      };
    } catch (e: any) {
      console.error('Sync failed:', e);
      return {
        success: false,
        syncedArticles: 0,
        syncedAuthors: 0,
        syncedCategories: 0,
        message: `Sync failed: ${e.message || e}`
      };
    }
  }
};
