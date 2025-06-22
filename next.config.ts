import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'lh3.googleusercontent.com', // Google user profile images
      'googleusercontent.com',
      'avatars.githubusercontent.com', // GitHub avatars if you add GitHub auth later
    ],
  },

  // Optimized build settings for Vercel
  output: 'standalone', // Creates a standalone build that's more portable and starts faster

  // Static optimization where possible
  staticPageGenerationTimeout: 120, // Increase timeout for static page generation (in seconds)

  // Add build-time environment variable for detecting Vercel
  env: {
    IS_VERCEL_DEPLOYMENT: process.env.VERCEL === '1' ? 'true' : 'false',
  },
};

export default nextConfig;
