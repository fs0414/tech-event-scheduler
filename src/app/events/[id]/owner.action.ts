"use server";

import { revalidatePath } from "next/cache";
import { requireAuthentication } from "@/lib/auth-helpers";
import { OWNER_ROLES } from "@/lib/owner-role";
import { prisma } from "@/lib/prisma";

export async function addOwner(
  eventId: number,
  isOwner: boolean,
  userEmail: string,
) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error("このイベントの管理権限がありません");
    }

    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();

    const sanitizedEmail = userEmail.toLowerCase().trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error("無効なメールアドレス形式です");
    }

    // 追加するユーザーを検索
    const targetUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
    });

    if (!targetUser) {
      throw new Error("指定されたメールアドレスのユーザーが見つかりません");
    }

    // 既にオーナーかどうか確認
    const existingOwner = await prisma.owner.findFirst({
      where: {
        eventId: eventId,
        userId: targetUser.id,
      },
    });

    if (existingOwner) {
      throw new Error("このユーザーは既にオーナーです");
    }

    // オーナーとして追加
    await prisma.owner.create({
      data: {
        eventId: eventId,
        userId: targetUser.id,
        role: OWNER_ROLES.MEMBER,
      },
    });

    // ページをリロード
    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error: any) {
    console.error("オーナー追加エラー:", error);
    throw error;
  }
}

export async function removeOwner(
  eventId: number,
  isOwner: boolean,
  userId: string,
) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error("このイベントの管理権限がありません");
    }

    // 認証確認とユーザー情報取得
    const { dbUser } = await requireAuthentication();

    // 自分自身は削除できない
    if (userId === dbUser.id) {
      throw new Error("自分自身をオーナーから削除することはできません");
    }

    // オーナーを削除
    await prisma.owner.deleteMany({
      where: {
        eventId: eventId,
        userId: userId,
      },
    });

    // ページをリロード
    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error: any) {
    console.error("オーナー削除エラー:", error);
    throw error;
  }
}
