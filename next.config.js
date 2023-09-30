/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.module.rules.push({
          test: /\.geojson$/,
          use: ['raw-loader'],
        });
      }
  
      return config;
    },
  };