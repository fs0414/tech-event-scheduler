# Tech Event Scheduler

イベント管理システムです。イベントの作成、管理者・スピーカーの管理、タイマー機能を提供します。

## 技術スタック

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **Deployment**: Vercel

## セットアップ手順

### 1. 前提条件

- Node.js 18以上
- pnpm
- Supabase アカウント

### 2. プロジェクトのクローンと依存関係インストール

```bash
git clone <repository-url>
cd tech-event-scheduler
pnpm install
```

### 3. Supabase プロジェクトのセットアップ

1. [Supabase](https://supabase.com) でアカウントを作成
2. 新しいプロジェクトを作成
3. プロジェクトの設定から以下の情報を取得：
   - Project URL
   - Anon public key
   - Database URL

### 4. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Database
DATABASE_URL="postgresql://postgres.xxx:password@xxx.supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.xxx:password@xxx.supabase.co:5432/postgres"
```

### 5. Supabase Auth設定

Supabase の Authentication セクションで以下を設定：

1. **Providers**: GitHub OAuth を有効にする
2. **URL Configuration**:
   - Site URL: `http://localhost:3050` (開発環境)
   - Redirect URLs: 
     - `http://localhost:3050/auth/callback`
     - `https://your-domain.vercel.app/auth/callback` (本番環境)

### 6. データベースマイグレーション

```bash
# Prismaクライアントの生成
pnpm prisma generate

# データベーススキーマの適用
pnpm prisma db push

# （オプション）初期データの投入
pnpm db:seed
```

### 7. 開発サーバーの起動

```bash
pnpm dev
```

サーバーが起動したら、ブラウザで [http://localhost:3050](http://localhost:3050) にアクセスしてください。

## 主な機能

- **認証**: GitHub OAuth によるログイン
- **イベント管理**: イベントの作成・編集・削除
- **管理者機能**: イベント管理者の追加・削除
- **スピーカー機能**: 登壇者の管理
- **タイマー機能**: セッション用タイマーの作成・実行
- **出席者管理**: イベント参加者数の管理

## 利用可能なスクリプト

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# コード整形・リント
pnpm check
pnpm check:fix

# データベース関連
pnpm prisma generate    # Prismaクライアント生成
pnpm prisma db push     # スキーマをDBに適用
pnpm db:seed           # 初期データ投入
```

## プロジェクト構造

```
src/
├── app/                 # Next.js App Router
│   ├── auth/           # 認証関連ページ
│   ├── events/         # イベント管理機能
│   └── api/            # API Routes
├── components/         # Reactコンポーネント
├── lib/               # ユーティリティ・設定
├── types/             # TypeScript型定義
└── prisma/            # Prismaスキーマ・マイグレーション
```

## デプロイ

### Vercelへのデプロイ

1. Vercel に GitHub リポジトリを連携
2. 環境変数を Vercel の Settings で設定
3. ビルドコマンドを `pnpm vercel-build` に設定
4. デプロイ実行

### 環境変数（本番環境）

本番環境では以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-supabase-anon-key
DATABASE_URL=your-production-database-url
DIRECT_URL=your-production-direct-url
```

## トラブルシューティング

### よくある問題

1. **認証エラー**: Supabase の Redirect URLs が正しく設定されているか確認
2. **データベース接続エラー**: `DATABASE_URL` と `DIRECT_URL` が正しく設定されているか確認
3. **Prisma エラー**: `pnpm prisma generate` を実行してクライアントを再生成

### ログの確認

開発環境では、ブラウザの開発者ツールとターミナルでログを確認できます。

## コントリビューション

1. フィーチャーブランチを作成
2. 変更を実装
3. テストを実行
4. プルリクエストを作成

## ライセンス

MIT License