/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
    NEXT_PUBLIC_LEGITIMATE_PORTAL: process.env.NEXT_PUBLIC_LEGITIMATE_PORTAL || '/legitimo',
  },
};

export default nextConfig;
