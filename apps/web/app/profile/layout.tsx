'use client';

import React from 'react';
{/* 
import ProtectedLayout from '@/components/ProtectedLayout';*/}
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  {/*return <ProtectedLayout>{children}</ProtectedLayout>;*/}
  return <>{children}</>;
}