# Tech Event Scheduler アーキテクチャドキュメント

このドキュメントは、リポジトリ移行のための参照資料です。

## 技術スタック

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **ORM**: Prisma
- **データベース**: PostgreSQL
- **UI**: Tailwind CSS, shadcn/ui, Yamada UI
- **ランタイム**: Bun

---

## データモデル

### ER図（概念）

```
User ─┬─< Owner >─ Event
      │              │
      └─< Speaker >──┤
             │       │
         Article     └─< Timer
```

### User（ユーザー）

| カラム名     | 型       | 説明                     |
| ------------ | -------- | ------------------------ |
| id           | String   | UUID (PK)                |
| supabaseId   | String   | 外部認証ID (Unique)      |
| email        | String   | メールアドレス (Unique)  |
| name         | String?  | 表示名                   |
| avatarUrl    | String?  | アバター画像URL          |
| createdAt    | DateTime | 作成日時                 |
| updatedAt    | DateTime | 更新日時                 |

**リレーション**: Owner[], Speaker[]

### Event（イベント）

| カラム名   | 型       | 説明             |
| ---------- | -------- | ---------------- |
| id         | Int      | 連番 (PK)        |
| title      | String   | イベント名       |
| eventUrl   | String?  | イベントURL      |
| attendance | Int      | 出席者数         |
| createdAt  | DateTime | 作成日時         |
| updatedAt  | DateTime | 更新日時         |

**リレーション**: Owner[], Speaker[], Timer[]

### Owner（イベントオーナー）

| カラム名 | 型       | 説明                         |
| -------- | -------- | ---------------------------- |
| id       | Int      | 連番 (PK)                    |
| userId   | String   | ユーザーID (FK)              |
| eventId  | Int      | イベントID (FK)              |
| role     | Int      | 権限 (10=管理者, 20=メンバー) |
| createdAt| DateTime | 作成日時                     |
| updatedAt| DateTime | 更新日時                     |

**ユニーク制約**: [userId, eventId]

### Article（記事）

| カラム名    | 型       | 説明       |
| ----------- | -------- | ---------- |
| id          | Int      | 連番 (PK)  |
| title       | String   | 記事タイトル |
| description | String?  | 説明       |
| url         | String?  | 記事URL    |
| createdAt   | DateTime | 作成日時   |
| updatedAt   | DateTime | 更新日時   |

**リレーション**: Speaker[]

### Speaker（スピーカー）

| カラム名  | 型       | 説明                        |
| --------- | -------- | --------------------------- |
| id        | Int      | 連番 (PK)                   |
| userId    | String   | ユーザーID (FK)             |
| eventId   | Int      | イベントID (FK)             |
| articleId | Int?     | 記事ID (FK, nullable)       |
| role      | String?  | 役割 (speaker, keynote等)   |
| createdAt | DateTime | 作成日時                    |
| updatedAt | DateTime | 更新日時                    |

**ユニーク制約**: [userId, eventId]

### Timer（タイマー）

| カラム名        | 型       | 説明           |
| --------------- | -------- | -------------- |
| id              | Int      | 連番 (PK)      |
| durationMinutes | Int      | 継続時間（分） |
| sequence        | Int      | 順番           |
| eventId         | Int      | イベントID (FK)|
| createdAt       | DateTime | 作成日時       |
| updatedAt       | DateTime | 更新日時       |

**ユニーク制約**: [eventId, sequence]

---

## 画面一覧

| パス                | 画面名           | 説明                           | 認証要否 |
| ------------------- | ---------------- | ------------------------------ | -------- |
| `/`                 | ホーム           | `/events` へリダイレクト       | -        |
| `/events`           | イベント一覧     | ログインユーザーの参加イベント一覧 | 要     |
| `/events/create`    | イベント作成     | 新規イベント作成フォーム       | 要       |
| `/events/[id]`      | イベント詳細     | イベント詳細・編集画面         | 要       |
| `/profile`          | プロフィール     | ユーザー情報編集               | 要       |

---

