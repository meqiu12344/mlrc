'use client';

import Image from 'next/image';
import { ImgHTMLAttributes } from 'react';

interface SEOImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  src: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: 'contain' | 'cover' | 'fill' | 'scale-down';
}

export default function SEOImage({
  src,
  alt,
  title,
  width,
  height,
  priority = false,
  objectFit = 'cover',
  className,
  ...props
}: SEOImageProps) {
  // Check if it's an external URL
  const isExternal = src.startsWith('http');

  if (isExternal) {
    // Use regular img tag for external images
    return (
      <img
        src={src}
        alt={alt}
        title={title || alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        {...props}
      />
    );
  }

  // Use Next.js Image for local images
  return (
    <Image
      src={src}
      alt={alt}
      title={title || alt}
      width={width || 800}
      height={height || 600}
      priority={priority}
      quality={85}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
      className={className}
      {...props}
    />
  );
}
