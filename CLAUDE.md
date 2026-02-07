# Tech Event Scheduler

テックイベント管理・スケジューリングアプリケーション

## 技術スタック

- **Runtime**: Bun 1.3.x
- **Monorepo**: Turborepo
- **Frontend**: TanStack Start + React 19 + Yamada UI + Tailwind CSS 4
- **Backend**: Elysia.js 1.4
- **Auth**: Better Auth
- **ORM**: Drizzle ORM
- **Database**: Cloudflare D1 / libSQL
- **Deploy**: Cloudflare Workers/Pages
- **Linter**: oxlint

## ディレクトリ構造

```
apps/
  api/     # Elysia.js バックエンドAPI
  web/     # TanStack Start フロントエンド
packages/
  db/      # Drizzle ORM スキーマ・リポジトリ
  shared/  # 共有型定義・スキーマ・ユーティリティ
  ui/      # 共有UIコンポーネント
infra/     # Terraform設定
```

## 開発コマンド

```bash
bun install       # 依存関係インストール
bun run dev       # 開発サーバー起動（Turbo並列実行）
bun run build     # ビルド
bun run lint      # oxlint実行
bun run typecheck # 型チェック
bun run format    # フォーマット
```

## コーディング規約

- TypeScript strict mode
- oxlintの規約に従う
- 共有型はpackages/sharedに定義
- DBスキーマ変更時はpackages/dbでマイグレーション生成

## ワークスペース依存関係

- `@tech-event-scheduler/shared` - 共有型・ユーティリティ
- `@tech-event-scheduler/db` - データベース層
- `@tech-event-scheduler/ui` - UIコンポーネント
