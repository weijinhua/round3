'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button, Input } from '@charts-gen/ui';

export function PromptBar() {
  const t = useTranslations('charts');
  const [prompt, setPrompt] = useState('');

  function handleSend() {
    if (!prompt.trim()) return;
    console.log('send prompt:', prompt);
    setPrompt('');
  }

  return (
    <div className="flex items-center gap-2 border-t border-border p-4">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={t('promptPlaceholder')}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      />
      <Button onClick={handleSend}>{t('send')}</Button>
    </div>
  );
}
