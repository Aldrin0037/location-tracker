'use client';

interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-200 dark:border-amber-900 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      {text && (
        <p className="mt-4 text-gray-600 dark:text-gray-400 animate-pulse">{text}</p>
      )}
    </div>
  );
}

