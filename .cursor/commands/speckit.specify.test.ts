// @ts-nocheck
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import { describe, expect, it } from 'vitest';

const commandPath = fileURLToPath(new URL('./speckit.specify.md', import.meta.url));
const commandText = readFileSync(commandPath, 'utf8');

describe('speckit.specify command', () => {
  it('supports existing feature directories before the legacy flow', () => {
    expect(commandText).toContain('### Directory Mode');
    expect(commandText).toContain('Use `FEATURE_DIR/prd.md` as the primary input.');
    expect(commandText).toContain('fall back to `FEATURE_DIR/spec.md`');
    expect(commandText).toContain('In Directory Mode, SPEC_FILE is `FEATURE_DIR/spec.md`.');
    expect(commandText).toContain('### Legacy Description Mode');
  });
});
