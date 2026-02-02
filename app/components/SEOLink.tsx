'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface SEOLinkProps {
  href: string;
  children: ReactNode;
  title?: string;
  ariaLabel?: string;
  className?: string;
  onClick?: () => void;
}

export default function SEOLink({
  href,
  children,
  title,
  ariaLabel,
  className,
  onClick,
}: SEOLinkProps) {
  return (
    <Link
      href={href}
      title={title}
      aria-label={ariaLabel}
      className={className}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
