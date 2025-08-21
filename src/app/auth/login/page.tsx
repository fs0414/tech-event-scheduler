'use client'

import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full max-w-md px-6">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            テクスケ
          </h1>
          <p className="text-gray-600">
            技術イベントスケジューラー
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              ようこそ
            </h2>
            <p className="text-sm text-gray-600">
              Googleアカウントでログインして開始
            </p>
          </div>

          {/* Login Form Component */}
          <LoginForm />

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              初めての方は自動でアカウントが作成されます
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          © 2024 テクスケ. All rights reserved.
        </p>
      </div>
    </div>
  )
}