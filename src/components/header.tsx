"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/providers";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  isPublic?: boolean;
}

export function Header({ isPublic = false }: HeaderProps) {
  const { supabaseUser, dbUser } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-bold text-primary hover:text-primary-hover transition-colors"
          >
            テクスケ
          </Link>

          {supabaseUser && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                {dbUser?.avatarUrl || supabaseUser.user_metadata.avatar_url ? (
                  <Image
                    src={
                      dbUser?.avatarUrl || supabaseUser.user_metadata.avatar_url
                    }
                    alt={
                      dbUser?.name ||
                      supabaseUser.user_metadata.full_name ||
                      "User"
                    }
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {supabaseUser.user_metadata.full_name?.[0] ||
                        supabaseUser.email?.[0]?.toUpperCase()}
                    </span>
                  </div>
                )}
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {dbUser?.name ||
                        supabaseUser.user_metadata.full_name ||
                        "ユーザー"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {supabaseUser.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/events"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      イベント一覧
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      プロフィール
                    </Link>
                  </div>
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    ログアウト
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
