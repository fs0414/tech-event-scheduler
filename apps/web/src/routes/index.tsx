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
  Card,
  CardBody,
  CardHeader,
  Badge,
} from "@yamada-ui/react";
import { useCallback, useEffect, useState } from "react";
import { PageLayout } from "@tech-event-scheduler/ui";
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

/**
 * イベントカード（シンプル版）
 */
function SimpleEventCard({
  event,
  onViewDetails,
}: {
  event: EventResponse;
  onViewDetails: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <HStack justify="space-between">
          <Heading size="md">{event.title}</Heading>
          <Badge colorScheme="blue">{event.attendance}人参加</Badge>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={2}>
          {event.eventUrl && (
            <Text fontSize="sm" color="blue.500">
              {event.eventUrl}
            </Text>
          )}
          <Text fontSize="xs" color="gray.500">
            作成日: {new Date(event.createdAt).toLocaleDateString("ja-JP")}
          </Text>
          <Button size="sm" variant="outline" onClick={onViewDetails}>
            詳細を見る
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}

/**
 * イベントカードスケルトン
 */
function EventCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Heading size="md" color="gray.300">
          読み込み中...
        </Heading>
      </CardHeader>
      <CardBody>
        <VStack align="stretch" gap={2}>
          <Text fontSize="sm" color="gray.300">
            ・・・・・・
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
}

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
  const handleViewDetails = useCallback((eventId: number) => {
    console.log(`View event: ${eventId}`);
    // TODO: ルーターでイベント詳細ページに遷移
  }, []);

  // デモ用のフォールバックイベント
  const now = new Date();
  const demoEvents: readonly EventResponse[] = [
    {
      id: 1,
      title: "React Conf 2025",
      eventUrl: "https://reactconf.dev",
      attendance: 150,
      createdAt: toISO8601(now),
      updatedAt: toISO8601(now),
    },
    {
      id: 2,
      title: "TypeScript Meetup",
      eventUrl: null,
      attendance: 50,
      createdAt: toISO8601(now),
      updatedAt: toISO8601(now),
    },
    {
      id: 3,
      title: "DevOps Days Tokyo",
      eventUrl: "https://devopsdays.org",
      attendance: 200,
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
                <SimpleEventCard
                  key={event.id}
                  event={event}
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
