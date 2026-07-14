/* eslint-disable @typescript-eslint/no-explicit-any */
export interface User {
  id: string; // matches Firestore doc ID and Firebase Auth uid
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'journalist' | 'moderator' | 'advertiser' | 'visitor' | 'user';
  profileImage?: string;
  bio?: string;
  createdAt: any; // Can be Date or Firestore Timestamp
}

export interface Author {
  id: string; // doc ID
  fullName: string;
  image: string;
  title: string;
  socialLinks?: {
    twitter?: string;
    website?: string;
    facebook?: string;
  };
}

export interface Category {
  id: string; // doc ID
  name: string;
  slug: string;
  icon?: string;
}

export interface Post {
  id: string; // doc ID
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string; // references Category slug
  authorId: string; // references Author id
  tags?: string[];
  views: number;
  likes: number;
  isBreaking: boolean;
  isFeatured: boolean;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  publishDate: any; // Date or Firestore Timestamp
  createdAt: any; // Date or Firestore Timestamp
}

export interface Comment {
  id: string; // doc ID
  postId: string; // references Post id
  userId: string; // references User id
  comment: string;
  createdAt: any; // Date or Firestore Timestamp
}

export interface Advertisement {
  id: string; // doc ID
  title: string;
  image: string;
  link: string;
  position: 'hero-banner' | 'sidebar-square' | 'footer-banner';
  startDate: any;
  endDate: any;
}

export interface BreakingNews {
  id: string; // doc ID
  headline: string;
  active: boolean;
}

export interface Trending {
  id: string; // doc ID
  postId: string; // references Post id
  score: number;
}

export interface Video {
  id: string; // doc ID
  title: string;
  videoUrl: string;
  thumbnail: string;
}

export interface Newsletter {
  id: string; // subscriberId (hashed or auto-docID)
  email: string;
}

export interface Notification {
  id: string; // doc ID
  title: string;
  message: string;
  sentAt: any; // Date or Firestore Timestamp
}
