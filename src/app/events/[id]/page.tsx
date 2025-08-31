import { notFound } from "next/navigation";
import EventDetailClient from "@/components/event-detail-client";
import { getCurrentUserForPage } from "@/lib/auth-helpers";
import { getEventWithOwnership } from "@/lib/data";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { id } = await params;
  const eventId = parseInt(id);

  if (isNaN(eventId)) {
    notFound();
  }

  // 現在のユーザーを取得
  const currentUser = await getCurrentUserForPage();

  // 統合されたクエリでデータを取得（パフォーマンス最適化）
  const eventData = await getEventWithOwnership(eventId, currentUser?.id);

  if (!eventData) {
    notFound();
  }

  const { event, isOwner } = eventData;

  return (
    <EventDetailClient
      event={event}
      currentUser={currentUser}
      isOwner={isOwner}
    />
  );
}
