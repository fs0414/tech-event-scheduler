'use client'

import { LoginForm } from '@/components/login-form'
import { UI_CONSTANTS, cn, createCardClasses, createTypographyClasses } from '@/lib/ui-constants'
import { useSearchParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export default function Page() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isProcessingCode, setIsProcessingCode] = useState(false)
  
  // OAuthコード処理
  useEffect(() => {
    const code = searchParams.get('code')
    if (code && !isProcessingCode) {
      setIsProcessingCode(true)
      const supabase = createClient()
      
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) {
          router.push('/events')
        } else {
          console.error('OAuth error:', error)
          // エラーの場合はcodeパラメータを削除
          const url = new URL(window.location.href)
          url.searchParams.delete('code')
          window.history.replaceState({}, '', url.toString())
          setIsProcessingCode(false)
        }
      })
    }
  }, [searchParams, router, isProcessingCode])
  
  // OAuthコード処理中の表示
  if (isProcessingCode) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", UI_CONSTANTS.colors.pageBg)}>
        <div className="w-full max-w-md px-6">
          <div className={cn(
            createCardClasses('default'),
            UI_CONSTANTS.spacing.cardPadding,
            "shadow-xl text-center"
          )}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
            <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
              ログイン処理中...
            </p>
          </div>
        </div>
      </div>
    )
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

          {/* Login Form Component */}
          <LoginForm />

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