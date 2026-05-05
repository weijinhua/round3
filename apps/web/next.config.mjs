import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./shared/lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Temporarily disable transpiling workspace packages to avoid long dev compile times.
  // If this fixes the dev hang, consider selectively transpiling only packages that need ESM -> CJS transformation.
};

export default withNextIntl(nextConfig);
