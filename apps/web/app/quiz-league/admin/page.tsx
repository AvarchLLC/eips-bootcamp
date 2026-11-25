'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function QuizLeagueAdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/admin/quizzes');
  }, [router]);

  return null;
}
