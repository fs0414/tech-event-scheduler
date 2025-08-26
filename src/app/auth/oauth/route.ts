import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/events'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/events'
  }
  
  // Ensure we have a valid redirect path
  if (!next || next === '/') {
    next = '/events'
  }
  
  // OAuth成功後の初回ログイン判定用パラメータを追加
  next = next.includes('?') ? `${next}&oauth_callback=true` : `${next}?oauth_callback=true`
  

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'

      console.log('🩵', { origin, forwardedHost, isLocalEnv, next })
      
      let redirectUrl
      if (isLocalEnv) {
        redirectUrl = `${origin}${next}`
      } else if (forwardedHost) {
        redirectUrl = `https://${forwardedHost}${next}`
      } else {
        redirectUrl = `${origin}${next}`
      }
      
      return NextResponse.redirect(redirectUrl)
    } else {
      console.error('OAuth error:', error)
    }
  } else {
    console.log('No code parameter found')
  }

  // return the user to an error page with instructions
  console.log('Redirecting to error page')
  return NextResponse.redirect(`${origin}/auth/error`)
}
