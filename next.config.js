/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      // {
      //   protocol: "https",
      //   hostname: "i.scdn.co",
      //   port: "",
      //   pathname: "/image/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "newjams-images.scdn.co",
      //   port: "",
      //   pathname: "/image/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "mosaic.scdn.co",
      //   port: "",
      //   pathname: "/image/**",
      // },
    ],
  },
};

module.exports = nextConfig;
