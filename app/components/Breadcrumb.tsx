'use client';

import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.url ? `https://myliitleredcar.pl${item.url}` : undefined,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav
        aria-label="Nawigacja hierarchiczna"
        className="mb-4 text-sm text-gray-600"
      >
        <ol className="flex items-center gap-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-center gap-2">
              {item.url ? (
                <>
                  <Link
                    href={item.url}
                    className="text-[#b85450] hover:underline"
                    title={item.label}
                  >
                    {item.label}
                  </Link>
                  {index < items.length - 1 && (
                    <span aria-hidden="true">/</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-gray-900 font-medium">{item.label}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
