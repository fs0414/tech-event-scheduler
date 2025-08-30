'use client'

import { LoginForm } from '@/components/login-form'
import { UI_CONSTANTS, cn, createCardClasses, createTypographyClasses } from '@/lib/ui-constants'
import { Suspense, useEffect } from 'react'
import { useAuth } from '@/app/providers'
import { useRouter, useSearchParams } from 'next/navigation'

function LoginPageContentWithAuth() {
  const { supabaseUser, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // 認証済みの場合は自動的にリダイレクト
    if (supabaseUser && !loading) {
      const isOAuthCallback = searchParams.get('oauth_callback') === 'true';
      const next = searchParams.get('next') || '/events';
      
      // OAuthコールバック後または既に認証済みの場合
      if (isOAuthCallback || supabaseUser) {
        router.push(next);
      }
    }
  }, [supabaseUser, loading, searchParams, router]);

  // 認証チェック中はローディング表示
  if (loading) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", UI_CONSTANTS.colors.pageBg)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
          <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
            認証状態を確認中...
          </p>
        </div>
      </div>
    );
  }

  // 既に認証済みの場合はリダイレクト処理中を表示
  if (supabaseUser) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", UI_CONSTANTS.colors.pageBg)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
          <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
            リダイレクト中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen flex items-center justify-center", UI_CONSTANTS.colors.pageBg)}>
      <div className="w-full max-w-md px-6">
        {/* Logo and Title */}
        <div className={cn("text-center", UI_CONSTANTS.spacing.marginBottom)}>
          <div className={cn(
            "mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg",
            UI_CONSTANTS.colors.primary,
            UI_CONSTANTS.transitions.default
          )}>
            <span className={cn(createTypographyClasses('xl', 'bold', 'body'))}>
              T
            </span>
          </div>
          <h1 className={cn(createTypographyClasses('xxl', 'bold', 'body'), "mb-2")}>
            テクスケ
          </h1>
          <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
            技術イベントスケジューラー
          </p>
        </div>

        {/* Login Card */}
        <div className={cn(
          createCardClasses('default'),
          UI_CONSTANTS.spacing.cardPadding,
          "shadow-xl"
        )}>
          <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
            <h2 className={cn(createTypographyClasses('xl', 'semibold', 'body'), "mb-2")}>
              ようこそ
            </h2>
            <p className={cn(createTypographyClasses('s', 'regular', 'muted'))}>
              Googleアカウントでログインして開始
            </p>
          </div>

          {/* Login Form Component with OAuth handling */}
          <Suspense fallback={
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
              <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
                読み込み中...
              </p>
            </div>
          }>
            <LoginForm />
          </Suspense>

          <div className={cn("mt-6 text-center")}>
            <p className={cn(createTypographyClasses('xxs', 'regular', 'muted'))}>
              初めての方は自動でアカウントが作成されます
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className={cn(
          "text-center mt-8",
          createTypographyClasses('xxs', 'regular', 'muted')
        )}>
          © 2024 テクスケ. All rights reserved.
        </p>
      </div>
    </div>
  )
}

function LoginPageContent() {
  return (
    <Suspense fallback={
      <div className={cn("min-h-screen flex items-center justify-center", UI_CONSTANTS.colors.pageBg)}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
          <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
            読み込み中...
          </p>
        </div>
      </div>
    }>
      <LoginPageContentWithAuth />
    </Suspense>
  );
}

export default function Page() {
  return <LoginPageContent />
}