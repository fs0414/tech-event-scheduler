"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuthentication } from "@/lib/auth-helpers";
import { OWNER_ROLES } from "@/lib/owner-role";
import { prisma } from "@/lib/prisma";
import {
  createEventFormSchema,
  updateAttendanceSchema,
} from "@/lib/validations/event";

// イベント作成
export async function createEvent(formData: FormData) {
  try {
    // 認証確認とユーザー情報取得
    const { dbUser: currentUser } = await requireAuthentication();

    // フォームデータを取得・変換
    const rawData = {
      title: formData.get("title") as string,
      eventUrl: formData.get("eventUrl") as string,
      attendance: formData.get("attendance") as string,
      ownerIds: formData.getAll("ownerIds") as string[],
    };

    // Zodスキーマでバリデーション
    const validationResult = createEventFormSchema.safeParse(rawData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new Error(firstError?.message || "入力データが無効です");
    }

    const { title, eventUrl, attendance, ownerIds } = validationResult.data;

    // 作成者が必ずownerIdsに含まれているか確認
    if (!ownerIds.includes(currentUser.id)) {
      ownerIds.push(currentUser.id);
    }

    // 指定されたオーナーIDが全て有効か確認
    if (ownerIds.length > 0) {
      const validOwners = await prisma.user.findMany({
        where: {
          id: {
            in: ownerIds,
          },
        },
        select: {
          id: true,
        },
      });

      if (validOwners.length !== ownerIds.length) {
        throw new Error("無効なオーナーIDが含まれています");
      }
    }

    // トランザクションでイベントとオーナー関係を作成
    const result = await prisma.$transaction(async (tx) => {
      // イベントを作成
      const event = await tx.event.create({
        data: {
          title,
          eventUrl,
          attendance,
        },
      });

      // オーナー関係を作成
      if (ownerIds.length > 0) {
        const ownerData = ownerIds.map((ownerId) => ({
          userId: ownerId,
          eventId: event.id,
          role:
            ownerId === currentUser.id ? OWNER_ROLES.ADMIN : OWNER_ROLES.MEMBER,
        }));

        await tx.owner.createMany({
          data: ownerData,
        });
      }

      return event;
    });

    // キャッシュを無効化
    revalidatePath("/events");
    revalidatePath(`/events/${result.id}`);
    revalidateTag(`events:user:${currentUser.id}`);
    revalidateTag("events:list");
    revalidateTag(`events:stats:${currentUser.id}`);

    // 作成したイベントページにリダイレクト
    redirect(`/events/${result.id}`);
  } catch (error: any) {
    console.error("イベント作成エラー:", error);
    throw error;
  }
}

// 出席者数の更新
export async function updateAttendance(eventId: number, newAttendance: number) {
  try {
    const { dbUser: currentUser } = await requireAuthentication();

    // Zodスキーマでバリデーション
    const validationResult = updateAttendanceSchema.safeParse({
      eventId,
      attendance: newAttendance,
    });
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      throw new Error(firstError?.message || "入力データが無効です");
    }

    const { eventId: validEventId, attendance } = validationResult.data;

    // 現在のユーザーがイベントのオーナーかチェック
    const isOwner = await prisma.owner.findFirst({
      where: {
        eventId: validEventId,
        userId: currentUser.id,
      },
    });

    if (!isOwner) {
      throw new Error("このイベントの出席者数を更新する権限がありません");
    }

    // 出席者数を更新
    const updatedEvent = await prisma.event.update({
      where: { id: validEventId },
      data: { attendance },
    });

    revalidatePath(`/events/${validEventId}`);
    revalidateTag(`event:${validEventId}`);
    revalidateTag(`events:user:${currentUser.id}`);
    revalidateTag(`events:stats:${currentUser.id}`);
    return { success: true, attendance: updatedEvent.attendance };
  } catch (error) {
    console.error("Attendance update error:", error);
    throw error;
  }
}
