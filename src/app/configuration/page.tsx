'use client';

import { ConfigRoutes } from '@/types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from '@/components/ui/button';

export default function AddPage() {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-full py-10">
      <Button
        onClick={() => router.push(ConfigRoutes.PROJECT_INFO)}
        variant="default"
      >
        Edit Configuration
      </Button>
    </div>
  );
}

