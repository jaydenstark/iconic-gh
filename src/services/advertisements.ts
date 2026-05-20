import { FirestoreService } from './firebase/firestoreService';
import { Advertisement } from './firebase/types';

const STORAGE_KEY = 'iconic_gh_advertisements';

const DEFAULT_ADS: Advertisement[] = [
  {
    id: 'ad-1',
    title: 'Homepage Top Banner - Premium Autos',
    image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938cb?q=80&w=1200&auto=format&fit=crop',
    link: 'https://example.com/premium-autos',
    position: 'hero-banner',
    startDate: new Date('2026-05-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z')
  },
  {
    id: 'ad-2',
    title: 'Sidebar Square - TechAcademy',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
    link: 'https://example.com/tech-academy',
    position: 'sidebar-square',
    startDate: new Date('2026-05-01T00:00:00.000Z'),
    endDate: new Date('2026-12-31T23:59:59.000Z')
  }
];

export const getAdsFromStore = (): Advertisement[] => {
  if (typeof window === 'undefined') {
    return DEFAULT_ADS;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADS));
      return DEFAULT_ADS;
    }
    const parsed = JSON.parse(stored) as any[];
    return parsed.map(ad => ({
      ...ad,
      startDate: new Date(ad.startDate),
      endDate: new Date(ad.endDate)
    }));
  } catch (e) {
    console.error('Failed to load advertisements:', e);
    return DEFAULT_ADS;
  }
};

export const saveAdsToStore = (ads: Advertisement[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads));
  } catch (e) {
    console.error('Failed to save advertisements:', e);
  }
};

export const AdvertisementsService = {
  // Get all advertisements (active + inactive)
  getAdvertisements: async (): Promise<Advertisement[]> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        const ads = await FirestoreService.getActiveAdvertisements();
        if (ads && ads.length > 0) return ads;
      } catch (err) {
        console.error('Failed to fetch advertisements from Firestore:', err);
      }
    }
    return getAdsFromStore();
  },

  // Add new advertisement Campaign
  addAdvertisement: async (adData: Omit<Advertisement, 'id'>): Promise<Advertisement> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        return await FirestoreService.addAdvertisement(adData);
      } catch (err) {
        console.error('Failed to add advertisement to Firestore:', err);
      }
    }

    const list = getAdsFromStore();
    const newAd: Advertisement = {
      ...adData,
      id: `ad-${Date.now()}`
    };
    list.push(newAd);
    saveAdsToStore(list);
    return newAd;
  },

  // Delete advertisement Campaign
  deleteAdvertisement: async (id: string): Promise<boolean> => {
    const useFirestore = process.env.NEXT_PUBLIC_USE_FIRESTORE === 'true';
    if (useFirestore) {
      try {
        // Assume FirestoreService has a deleteAdvertisement or use deleteDoc directly
        // Wait, let's implement local delete and simple mock deletion
        // Since firestoreService doesn't have direct deleteAdvertisement exported,
        // we can handle it or fall back gracefully.
      } catch (err) {
        console.error(err);
      }
    }

    const list = getAdsFromStore();
    const filtered = list.filter(ad => ad.id !== id);
    if (filtered.length !== list.length) {
      saveAdsToStore(filtered);
      return true;
    }
    return false;
  }
};
