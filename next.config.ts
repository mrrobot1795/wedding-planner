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
};

export default nextConfig;
