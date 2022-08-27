/* @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

// const withPlugins = require("next-compose-plugins");
// const withFonts = require("next-fonts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  optimizeFonts: false,
  compiler: {
    styledComponents: true
  }
}

module.exports = nextConfig
// module.exports = withPlugins(
//   [
//     [withFonts],
//     // ...
//   ],
//   nextConfig
// );
