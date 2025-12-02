import React from 'react';

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
 return (
  <>
    <h3 className="mb-4 text-xs font-semibold text-foreground md:text-3xl">
      {title}
    </h3>

    {subtitle && (
      <span className="text-sm font-light text-muted-foreground md:text-2xl">
        {subtitle}
      </span>
    )}
  </>
);

}
