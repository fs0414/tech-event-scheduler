import { notFound } from 'next/navigation';
import { getCurrentUserForPage } from '@/lib/auth-helpers';
import { getEventWithOwnership } from '@/lib/data';
import EventDetailClient from '@/components/event-detail-client';
import { BenchmarkLogger } from '@/lib/benchmark';


interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const eventId = parseInt(id);
  
  if (isNaN(eventId)) {
    notFound();
  }

  // ページ全体の処理時間計測開始
  BenchmarkLogger.start('EventDetailPage_Total');

  // 現在のユーザーを取得
  const currentUser = await BenchmarkLogger.measure(
    'EventDetailPage_GetCurrentUser',
    () => getCurrentUserForPage(),
    { eventId }
  );

  // 統合されたクエリでデータを取得（パフォーマンス最適化）
  const eventData = await BenchmarkLogger.measure(
    'EventDetailPage_GetEventData',
    () => getEventWithOwnership(eventId, currentUser?.id),
    { eventId, userId: currentUser?.id }
  );

  if (!eventData) {
    BenchmarkLogger.end('EventDetailPage_Total', { eventId, result: 'notFound' });
    notFound();
  }

  const { event, isOwner } = eventData;

  // ページ全体の処理時間計測終了
  BenchmarkLogger.end('EventDetailPage_Total', {
    eventId,
    userId: currentUser?.id,
    isOwner,
    eventTitle: event.title
  });

  return <EventDetailClient event={event} currentUser={currentUser} isOwner={isOwner} />;
}