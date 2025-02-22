/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['storage.googleapis.com'],
  },
  webpack: (config, { isServer }) => {
    config.externals = [...config.externals, { canvas: "canvas" }]
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Add transpilation for undici
    config.module.rules.push({
      test: /node_modules\/undici/,
      type: "javascript/auto",
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    });

    return config
  },
}

module.exports = nextConfig

