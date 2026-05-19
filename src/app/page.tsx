import React from 'react';
import { HeroCarousel } from '@/components/home/HeroCarousel';
import { TrendingTicker } from '@/components/home/TrendingTicker';
import { FeaturedGrid } from '@/components/home/FeaturedGrid';
import { CategorySection } from '@/components/home/CategorySection';
import { VideoSection } from '@/components/home/VideoSection';

export default function Home() {
  return (
    <div>
      <TrendingTicker />
      <HeroCarousel />
      <FeaturedGrid />
      <VideoSection />
      <CategorySection />
    </div>
  );
}
