const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
    ],
  },
  turbopack: {
    // Set the root directory to your project root (where your package.json is)
    root: path.join(__dirname),
  },
};

export default nextConfig;