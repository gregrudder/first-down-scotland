import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "a.espncdn.com", pathname: "/**" },
      { protocol: "https", hostname: "**.espncdn.com", pathname: "/**" },
      { protocol: "https", hostname: "ichef.bbci.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "**.bbci.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "**.bbcimg.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "i.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "**.guim.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "**.pcdn.co", pathname: "/**" },
      { protocol: "https", hostname: "**.wp.com", pathname: "/**" },
      { protocol: "https", hostname: "www.rotowire.com", pathname: "/**" },
      { protocol: "https", hostname: "**.rotowire.com", pathname: "/**" },
      {
        protocol: "https",
        hostname: "www.thefantasyfootballers.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "thefantasyfootballers.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
