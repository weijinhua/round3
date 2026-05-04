import React from 'react';

export type AvatarProps = {
  src?: string;
  alt?: string;
  size?: number;
  name?: string;
};

export const Avatar: React.FC<AvatarProps> = ({ src, alt = 'avatar', size = 32, name }) => {
  const initials = name ? name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '';
  return src ? (
    <img src={src} alt={alt} width={size} height={size} className="rounded-full" />
  ) : (
    <div
      className="rounded-full bg-[var(--color-muted)] text-white flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden={!!src}
    >
      {initials}
    </div>
  );
};

export default Avatar;

