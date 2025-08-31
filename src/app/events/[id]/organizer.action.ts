"use server";

import { revalidatePath } from "next/cache";
import { requireAuthentication } from "@/lib/auth-helpers";
import { OWNER_ROLES } from "@/lib/owner-role";
import { prisma } from "@/lib/prisma";

export async function searchUserByEmail(email: string) {
  try {
    const { dbUser: currentUser } = await requireAuthentication();

    const sanitizedEmail = email.toLowerCase().trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return null;
    }

    const foundUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (foundUser && foundUser.id === currentUser.id) {
      return null;
    }

    return foundUser;
  } catch (error: any) {
    console.error("ユーザー検索エラー:", error);
    throw error;
  }
}

export async function addOrganizer(
  eventId: number,
  isOwner: boolean,
  userEmail: string,
) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error("このイベントの管理権限がありません");
    }

    // 認証確認とユーザー情報取得（なりすまし防止のため維持）
    const { dbUser } = await requireAuthentication();

    const sanitizedEmail = userEmail.toLowerCase().trim();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitizedEmail)) {
      throw new Error("有効なメールアドレスを入力してください");
    }

    const targetUser = await prisma.user.findUnique({
      where: { email: sanitizedEmail },
      select: { id: true, name: true, email: true },
    });

    if (!targetUser) {
      throw new Error("指定されたメールアドレスのユーザーが見つかりません");
    }

    const existingOwner = await prisma.owner.findUnique({
      where: {
        userId_eventId: {
          userId: targetUser.id,
          eventId: eventId,
        },
      },
    });

    if (existingOwner) {
      throw new Error("このユーザーは既に参加者として登録されています");
    }

    await prisma.owner.create({
      data: {
        userId: targetUser.id,
        eventId: eventId,
        role: OWNER_ROLES.ADMIN,
      },
    });

    revalidatePath(`/events/${eventId}`);

    return { success: true, user: targetUser };
  } catch (error: any) {
    console.error("管理者追加エラー:", error);
    throw error;
  }
}

export async function changeUserRole(
  ownerId: number,
  eventId: number,
  isOwner: boolean,
  newRole: number,
) {
  try {
    // 権限チェック（Props経由）
    if (!isOwner) {
      throw new Error("このイベントの管理権限がありません");
    }

    // 認証確認とユーザー情報取得（なりすまし防止のため維持）
    const { dbUser } = await requireAuthentication();

    if (newRole !== OWNER_ROLES.ADMIN && newRole !== OWNER_ROLES.MEMBER) {
      throw new Error("無効なロールです");
    }

    await prisma.owner.update({
      where: { id: ownerId },
      data: { role: newRole },
    });

    revalidatePath(`/events/${eventId}`);

    return { success: true };
  } catch (error: any) {
    console.error("ロール変更エラー:", error);
    throw error;
  }
}
