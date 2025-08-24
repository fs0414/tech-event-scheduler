import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import { getCurrentUserForPage } from '@/lib/auth-helpers';
import EventDetailClient from '@/components/event-detail-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

async function getEventData(id: number) {
  return await prisma.event.findUnique({
    where: { id },
    include: {
      owners: {
        include: { 
          user: true 
        }
      },
      speakers: {
        include: { 
          user: true,
          article: true
        }
      },
      timers: true
    }
  });
}


interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  const event = await getEventData(eventId);

  if (!event) {
    notFound();
  }

  // 現在のユーザーを取得
  const currentUser = await getCurrentUserForPage();

  return (
    <Suspense fallback={<EventDetailLoadingSkeleton />}>
      <EventDetailClient event={event} currentUser={currentUser} />
    </Suspense>
  );
}

function EventDetailLoadingSkeleton() {
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

      {/* Event Details Skeleton */}
      <Card className="mb-8">
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div>
                      <Skeleton className="h-6 w-12 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <Card>
        <div className="border-b px-6">
          <div className="flex space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-4">
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}