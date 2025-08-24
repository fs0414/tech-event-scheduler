import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getCurrentUserWithAutoCreate } from '@/lib/auth-helpers';
import EventCreateClient from '@/components/event-create-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

// This page uses cookies for authentication, so it must be dynamic
export const dynamic = 'force-dynamic';

export default async function EventCreatePage() {
  try {
    // 認証ユーザー取得（自動作成付き）
    const currentUser = await getCurrentUserWithAutoCreate();

    return (
      <Suspense fallback={<EventCreateLoadingSkeleton />}>
        <EventCreateClient 
          currentUser={currentUser}
        />
      </Suspense>
    );
  } catch (error) {
    // 認証エラーの場合はログインページにリダイレクト
    redirect('/auth/login');
  }
}

function EventCreateLoadingSkeleton() {
  return (
    <div className="container max-w-4xl py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      {/* Form Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}