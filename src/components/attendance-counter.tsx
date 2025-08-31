"use client";

import { Loader2, Plus, UserCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { updateAttendance } from "@/app/events/_actions/event.action";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  cn,
  createButtonClasses,
  createTypographyClasses,
  UI_CONSTANTS,
} from "@/lib/ui-constants";
import type { AttendanceCounterProps } from "@/types/events";

export default function AttendanceCounter({
  currentAttendance,
  eventId,
  isOwner,
}: AttendanceCounterProps) {
  const [attendance, setAttendance] = useState(currentAttendance);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAttendanceChange = (increment: number) => {
    // 楽観的UI更新
    const newAttendance = Math.max(0, attendance + increment);
    setAttendance(newAttendance);

    startTransition(async () => {
      try {
        setError(null);
        const result = await updateAttendance(eventId, newAttendance);
        // サーバーから最新の値をリアルタイムで反映
        if (result.attendance !== undefined) {
          setAttendance(result.attendance);
        }
      } catch (error: any) {
        setError(error.message);
        // エラーの場合は元の値に戻す
        setAttendance(currentAttendance);
      }
    });
  };

  if (!isOwner) {
    // オーナーでない場合は表示のみ
    return (
      <Card className={cn(UI_CONSTANTS.transitions.default)}>
        <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div
              className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}
            >
              <UserCheck
                className={cn("h-5 w-5", UI_CONSTANTS.colors.primaryText)}
              />
              <span className={createTypographyClasses("m", "medium", "body")}>
                現在の出席者数
              </span>
            </div>
            <div className={createTypographyClasses("xxl", "bold", "primary")}>
              {attendance}人
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // オーナーの場合はカウンター機能付き
  return (
    <div className="space-y-2">
      {error && (
        <Alert
          variant="destructive"
          className={cn(UI_CONSTANTS.transitions.default)}
        >
          <AlertDescription
            className={createTypographyClasses("s", "regular", "body")}
          >
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card
        className={cn(
          UI_CONSTANTS.transitions.default,
          UI_CONSTANTS.states.hover,
        )}
      >
        <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div
              className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}
            >
              <UserCheck
                className={cn("h-5 w-5", UI_CONSTANTS.colors.primaryText)}
              />
              <span className={createTypographyClasses("s", "medium", "muted")}>
                現在の出席者数
              </span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3">
              <div
                className={createTypographyClasses("xxl", "bold", "primary")}
              >
                {attendance}人
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => handleAttendanceChange(-1)}
                  disabled={isPending || attendance === 0}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  -
                </Button>

                <Button
                  onClick={() => handleAttendanceChange(1)}
                  disabled={isPending}
                  size="sm"
                  className={cn(
                    "h-8 w-8 p-0",
                    createButtonClasses("primary", "small"),
                    isPending && UI_CONSTANTS.states.disabled,
                  )}
                >
                  {isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
