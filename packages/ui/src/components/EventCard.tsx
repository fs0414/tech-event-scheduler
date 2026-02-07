/**
 * イベントカードコンポーネント - 型安全な実装
 */

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  HStack,
  Tag,
} from "@yamada-ui/react";
import type { FC, ReactNode } from "react";
import {
  formatDateRangeJST,
  isPast,
  isOngoing,
} from "@tech-event-scheduler/shared";

// === 型定義 ===

/**
 * イベントカードの基本プロパティ
 */
interface EventCardBaseProps {
  /** イベントタイトル */
  readonly title: string;
  /** イベント説明 */
  readonly description: string;
  /** 開始日 */
  readonly startDate: Date;
  /** 終了日 */
  readonly endDate: Date;
  /** 開催場所（オプション） */
  readonly location?: string | null;
  /** イベントURL（オプション） */
  readonly url?: string | null;
}

/**
 * イベントカードのアクションプロパティ
 */
interface EventCardActionProps {
  /** 詳細ボタンクリック時のコールバック */
  readonly onViewDetails?: () => void;
  /** 編集ボタンクリック時のコールバック */
  readonly onEdit?: () => void;
  /** 削除ボタンクリック時のコールバック */
  readonly onDelete?: () => void;
}

/**
 * イベントカードの表示オプション
 */
interface EventCardDisplayOptions {
  /** 説明の最大行数（デフォルト: 2） */
  readonly descriptionLineClamp?: number;
  /** コンパクト表示モード */
  readonly compact?: boolean;
  /** カスタムフッター */
  readonly customFooter?: ReactNode;
}

/**
 * EventCardコンポーネントのプロパティ
 */
export interface EventCardProps
  extends EventCardBaseProps,
    EventCardActionProps,
    EventCardDisplayOptions {}

// === コンポーネント ===

/**
 * イベントカードコンポーネント
 *
 * イベント情報を表示するカードUIコンポーネント。
 * 日付表示、場所タグ、アクションボタンを提供します。
 *
 * @example
 * ```tsx
 * <EventCard
 *   title="React Conf 2025"
 *   description="Reactの最新動向を学ぶカンファレンス"
 *   startDate={new Date("2025-03-15")}
 *   endDate={new Date("2025-03-16")}
 *   location="東京"
 *   onViewDetails={() => console.log("View details")}
 * />
 * ```
 */
export const EventCard: FC<EventCardProps> = ({
  title,
  description,
  startDate,
  endDate,
  location,
  url,
  onViewDetails,
  onEdit,
  onDelete,
  descriptionLineClamp = 2,
  compact = false,
  customFooter,
}) => {
  const isPastEvent = isPast(endDate);
  const isOngoingEvent = isOngoing(startDate, endDate);

  const getStatusTag = () => {
    if (isPastEvent) {
      return <Tag colorScheme="gray">終了</Tag>;
    }
    if (isOngoingEvent) {
      return <Tag colorScheme="green">開催中</Tag>;
    }
    return null;
  };

  return (
    <Card opacity={isPastEvent ? 0.7 : 1}>
      <CardHeader>
        <HStack justify="space-between" align="start">
          <Heading size={compact ? "sm" : "md"}>{title}</Heading>
          {getStatusTag()}
        </HStack>
      </CardHeader>

      <CardBody>
        <Text lineClamp={descriptionLineClamp} mb={4}>
          {description}
        </Text>
        <HStack gap={2} flexWrap="wrap">
          <Tag colorScheme="blue">{formatDateRangeJST(startDate, endDate)}</Tag>
          {location && <Tag colorScheme="green">{location}</Tag>}
          {url && (
            <Tag
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              colorScheme="purple"
              cursor="pointer"
            >
              リンク
            </Tag>
          )}
        </HStack>
      </CardBody>

      <CardFooter>
        {customFooter ?? (
          <HStack gap={2}>
            {onViewDetails && (
              <Button
                colorScheme="brand"
                variant="outline"
                size={compact ? "sm" : "md"}
                onClick={onViewDetails}
              >
                詳細を見る
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size={compact ? "sm" : "md"}
                onClick={onEdit}
              >
                編集
              </Button>
            )}
            {onDelete && (
              <Button
                colorScheme="red"
                variant="ghost"
                size={compact ? "sm" : "md"}
                onClick={onDelete}
              >
                削除
              </Button>
            )}
          </HStack>
        )}
      </CardFooter>
    </Card>
  );
};

// === サブコンポーネント ===

/**
 * スケルトンローディング用EventCard
 */
export const EventCardSkeleton: FC<{ compact?: boolean }> = ({
  compact = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <Heading size={compact ? "sm" : "md"}>
          <Text as="span" className="animate-pulse bg-gray-200 rounded">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Text>
        </Heading>
      </CardHeader>
      <CardBody>
        <Text lineClamp={2} mb={4} className="animate-pulse bg-gray-200 rounded">
          &nbsp;
        </Text>
        <HStack gap={2}>
          <Tag colorScheme="gray" className="animate-pulse">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          </Tag>
        </HStack>
      </CardBody>
      <CardFooter>
        <Button disabled variant="outline" size={compact ? "sm" : "md"}>
          読み込み中...
        </Button>
      </CardFooter>
    </Card>
  );
};