## API一覧（Server Actions）

### イベント関連

| Action名             | ファイル                                | 説明                     |
| -------------------- | --------------------------------------- | ------------------------ |
| `createEvent`        | `src/app/events/_actions/event.action.ts` | イベント作成             |
| `createEvent`        | `src/app/events/create/event.action.ts`   | イベント作成（別実装）   |
| `updateAttendance`   | `src/app/events/_actions/event.action.ts` | 出席者数更新             |
| `updateAttendance`   | `src/app/events/[id]/attendance.action.ts`| 出席者数更新（詳細画面用）|

### オーナー管理

| Action名             | ファイル                                | 説明                     |
| -------------------- | --------------------------------------- | ------------------------ |
| `addOwner`           | `src/app/events/_actions/owner.action.ts` | オーナー追加             |
| `addOwner`           | `src/app/events/[id]/owner.action.ts`     | オーナー追加（詳細画面用）|
| `removeOwner`        | `src/app/events/_actions/owner.action.ts` | オーナー削除             |
| `removeOwner`        | `src/app/events/[id]/owner.action.ts`     | オーナー削除（詳細画面用）|
| `addOrganizer`       | `src/app/events/_actions/owner.action.ts` | 管理者追加               |
| `addOrganizer`       | `src/app/events/[id]/organizer.action.ts` | 管理者追加（詳細画面用） |
| `changeUserRole`     | `src/app/events/_actions/owner.action.ts` | ユーザーロール変更       |
| `changeUserRole`     | `src/app/events/[id]/organizer.action.ts` | ロール変更（詳細画面用） |

### タイマー管理

| Action名               | ファイル                                  | 説明                   |
| ---------------------- | ----------------------------------------- | ---------------------- |
| `addTimerSession`      | `src/app/events/_actions/timer.action.ts` | タイマーセッション追加 |
| `addTimerSession`      | `src/app/events/[id]/event.action.ts`     | タイマー追加（詳細用） |
| `updateTimerSession`   | `src/app/events/_actions/timer.action.ts` | タイマーセッション更新 |
| `updateTimerSession`   | `src/app/events/[id]/event.action.ts`     | タイマー更新（詳細用） |
| `deleteTimerSession`   | `src/app/events/_actions/timer.action.ts` | タイマーセッション削除 |
| `deleteTimerSession`   | `src/app/events/[id]/event.action.ts`     | タイマー削除（詳細用） |
| `reorderTimerSessions` | `src/app/events/_actions/timer.action.ts` | タイマー順序変更       |
| `reorderTimerSessions` | `src/app/events/[id]/event.action.ts`     | 順序変更（詳細用）     |

### ユーザー検索

| Action名              | ファイル                                   | 説明                    |
| --------------------- | ------------------------------------------ | ----------------------- |
| `searchUserByEmail`   | `src/app/events/_actions/user.action.ts`   | メールでユーザー検索    |
| `searchUserByEmailAuth`| `src/app/events/_actions/user.action.ts`  | 認証付きユーザー検索    |
| `searchUserByEmail`   | `src/app/events/create/event.action.ts`    | ユーザー検索（作成用）  |
| `searchUserByEmail`   | `src/app/events/create/search.action.ts`   | ユーザー検索            |
| `searchUserByEmail`   | `src/app/events/[id]/organizer.action.ts`  | ユーザー検索（詳細用）  |

### プロフィール

| Action名         | ファイル                        | 説明           |
| ---------------- | ------------------------------- | -------------- |
| `updateUserName` | `src/app/profile/actions.ts`    | ユーザー名更新 |

---

## ロール定義

```typescript
const OWNER_ROLES = {
  ADMIN: 10,   // 管理者（フル権限）
  MEMBER: 20,  // メンバー（閲覧・一部編集）
};
```

---

## 注意事項

- 認証は Supabase Auth を使用していたが、移行前に削除済み
- Server Actions は Next.js 15 の機能を使用
- バリデーションは Zod スキーマを使用（`src/lib/validations/`）

