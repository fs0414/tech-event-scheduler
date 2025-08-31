import { redirect } from "next/navigation";
import EventCreateClient from "@/components/event-create-client";
import { getCurrentUserWithAutoCreate } from "@/lib/auth-helpers";

// This page uses cookies for authentication, so it must be dynamic
export const dynamic = "force-dynamic";

export default async function EventCreatePage() {
  try {
    // 認証ユーザー取得（自動作成付き）
    const currentUser = await getCurrentUserWithAutoCreate();

    return <EventCreateClient currentUser={currentUser} />;
  } catch (error) {
    // 認証エラーの場合はログインページにリダイレクト
    redirect("/auth/login");
  }
}
