# 日時設計ガイドライン

## 設計原則

| レイヤー | 形式 | 例 |
|---------|------|-----|
| **データベース** | Unix timestamp (integer, 秒, UTC) | `1710460800` |
| **API通信** | ISO8601 UTC文字列 | `"2025-03-15T00:00:00.000Z"` |
| **表示** | JST (Asia/Tokyo) | `2025年3月15日` |

## 型定義

### ISO8601String（Branded Type）

API通信で使用する日時文字列の型。通常のstringと区別するためBranded Typeを使用。

```typescript
import { toISO8601, type ISO8601String } from "@tech-event-scheduler/shared";

// Date → ISO8601String
const iso: ISO8601String = toISO8601(new Date());
// => "2025-03-15T00:00:00.000Z"

// ISO8601String → Date
import { fromISO8601 } from "@tech-event-scheduler/shared";
const date: Date = fromISO8601(iso);
```

### UnixTimestamp

データベース保存用の型（内部使用）。

```typescript
import { toUnixTimestamp, fromUnixTimestamp } from "@tech-event-scheduler/shared";

const timestamp = toUnixTimestamp(new Date()); // 1710460800
const date = fromUnixTimestamp(timestamp);
```

## 表示用フォーマット関数

すべてJST (Asia/Tokyo) で表示。

```typescript
import {
  formatDateJST,         // "2025年3月15日"
  formatDateShortJST,    // "2025/03/15"
  formatDateTimeJST,     // "2025年3月15日 14:30"
  formatTimeJST,         // "14:30"
  formatDateRangeJST,    // "2025年3月15日 - 3月16日"
} from "@tech-event-scheduler/shared";
```

## 判定ユーティリティ

```typescript
import {
  isPast,       // 過去かどうか
  isFuture,     // 未来かどうか
  isToday,      // 今日かどうか (JST基準)
  isOngoing,    // 開催中かどうか
} from "@tech-event-scheduler/shared";

// イベントが終了しているか
if (isPast(event.endDate)) {
  // 終了済み
}

// イベントが開催中か
if (isOngoing(event.startDate, event.endDate)) {
  // 開催中
}
```

## DTO型での使用

```typescript
interface EventResponse {
  id: string;
  title: string;
  /** ISO8601 UTC形式 */
  startDate: ISO8601String;
  /** ISO8601 UTC形式 */
  endDate: ISO8601String;
  // ...
}
```

## 実装例

### APIでの変換

```typescript
// apps/api/src/routes/events.ts
import { eventToResponse } from "@tech-event-scheduler/shared";

// DBエンティティ (Date) → レスポンス (ISO8601String)
const response = eventToResponse(dbEvent);
```

### フロントエンドでの表示

```typescript
// 日付表示
const displayDate = formatDateRangeJST(
  fromISO8601(event.startDate),
  fromISO8601(event.endDate)
);
// => "2025年3月15日 - 3月16日"
```

### UIコンポーネントでの使用

```tsx
<EventCard
  startDate={fromISO8601(event.startDate)}
  endDate={fromISO8601(event.endDate)}
/>
```

## 注意事項

1. **DBには常にUTCで保存** - タイムゾーン変換はアプリケーション層で行う
2. **APIは常にISO8601 UTC** - `Z`サフィックス付きの文字列
3. **表示は常にJST** - `formatXxxJST`関数を使用
4. **DateオブジェクトはUTCとして扱う** - JSのDateはUTCで管理される
