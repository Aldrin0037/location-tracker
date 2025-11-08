'use client';

import { useState } from 'react';

interface EmbedContentProps {
  embedUrl?: string;
  html?: string;
  title?: string;
  allowFullscreen?: boolean;
}

export default function EmbedContent({
  embedUrl,
  html,
  title = 'Embedded Content',
  allowFullscreen = true
}: EmbedContentProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (html) {
    // Render custom HTML
    return (
      <div className="card">
        <div
          className="embed-html-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  }

  if (embedUrl) {
    // Render iframe embed
    return (
      <div className="card">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading {title}...</p>
              </div>
            </div>
          )}
          <iframe
            src={embedUrl}
            title={title}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={allowFullscreen}
            onLoad={() => setIsLoading(false)}
            style={{ border: 'none' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
      <p className="text-yellow-800 dark:text-yellow-200">
        ⚠️ No embed content configured. Please set embedUrl or html in your configuration.
      </p>
    </div>
  );
}

