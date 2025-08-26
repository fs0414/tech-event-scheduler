import { notFound } from 'next/navigation';
import { getCurrentUserForPage } from '@/lib/auth-helpers';
import { getEventById, getEventTimers, checkEventOwnership } from '@/lib/data';
import EventDetailClient from '@/components/event-detail-client';


interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  // 現在のユーザーを取得
  const currentUser = await getCurrentUserForPage();

  // 並列でデータを取得して最適化
  const [event, timers, isOwner] = await Promise.all([
    getEventById(eventId),
    getEventTimers(eventId),
    currentUser ? checkEventOwnership(currentUser.id, eventId) : Promise.resolve(false)
  ]);

  if (!event) {
    notFound();
  }

  return <EventDetailClient event={event} currentUser={currentUser} isOwner={isOwner} />;
}