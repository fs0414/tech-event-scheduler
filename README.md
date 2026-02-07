# Tech Event Scheduler

テックイベントの管理・スケジューリングアプリケーション

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Runtime | Bun 1.2.x |
| Monorepo | Turborepo 2.x |
| Frontend | TanStack Start |
| UI Library | Yamada UI |
| CSS | Tailwind CSS 4.x |
| Linter/Formatter | oxlint |
| Backend | Elysia.js 1.4.x |
| Auth | Better Auth |
| ORM | Drizzle ORM |
| Database | Cloudflare D1 |
| Deploy | Cloudflare Workers |
| IaC | Terraform |

## セットアップ

```bash
# 依存関係のインストール
bun install

# 開発サーバー起動
bun run dev

# ビルド
bun run build

# Lint
bun run lint

# 型チェック
bun run typecheck
```

## Docker開発

```bash
docker compose up
```

## プロジェクト構成

```
├── apps/
│   ├── web/          # TanStack Start フロントエンド
│   └── api/          # Elysia.js バックエンド
├── packages/
│   ├── db/           # Drizzle ORM + D1スキーマ
│   ├── shared/       # 共有型定義・ユーティリティ
│   └── ui/           # Yamada UI拡張コンポーネント
└── infra/            # Terraform設定
```

## デプロイ

```bash
# Terraform初期化
cd infra
terraform init
terraform plan -var-file=environments/dev/terraform.tfvars

# Workers デプロイ
cd apps/web && bunx wrangler deploy
cd apps/api && bunx wrangler deploy
```