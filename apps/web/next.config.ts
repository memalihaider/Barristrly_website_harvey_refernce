import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [],
  async redirects() {
    return [
      { source: "/products", destination: "/services", permanent: true },
      { source: "/products/:slug*", destination: "/services", permanent: true },
      {
        source: "/marketplace",
        destination: "/services/lawyer-matching",
        permanent: true,
      },
      {
        source: "/enterprise",
        destination: "/services/vlo-fractional-gc",
        permanent: true,
      },
      {
        source: "/find-lawyers",
        destination: "/services/lawyer-matching",
        permanent: true,
      },
      { source: "/card-stack", destination: "/services", permanent: true },
      { source: "/ai", destination: "/services", permanent: true },
      {
        source: "/ai/research",
        destination: "/services",
        permanent: true,
      },
      { source: "/ai/draft", destination: "/services/contract-drafting", permanent: true },
      { source: "/ai/review", destination: "/services/contract-drafting", permanent: true },
      { source: "/ai/agents", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;
