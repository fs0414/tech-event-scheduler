'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { UI_CONSTANTS, cn, createButtonClasses, createTypographyClasses, createCardClasses } from '@/lib/ui-constants'

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingCode, setIsProcessingCode] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  
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
          setError('ログインに失敗しました。もう一度お試しください。')
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
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00c4cc] mx-auto mb-4"></div>
        <p className={cn(createTypographyClasses('m', 'regular', 'muted'))}>
          ログイン処理中...
        </p>
      </div>
    )
  }

  const handleSocialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?next=/events`,
        },
      })

      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={cn(className)} {...props}>
      <form onSubmit={handleSocialLogin}>
        <div className={cn(UI_CONSTANTS.spacing.gap, "flex flex-col")}>
          {error && (
            <div className={cn(
              createCardClasses('default'),
              UI_CONSTANTS.spacing.sectionPadding,
              "border-red-200 bg-red-50"
            )}>
              <p className={cn(
                createTypographyClasses('s', 'regular', 'body'),
                "text-center text-red-600"
              )}>
                {error}
              </p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "w-full flex items-center justify-center",
              UI_CONSTANTS.spacing.gap,
              UI_CONSTANTS.buttons.large,
              UI_CONSTANTS.colors.cardBg,
              UI_CONSTANTS.colors.border,
              UI_CONSTANTS.radius.button,
              UI_CONSTANTS.transitions.default,
              UI_CONSTANTS.states.focus,
              createTypographyClasses('m', 'medium', 'body'),
              "hover:bg-gray-50 hover:border-gray-400",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <svg className={cn("animate-spin h-5 w-5", UI_CONSTANTS.colors.mutedText)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>ログイン中...</span>
              </>
            ) : (
              <>
                {/* Google Logo SVG */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M5.84 7.07c-1.44 1.01-2.84 2.04-2.84 4.93s1.4 3.92 2.84 4.93V14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.7 4.21 1.82l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Googleでログイン</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}