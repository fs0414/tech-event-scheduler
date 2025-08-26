'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function EventsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログをコンソールに出力（本番環境では外部サービスに送信）
    console.error('Events page error:', error);
  }, [error]);

  return (
    <div className="container max-w-2xl py-16">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">イベント一覧の読み込みに失敗しました</CardTitle>
          <CardDescription className="mt-2">
            申し訳ございません。イベント情報の取得中にエラーが発生しました。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              エラーコード: {error.digest || 'UNKNOWN_ERROR'}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message || '予期しないエラーが発生しました'}
            </p>
          </div>
          
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              onClick={reset}
              variant="default"
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              再試行
            </Button>
            <Button
              asChild
              variant="outline"
              className="gap-2"
            >
              <Link href="/">
                <Home className="h-4 w-4" />
                ホームに戻る
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}