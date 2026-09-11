import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["maplibre-gl"],
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
      { protocol: "https", hostname: "**.mzstatic.com", pathname: "/**" },
      { protocol: "https", hostname: "yt3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "**.ggpht.com", pathname: "/**" },
      { protocol: "https", hostname: "rookieplaybook.co.uk", pathname: "/**" },
      { protocol: "https", hostname: "www.rookieplaybook.co.uk", pathname: "/**" },
    ],
  },
};

export default nextConfig;
