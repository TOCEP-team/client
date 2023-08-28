/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "img.freepik.com"
      },
      {
        protocol: 'https',
        hostname: "course-vbi.s3.us-east-1.amazonaws.com"
      }
    ]
  }
}

module.exports = nextConfig
