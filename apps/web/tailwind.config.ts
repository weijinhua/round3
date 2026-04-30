import type { Config } from 'tailwindcss';
import { tailwindPreset } from '../../packages/design-system/tailwind.preset';

const config: Config = {
  presets: [tailwindPreset],
  content: [
    './app/**/*.{ts,tsx}',
    './features/**/*.{ts,tsx}',
    './shared/**/*.{ts,tsx}',
    '../../packages/design-system/**/*.tsx',
  ],
  plugins: [],
};

export default config;
