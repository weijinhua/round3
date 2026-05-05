// @ts-nocheck
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

import { describe, expect, it } from 'vitest';

const commandPath = fileURLToPath(new URL('./speckit.specify.md', import.meta.url));
const commandText = readFileSync(commandPath, 'utf8');

describe('speckit.specify command', () => {
  it('keeps the natural-language branch flow intact', () => {
    expect(commandText).toContain('The text the user typed after `/speckit.specify` in the triggering message **is** the feature description.');
    expect(commandText).toContain('Generate a concise short name');
    expect(commandText).toContain('Create the feature branch');
    expect(commandText).toContain('Load `.specify/templates/spec-template.md` to understand required sections.');
  });

  it('normalizes explicit feature paths to the short feature identifier', () => {
    expect(commandText).toContain('normalize it to the short feature identifier `000-ui-foundation`');
    expect(commandText).toContain('This applies to `000-ui-foundation`, `specs/features/000-ui-foundation`, and `specs/features/000-ui-foundation/spec.md`.');
    expect(commandText).toContain('continue exactly as if the user had typed `000-ui-foundation`');
  });

  it('opts into reusing an existing feature branch', () => {
    expect(commandText).toContain('-AllowExistingBranch');
    expect(commandText).toContain('create-new-feature.ps1 "$ARGUMENTS" -Json -AllowExistingBranch');
  });
});
