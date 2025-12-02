import { ConfigRoutes } from '@/types';
import { redirect } from 'next/navigation';
import React from 'react';

export default function AddPage() {
  redirect(ConfigRoutes.PROJECT_INFO);
}
