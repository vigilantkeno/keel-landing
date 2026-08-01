/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        // Canonical CTA target (package contract §5). Temporary on purpose:
        // a 308 would be cached long-term and fight the real /founders page
        // when it ships — flip `permanent` to true only if this URL becomes
        // the page itself.
        source: '/founders',
        destination: '/',
        permanent: false,
      },
    ];
  },
};
export default nextConfig;
