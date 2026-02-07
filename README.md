# Tech Event Scheduler

テックイベントの管理・スケジューリングアプリケーション

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| Runtime | Bun 1.3.x |
| Monorepo | Turborepo 2.x |
| Frontend | TanStack Start (React 19) |
| Build | Vite 7.x |
| UI Library | Yamada UI |
| CSS | Tailwind CSS 4.x |
| Validation | Zod |
| Linter/Formatter | oxlint |
| Backend | Elysia.js 1.4.x |
| Auth | Better Auth |
| ORM | Drizzle ORM |
| Database | Cloudflare D1 / libSQL |
| Deploy | Cloudflare Workers / Pages |
| IaC | Terraform |
| Task Runner | Task (Taskfile) |

## 必要なツール

- [Bun](https://bun.sh/) 1.3.x
- [mise](https://mise.jdx.dev/) - ランタイムバージョン管理
- [Task](https://taskfile.dev/) - タスクランナー
- [Docker](https://www.docker.com/) - ローカル開発用

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

## Taskコマンド

```bash
# 開発
task dev              # 全アプリの開発サーバー起動
task dev:web          # Webのみ起動
task dev:api          # APIのみ起動

# ビルド
task build            # 全パッケージビルド
task build:web        # Webのみビルド
task build:api        # APIのみビルド

# コード品質
task lint             # リント実行
task format           # フォーマット実行
task typecheck        # 型チェック
task check            # lint + typecheck

# データベース
task db:generate      # マイグレーション生成
task db:migrate       # マイグレーション実行
task db:push          # スキーマをDBに直接プッシュ (開発用)
task db:studio        # Drizzle Studio起動

# デプロイ
task deploy:web       # Webをデプロイ
task deploy:api       # APIをデプロイ
task deploy:all       # 全アプリをデプロイ
```

## Docker開発

```bash
# 開発環境を起動
docker compose up -d

# ファイル変更を監視して自動同期
docker compose watch

# ログを表示
docker compose logs -f

# 停止
docker compose down
```

### サービス構成

| サービス | ポート | 説明 |
|---------|--------|------|
| web | 3040 | フロントエンド |
| api | 3050 | バックエンドAPI |
| db | 8080, 5001 | libSQL (D1互換) |

## プロジェクト構成

```
├── apps/
│   ├── web/          # TanStack Start フロントエンド
│   └── api/          # Elysia.js バックエンド
├── packages/
│   ├── db/           # Drizzle ORM + libSQLスキーマ
│   ├── shared/       # 共有型定義・Zodスキーマ・ユーティリティ
│   └── ui/           # Yamada UI拡張コンポーネント
├── infra/            # Terraform設定
│   ├── environments/ # 環境別設定 (dev/prod)
│   └── modules/      # Terraformモジュール
└── docs/             # 設計ドキュメント
```

## 環境変数

### API (apps/api)

| 変数名 | 説明 |
|--------|------|
| PORT | APIサーバーポート |
| DATABASE_URL | libSQL接続URL |
| CORS_ORIGIN | CORSを許可するオリジン |
| BETTER_AUTH_SECRET | 認証シークレット |
| BETTER_AUTH_URL | 認証ベースURL |

### Web (apps/web)

| 変数名 | 説明 |
|--------|------|
| VITE_API_URL | APIサーバーURL |

## デプロイ

```bash
# Terraform初期化
task tf:init
task tf:plan          # dev環境
task tf:plan:prod     # prod環境

# Terraform適用
task tf:apply         # dev環境
task tf:apply:prod    # prod環境

# アプリケーションデプロイ
task deploy:api       # APIをCloudflare Workersにデプロイ
task deploy:web       # WebをCloudflare Pagesにデプロイ
```

## 本番環境URL

https://tech-event-scheduler-web.workers.dev