/**
 * Formatting and Utility Helpers
 */

/**
 * Format date string or object to standard readable format
 * e.g., '2026-05-19T10:00:00.000Z' -> 'May 19, 2026'
 */
export const formatDate = (dateInput: Date | string | number | null | undefined): string => {
  if (!dateInput) return '';
  const date = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Shorten numbers for stats display
 * e.g., 1420 -> '1.4k'
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'm';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

/**
 * Calculate estimated reading time for body text paragraphs
 */
export const calculateReadTime = (paragraphs: string[] | string): string => {
  const text = Array.isArray(paragraphs) ? paragraphs.join(' ') : paragraphs;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 225)); // average reading speed 225 wpm
  return `${minutes} min read`;
};

/**
 * Format currency numbers for advertising / billing stats
 * e.g., 4250.75 -> '$4,250.75'
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};
