import { 
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, 
  deleteDoc, query, where, orderBy, limit, increment, onSnapshot 
} from 'firebase/firestore';
import { db } from './config';
import { 
  User, Author, Category, Post, Comment, 
  Advertisement, BreakingNews, Trending, Video, Newsletter, Notification 
} from './types';

export const FirestoreService = {
  // ==========================================
  // USERS COLLECTION
  // ==========================================
  async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as User;
    }
    return null;
  },

  async syncUserProfile(user: Omit<User, 'createdAt'>): Promise<User> {
    const userRef = doc(db, 'users', user.id);
    const docSnap = await getDoc(userRef);
    const now = new Date();
    
    if (!docSnap.exists()) {
      const newUser: User = {
        ...user,
        createdAt: now
      };
      await setDoc(userRef, newUser);
      return newUser;
    } else {
      const existing = docSnap.data() as User;
      const updatedUser: User = {
        ...existing,
        name: user.name || existing.name,
        email: user.email || existing.email,
        profileImage: user.profileImage || existing.profileImage,
        bio: user.bio || existing.bio,
        role: user.role || existing.role || 'user'
      };
      await setDoc(userRef, updatedUser, { merge: true });
      return updatedUser;
    }
  },

  // ==========================================
  // AUTHORS COLLECTION
  // ==========================================
  async getAuthors(): Promise<Author[]> {
    const colRef = collection(db, 'authors');
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Author);
  },

  async addAuthor(author: Omit<Author, 'id'> & { id?: string }): Promise<Author> {
    const docId = author.id || doc(collection(db, 'authors')).id;
    const docRef = doc(db, 'authors', docId);
    const newAuthor: Author = { id: docId, ...author };
    await setDoc(docRef, newAuthor);
    return newAuthor;
  },

  async deleteAuthor(authorId: string): Promise<void> {
    await deleteDoc(doc(db, 'authors', authorId));
  },

  // ==========================================
  // CATEGORIES COLLECTION
  // ==========================================
  async getCategories(): Promise<Category[]> {
    const colRef = collection(db, 'categories');
    const snap = await getDocs(query(colRef, orderBy('name')));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Category);
  },

  async addCategory(category: Omit<Category, 'id'> & { id?: string }): Promise<Category> {
    const docId = category.id || doc(collection(db, 'categories')).id;
    const docRef = doc(db, 'categories', docId);
    const newCategory: Category = { id: docId, ...category };
    await setDoc(docRef, newCategory);
    return newCategory;
  },

  async deleteCategory(categoryId: string): Promise<void> {
    await deleteDoc(doc(db, 'categories', categoryId));
  },

  // ==========================================
  // POSTS COLLECTION
  // ==========================================
  async getPosts(options?: {
    category?: string;
    isBreaking?: boolean;
    isFeatured?: boolean;
    authorId?: string;
    sortBy?: 'publishDate' | 'views' | 'createdAt';
    sortOrder?: 'desc' | 'asc';
    limitCount?: number;
  }): Promise<Post[]> {
    const colRef = collection(db, 'posts');
    const constraints: any[] = [];

    if (options?.category) {
      constraints.push(where('category', '==', options.category));
    }
    if (options?.isBreaking !== undefined) {
      constraints.push(where('isBreaking', '==', options.isBreaking));
    }
    if (options?.isFeatured !== undefined) {
      constraints.push(where('isFeatured', '==', options.isFeatured));
    }
    if (options?.authorId) {
      constraints.push(where('authorId', '==', options.authorId));
    }

    const field = options?.sortBy || 'publishDate';
    const direction = options?.sortOrder || 'desc';
    constraints.push(orderBy(field, direction));

    if (options?.limitCount) {
      constraints.push(limit(options.limitCount));
    }

    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        ...data,
        publishDate: data.publishDate?.toDate ? data.publishDate.toDate() : data.publishDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as Post;
    });
  },

  async getPostById(postId: string): Promise<Post | null> {
    const docRef = doc(db, 'posts', postId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return { 
        id: snap.id, 
        ...data,
        publishDate: data.publishDate?.toDate ? data.publishDate.toDate() : data.publishDate,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as Post;
    }
    return null;
  },

  async addPost(post: Omit<Post, 'id' | 'createdAt' | 'views' | 'likes'> & { id?: string }): Promise<Post> {
    const docId = post.id || doc(collection(db, 'posts')).id;
    const docRef = doc(db, 'posts', docId);
    const now = new Date();
    const newPost: Post = {
      ...post,
      id: docId,
      views: 0,
      likes: 0,
      publishDate: post.publishDate || now,
      createdAt: now
    };
    await setDoc(docRef, newPost);
    return newPost;
  },

  async syncPost(post: Post): Promise<void> {
    const docRef = doc(db, 'posts', post.id);
    await setDoc(docRef, post);
  },

  async updatePost(postId: string, updatedFields: Partial<Omit<Post, 'id'>>): Promise<void> {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, updatedFields);
  },

  async deletePost(postId: string): Promise<void> {
    await deleteDoc(doc(db, 'posts', postId));
  },

  async incrementViews(postId: string): Promise<void> {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, { views: increment(1) });
  },

  async incrementLikes(postId: string): Promise<void> {
    const docRef = doc(db, 'posts', postId);
    await updateDoc(docRef, { likes: increment(1) });
  },

  // COMMENTS COLLECTION
  // ==========================================
  async getAllComments(): Promise<Comment[]> {
    const colRef = collection(db, 'comments');
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as Comment;
    });
  },

  async getComments(postId: string): Promise<Comment[]> {
    const colRef = collection(db, 'comments');
    const q = query(colRef, where('postId', '==', postId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
      } as Comment;
    });
  },

  async addComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> {
    const colRef = collection(db, 'comments');
    const now = new Date();
    const docRef = await addDoc(colRef, {
      ...comment,
      createdAt: now
    });
    return {
      id: docRef.id,
      ...comment,
      createdAt: now
    };
  },

  async deleteComment(commentId: string): Promise<void> {
    await deleteDoc(doc(db, 'comments', commentId));
  },

  // ==========================================
  // ADVERTISEMENTS COLLECTION
  // ==========================================
  async getActiveAdvertisements(): Promise<Advertisement[]> {
    const colRef = collection(db, 'advertisements');
    const now = new Date();
    const q = query(
      colRef, 
      where('startDate', '<=', now),
      orderBy('startDate', 'desc')
    );
    const snap = await getDocs(q);
    // Client side filter end date for range alignment in complex indexes
    return snap.docs
      .map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate ? data.startDate.toDate() : data.startDate,
          endDate: data.endDate?.toDate ? data.endDate.toDate() : data.endDate
        } as Advertisement;
      })
      .filter(ad => ad.endDate >= now);
  },

  async addAdvertisement(ad: Omit<Advertisement, 'id'>): Promise<Advertisement> {
    const colRef = collection(db, 'advertisements');
    const docRef = await addDoc(colRef, ad);
    return { id: docRef.id, ...ad };
  },

  // ==========================================
  // BREAKING NEWS TICKER COLLECTION
  // ==========================================
  subscribeToBreakingNews(callback: (news: BreakingNews[]) => void) {
    const colRef = collection(db, 'breakingNews');
    const q = query(colRef, where('active', '==', true));
    return onSnapshot(q, (snap) => {
      const news = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as BreakingNews);
      callback(news);
    });
  },

  async addBreakingNews(headline: string): Promise<BreakingNews> {
    const colRef = collection(db, 'breakingNews');
    const docRef = await addDoc(colRef, { headline, active: true });
    return { id: docRef.id, headline, active: true };
  },

  async setBreakingNewsStatus(newsId: string, active: boolean): Promise<void> {
    await updateDoc(doc(db, 'breakingNews', newsId), { active });
  },

  // ==========================================
  // TRENDING SCORE SYSTEM COLLECTION
  // ==========================================
  async getTrendingScores(): Promise<Trending[]> {
    const colRef = collection(db, 'trending');
    const q = query(colRef, orderBy('score', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Trending);
  },

  async updateTrendingScore(postId: string, score: number): Promise<void> {
    const docRef = doc(db, 'trending', postId);
    await setDoc(docRef, { postId, score }, { merge: true });
  },

  // ==========================================
  // VIDEOS COLLECTION
  // ==========================================
  async getVideos(limitCount?: number): Promise<Video[]> {
    const colRef = collection(db, 'videos');
    const constraints: any[] = [];
    if (limitCount) constraints.push(limit(limitCount));
    const snap = await getDocs(query(colRef, ...constraints));
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Video);
  },

  async addVideo(video: Omit<Video, 'id'>): Promise<Video> {
    const colRef = collection(db, 'videos');
    const docRef = await addDoc(colRef, video);
    return { id: docRef.id, ...video };
  },

  // ==========================================
  // NEWSLETTER LIST COLLECTION
  // ==========================================
  async addNewsletterSubscriber(email: string): Promise<Newsletter> {
    const trimmed = email.toLowerCase().trim();
    // Use the base64 or encoded email as ID to prevent duplicates cleanly
    const docId = btoa(trimmed).replace(/=/g, '');
    const docRef = doc(db, 'newsletter', docId);
    const sub: Newsletter = { id: docId, email: trimmed };
    await setDoc(docRef, sub);
    return sub;
  },

  async getNewsletterSubscribers(): Promise<Newsletter[]> {
    const colRef = collection(db, 'newsletter');
    const snap = await getDocs(colRef);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Newsletter);
  },

  // ==========================================
  // NOTIFICATIONS BROADCAST COLLECTION
  // ==========================================
  subscribeToNotifications(callback: (notifications: Notification[]) => void) {
    const colRef = collection(db, 'notifications');
    const q = query(colRef, orderBy('sentAt', 'desc'), limit(10));
    return onSnapshot(q, (snap) => {
      const items = snap.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          sentAt: data.sentAt?.toDate ? data.sentAt.toDate() : data.sentAt
        } as Notification;
      });
      callback(items);
    });
  },

  async addNotification(title: string, message: string): Promise<Notification> {
    const colRef = collection(db, 'notifications');
    const now = new Date();
    const docRef = await addDoc(colRef, {
      title,
      message,
      sentAt: now
    });
    return {
      id: docRef.id,
      title,
      message,
      sentAt: now
    };
  }
};
