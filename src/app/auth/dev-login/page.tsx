"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function DevLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 開発用プリセットユーザー
  const devUsers = [
    { email: "tanaka.taro@gmail.com", name: "田中太郎" },
    { email: "suzuki.hanako@gmail.com", name: "鈴木花子" },
    { email: "sato.kenichi@gmail.com", name: "佐藤健一" },
    { email: "takahashi.misaki@gmail.com", name: "高橋美咲" },
    { email: "ito.takashi@gmail.com", name: "伊藤隆" },
  ];

  // Supabaseユーザーを自動作成する関数
  const tryCreateUser = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/dev-create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // まず通常のログインを試行
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // ログインに失敗した場合、ユーザーが存在しない可能性があるので自動作成を試行
        setMessage("Supabaseユーザーが存在しません。自動作成中...");
        const createResult = await tryCreateUser(email, password);
        if (createResult.success) {
          setMessage("ユーザーを作成しました。ログイン中...");
          // 作成成功後、再度ログインを試行
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (retryError) throw retryError;
        } else {
          throw new Error(createResult.error || signInError.message);
        }
      }

      router.push("/events");
    } catch (error: any) {
      setError(error.message);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string) => {
    setEmail(userEmail);
    setPassword("password123"); // 開発用の共通パスワード

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // まず通常のログインを試行
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: "password123",
      });

      if (signInError) {
        // ログインに失敗した場合、ユーザーが存在しない可能性があるので自動作成を試行
        setMessage(
          `${userEmail} のSupabaseユーザーが存在しません。自動作成中...`,
        );
        const createResult = await tryCreateUser(userEmail, "password123");
        if (createResult.success) {
          setMessage("ユーザーを作成しました。ログイン中...");
          // 作成成功後、再度ログインを試行
          const { error: retryError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: "password123",
          });
          if (retryError) throw retryError;
        } else {
          throw new Error(
            createResult.error || `${userEmail} のユーザー作成に失敗しました`,
          );
        }
      }

      router.push("/events");
    } catch (error: any) {
      setError(error.message);
      setMessage(null);
    } finally {
      setLoading(false);
    }
  };

  if (process.env.NODE_ENV === "production") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            アクセス拒否
          </h1>
          <p className="text-gray-600">
            この機能は開発環境でのみ利用可能です。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            開発用ログイン
          </h2>
          <p className="mt-2 text-center text-sm text-orange-600">
            ⚠️ 開発環境専用
          </p>
        </div>

        {/* クイックログイン */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            クイックログイン
          </h3>
          <div className="space-y-2">
            {devUsers.map((user) => (
              <button
                key={user.email}
                onClick={() => handleQuickLogin(user.email)}
                disabled={loading}
                className="w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            パスワード: password123（全ユーザー共通）
          </p>
        </div>

        {/* カスタムログインフォーム */}
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              カスタムログイン
            </h3>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  メールアドレス
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="メールアドレス"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="パスワード"
                />
              </div>
            </div>

            {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

            {message && (
              <div className="mt-4 text-sm text-blue-600">{message}</div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "ログイン中..." : "ログイン"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
