'use client';

import { useState } from 'react';
import { CenteredLayout, FormPattern, Input, Card, CardHeader, CardTitle, CardContent } from '@charts-gen/ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('login:', email);
  }

  return (
    <CenteredLayout>
      <Card>
        <CardHeader>
          <CardTitle>登录</CardTitle>
        </CardHeader>
        <CardContent>
          <FormPattern onSubmit={handleSubmit} submitLabel="登录">
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </FormPattern>
        </CardContent>
      </Card>
    </CenteredLayout>
  );
}
