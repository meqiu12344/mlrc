'use client';

import { ReactNode } from 'react';

interface SEOArticleProps {
  title: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  imageUrl?: string;
  children: ReactNode;
  keywords?: string[];
  category?: string;
}

export default function SEOArticle({
  title,
  description,
  author = 'My Little Red Car',
  datePublished,
  dateModified,
  imageUrl,
  children,
  keywords,
  category,
}: SEOArticleProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Little Red Car',
    },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {title}
        </h1>

        <p className="text-xl text-gray-600 mb-4">{description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b pb-4">
          <span>Autor: {author}</span>
          {datePublished && (
            <span>
              Opublikowano: {new Date(datePublished).toLocaleDateString('pl-PL')}
            </span>
          )}
          {category && <span className="bg-[#b85450]/10 px-3 py-1 rounded-full text-[#b85450]">{category}</span>}
        </div>
      </header>

      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-auto mb-8 rounded-lg"
          loading="lazy"
        />
      )}

      <div className="prose prose-lg max-w-none mb-8">
        {children}
      </div>

      {keywords && keywords.length > 0 && (
        <footer className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Słowa kluczowe:</strong> {keywords.join(', ')}
          </p>
        </footer>
      )}
    </article>
  );
}
