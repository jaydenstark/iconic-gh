// Cloudinary configuration
// Ensure you have CLOUDINARY_URL or these individual variables in your .env.local

export const cloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

export const getCloudinaryUrl = (publicId: string) => {
  // Basic helper to generate a cloudinary URL if not using the cloudinary package directly
  const cloudName = cloudinaryConfig.cloudName;
  if (!cloudName) return '';
  return `https://res.cloudinary.com/${cloudName}/image/upload/${publicId}`;
};
