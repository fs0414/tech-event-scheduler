/**
 * ホームページ
 */

import { createFileRoute } from "@tanstack/react-router";
import {
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Button,
  HStack,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@yamada-ui/react";
import { useCallback, useEffect, useState } from "react";
import { PageLayout, EventCard, EventCardSkeleton } from "@tech-event-scheduler/ui";
import { isSuccess, toISO8601, type EventResponse } from "@tech-event-scheduler/shared";
import { api } from "~/lib/api-client";

// === 型定義 ===

interface EventsState {
  readonly data: readonly EventResponse[];
  readonly loading: boolean;
  readonly error: string | null;
}

// === ルート定義 ===

export const Route = createFileRoute("/")({
  component: HomePage,
});

// === コンポーネント ===

function HomePage() {
  const [eventsState, setEventsState] = useState<EventsState>({
    data: [],
    loading: true,
    error: null,
  });

  // イベント一覧を取得
  const fetchEvents = useCallback(async () => {
    setEventsState((prev) => ({ ...prev, loading: true, error: null }));

    const response = await api.events.list();

    if (isSuccess(response)) {
      setEventsState({
        data: response.data,
        loading: false,
        error: null,
      });
    } else {
      setEventsState({
        data: [],
        loading: false,
        error: response.error.message,
      });
    }
  }, []);

  // 初回読み込み
  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  // イベント詳細を表示
  const handleViewDetails = useCallback((eventId: string) => {
    console.log(`View event: ${eventId}`);
    // TODO: ルーターでイベント詳細ページに遷移
  }, []);

  // デモ用のフォールバックイベント
  const now = new Date();
  const demoEvents: readonly EventResponse[] = [
    {
      id: "1",
      title: "React Conf 2025",
      description:
        "Reactの最新動向を学ぶカンファレンス。新機能やベストプラクティスについて深く学べます。",
      startDate: toISO8601(new Date("2025-03-15")),
      endDate: toISO8601(new Date("2025-03-16")),
      location: "東京",
      url: null,
      organizerId: "demo-user",
      createdAt: toISO8601(now),
      updatedAt: toISO8601(now),
    },
    {
      id: "2",
      title: "TypeScript Meetup",
      description:
        "TypeScriptの実践的な使い方を共有するミートアップ。初心者から上級者まで参加可能。",
      startDate: toISO8601(new Date("2025-03-20")),
      endDate: toISO8601(new Date("2025-03-20")),
      location: "オンライン",
      url: null,
      organizerId: "demo-user",
      createdAt: toISO8601(now),
      updatedAt: toISO8601(now),
    },
    {
      id: "3",
      title: "DevOps Days Tokyo",
      description: "DevOpsの文化とプラクティスを学ぶ2日間のイベント。",
      startDate: toISO8601(new Date("2025-04-01")),
      endDate: toISO8601(new Date("2025-04-02")),
      location: "渋谷",
      url: null,
      organizerId: "demo-user",
      createdAt: toISO8601(now),
      updatedAt: toISO8601(now),
    },
  ];

  // 表示するイベント（API取得失敗時はデモデータを表示）
  const displayEvents =
    eventsState.data.length > 0 ? eventsState.data : demoEvents;

  return (
    <PageLayout>
      <VStack gap={8} align="stretch">
        {/* ヘッダーセクション */}
        <VStack gap={4} align="center" textAlign="center">
          <Heading size="2xl">Tech Event Scheduler</Heading>
          <Text fontSize="lg" color="gray.600">
            テックイベントを見つけて、参加しよう
          </Text>
          <HStack gap={4}>
            <Button colorScheme="primary" size="lg">
              イベントを探す
            </Button>
            <Button variant="outline" size="lg">
              イベントを作成
            </Button>
          </HStack>
        </VStack>

        {/* エラー表示 */}
        {eventsState.error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{eventsState.error}</AlertDescription>
          </Alert>
        )}

        {/* イベント一覧セクション */}
        <VStack gap={4} align="stretch">
          <HStack justify="space-between" align="center">
            <Heading size="lg">注目のイベント</Heading>
            <Button variant="ghost" size="sm" onClick={() => void fetchEvents()}>
              更新
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {eventsState.loading ? (
              // ローディングスケルトン
              <>
                <EventCardSkeleton />
                <EventCardSkeleton />
                <EventCardSkeleton />
              </>
            ) : (
              // イベントカード一覧
              displayEvents.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  startDate={new Date(event.startDate)}
                  endDate={new Date(event.endDate)}
                  location={event.location}
                  url={event.url}
                  onViewDetails={() => handleViewDetails(event.id)}
                />
              ))
            )}
          </SimpleGrid>
        </VStack>
      </VStack>
    </PageLayout>
  );
}
