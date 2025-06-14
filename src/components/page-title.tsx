import React from 'react';

interface PageTitleProps {
  title: string;
  children?: React.ReactNode; // For action buttons next to title
}

export function PageTitle({ title, children }: PageTitleProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
