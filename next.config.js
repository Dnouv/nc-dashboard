/** @type {import('next').NextConfig} */
const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
		esmExternals: "loose",
	}
}

module.exports = (phase, { nextConfig }) => {
  return removeImports({
    ...nextConfig
  });
};
