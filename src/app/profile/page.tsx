import { redirect } from "next/navigation";
import ProfileClient from "@/components/profile-client";
import { getCurrentUserWithAutoCreate } from "@/lib/auth-helpers";

export default async function ProfilePage() {
  try {
    // 認証ユーザー取得
    const dbUser = await getCurrentUserWithAutoCreate();

    return <ProfileClient user={dbUser} />;
  } catch (error) {
    console.error("Profile page error:", error);
    redirect("/auth/login");
  }
}
