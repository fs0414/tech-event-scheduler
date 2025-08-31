"use server";

import { revalidatePath } from "next/cache";
import { requireAuthentication } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function updateUserName(formData: FormData) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();

    const name = formData.get("name") as string;

    // バリデーション
    const sanitizedName = name?.trim();
    if (!sanitizedName || sanitizedName.length === 0) {
      throw new Error("名前は必須です");
    }
    if (sanitizedName.length > 100) {
      throw new Error("名前は100文字以内で入力してください");
    }

    // ユーザー名を更新
    await prisma.user.update({
      where: { id: dbUser.id },
      data: { name: sanitizedName },
    });

    // キャッシュをクリア
    revalidatePath("/profile");
    revalidatePath("/events");

    return { success: true };
  } catch (error: any) {
    console.error("ユーザー名更新エラー:", error);
    return { success: false, error: error.message };
  }
}
