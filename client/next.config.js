/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      // Only needed for development
      {
        protocol: "http",
        hostname: "172.17.0.1",
        port: "3000",
        pathname: "/static/images/**"
      }
    ]
  }
};

module.exports = nextConfig;
