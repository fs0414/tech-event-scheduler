import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import EventDetailClient from '@/components/event-detail-client';

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

  return (
    <Suspense fallback={<EventDetailLoadingSkeleton />}>
      <EventDetailClient event={event} />
    </Suspense>
  );
}

function EventDetailLoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-9 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Event Details Skeleton */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="p-6">
          <div className="mb-6">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <div className="h-8 bg-gray-200 rounded w-12 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200 px-6">
          <div className="flex space-x-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="py-4">
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}