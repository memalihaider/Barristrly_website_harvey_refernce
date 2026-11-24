import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [],
  async redirects() {
    return [
      { source: "/products", destination: "/services", permanent: true },
      { source: "/products/:slug*", destination: "/services", permanent: true },
      { source: "/marketplace", destination: "/services", permanent: true },
      { source: "/enterprise", destination: "/services/retainers", permanent: true },
      { source: "/find-lawyers", destination: "/services", permanent: true },
      { source: "/card-stack", destination: "/services", permanent: true },
      { source: "/ai", destination: "/services", permanent: true },
      { source: "/ai/research", destination: "/services", permanent: true },
      { source: "/ai/draft", destination: "/services/contract-drafting", permanent: true },
      { source: "/ai/review", destination: "/services/contract-drafting", permanent: true },
      { source: "/ai/agents", destination: "/services", permanent: true },
      // Retired Phase-1 catalog slugs → finalized six services
      {
        source: "/services/lawyer-matching",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/consultation",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/ebooks-pro",
        destination: "/services/agreements-ebooks",
        permanent: true,
      },
      {
        source: "/services/banking-capital",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/marketing-pr",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/services/vlo-fractional-gc",
        destination: "/services/retainers",
        permanent: true,
      },
      {
        source: "/services/ip-brand",
        destination: "/services",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
