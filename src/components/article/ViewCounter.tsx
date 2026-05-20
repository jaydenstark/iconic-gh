'use client';

import React, { useState, useEffect } from 'react';
import { Eye } from 'lucide-react';
import { ArticlesService } from '@/services/articles';

interface ViewCounterProps {
  articleId: string;
  initialViews: number;
}

export const ViewCounter = ({ articleId, initialViews }: ViewCounterProps) => {
  const [views, setViews] = useState(initialViews);

  useEffect(() => {
    // 1. Increment the view count on client mount
    const increment = async () => {
      const updated = await ArticlesService.incrementViews(articleId);
      if (updated) {
        setViews(updated.views);
      }
    };
    increment();
  }, [articleId]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
      <Eye size={16} />
      <span style={{ transition: 'color 0.3s ease' }}>
        {views.toLocaleString()} views
      </span>
    </div>
  );
};
