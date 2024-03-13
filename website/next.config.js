/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  experimental: {
    appDir: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "mbbmnygwewvjsxsjtzbo.supabase.co",
      "s3.ap-south-1.amazonaws.com",
    ],
  },
};

module.exports = nextConfig;
