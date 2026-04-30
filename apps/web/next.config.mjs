import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./shared/lib/i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@charts-gen/ui', '@charts-gen/design-system'],
};

export default withNextIntl(nextConfig);
