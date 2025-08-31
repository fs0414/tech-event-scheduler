"use client";

import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EventDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Event detail error:", error);
  }, [error]);

  return (
    <div className="container max-w-2xl py-16">
      <Card className="border-destructive/50 bg-destructive/5">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl">
            イベント詳細の読み込みに失敗しました
          </CardTitle>
          <CardDescription className="mt-2">
            イベント情報を取得できませんでした。一時的な問題の可能性があります。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm text-muted-foreground">
              エラーコード: {error.digest || "UNKNOWN_ERROR"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error.message || "予期しないエラーが発生しました"}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={reset} variant="default" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              再試行
            </Button>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/events">
                <ArrowLeft className="h-4 w-4" />
                イベント一覧に戻る
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
