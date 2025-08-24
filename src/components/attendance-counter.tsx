'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { updateAttendance } from '@/app/events/[id]/attendance-actions';
import { UserCheck, Plus, Loader2 } from 'lucide-react';
import type { AttendanceCounterProps } from '@/types/events';
import { UI_CONSTANTS, cn, createButtonClasses, createTypographyClasses } from '@/lib/ui-constants';

export default function AttendanceCounter({ currentAttendance, eventId, isOwner }: AttendanceCounterProps) {
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
        if (result.newAttendance !== undefined) {
          setAttendance(result.newAttendance);
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
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
              <UserCheck className={cn("h-5 w-5", UI_CONSTANTS.colors.primaryText)} />
              <span className={createTypographyClasses('m', 'medium', 'body')}>現在の出席者数</span>
            </div>
            <div className={createTypographyClasses('xxl', 'bold', 'primary')}>
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
        <Alert variant="destructive" className={cn(UI_CONSTANTS.transitions.default)}>
          <AlertDescription className={createTypographyClasses('s', 'regular', 'body')}>{error}</AlertDescription>
        </Alert>
      )}
      
      <Card className={cn(UI_CONSTANTS.transitions.default, UI_CONSTANTS.states.hover)}>
        <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
          <div className="flex items-center justify-between">
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
              <UserCheck className={cn("h-5 w-5", UI_CONSTANTS.colors.primaryText)} />
              <span className={createTypographyClasses('s', 'medium', 'muted')}>現在の出席者数</span>
            </div>
            
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.gap)}>
              <div className={createTypographyClasses('xxl', 'bold', 'primary')}>
                {attendance}人
              </div>
              
              <Button
                onClick={() => handleAttendanceChange(1)}
                disabled={isPending}
                className={cn(
                  createButtonClasses('primary', 'medium'),
                  isPending && UI_CONSTANTS.states.disabled,
                  UI_CONSTANTS.transitions.bounce
                )}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    <span className={createTypographyClasses('s', 'medium', 'body')}>更新中</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
