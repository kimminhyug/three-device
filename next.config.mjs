/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["my-ts-package"],
  //   webpack: (
  //     config,
  //     { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  //   ) => {
  //     const prod = process.env.MODE_ENV === "production";
  //     // Important: return the modified config
  //     return {
  //       ...config,
  //       mode: mode ? "production" : "development",
  //       dev: true,
  //       devtool: prod ? "hidden-source-map" : "eval",
  //     };
  //   },
};

export default nextConfig;
