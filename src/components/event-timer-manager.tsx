'use client';

import { useState, useTransition } from 'react';
import { Timer, Event, User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Clock, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';
import { addTimerSession, updateTimerSession, deleteTimerSession, reorderTimerSessions } from '@/app/events/_actions/timer.actions';

interface EventTimerManagerProps {
  event: Event & {
    timers: Timer[];
    owners: Array<{
      userId: string;
      user: User;
    }>;
  };
  currentUser?: { id: string; email: string; name: string | null } | null;
  isOwner: boolean;
}

export default function EventTimerManager({ event, currentUser, isOwner }: EventTimerManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newSessionDuration, setNewSessionDuration] = useState<number>(15);
  const [editingTimer, setEditingTimer] = useState<number | null>(null);
  const [editDuration, setEditDuration] = useState<number>(0);


  // タイマーをsequence順にソート
  const sortedTimers = [...event.timers].sort((a, b) => a.sequence - b.sequence);

  const handleAddSession = () => {
    if (!newSessionDuration || newSessionDuration <= 0) {
      setError('セッション時間は1分以上で入力してください');
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        await addTimerSession(event.id, isOwner, newSessionDuration);
        setNewSessionDuration(15); // デフォルトに戻す
      } catch (err) {
        setError(err instanceof Error ? err.message : 'セッションの追加に失敗しました');
      }
    });
  };

  const handleUpdateSession = (timerId: number) => {
    if (!editDuration || editDuration <= 0) {
      setError('セッション時間は1分以上で入力してください');
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        await updateTimerSession(timerId, isOwner, editDuration);
        setEditingTimer(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'セッションの更新に失敗しました');
      }
    });
  };

  const handleDeleteSession = (timerId: number) => {
    if (!confirm('このセッションを削除してもよろしいですか？')) {
      return;
    }

    startTransition(async () => {
      try {
        setError(null);
        await deleteTimerSession(timerId, isOwner);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'セッションの削除に失敗しました');
      }
    });
  };

  const startEdit = (timer: Timer) => {
    setEditingTimer(timer.id);
    setEditDuration(timer.durationMinutes);
  };

  const cancelEdit = () => {
    setEditingTimer(null);
    setEditDuration(0);
  };

  const getTotalDuration = () => {
    return sortedTimers.reduce((total, timer) => total + timer.durationMinutes, 0);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}時間${mins}分`;
    }
    return `${mins}分`;
  };

  if (!currentUser) {
    return (
      <Card className={createCardClasses('mist')}>
        <CardContent className="p-6 text-center">
          <p className={createTypographyClasses('m', 'regular', 'secondary')}>
            タイマー機能を使用するにはログインしてください
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* エラー表示 */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription className={createTypographyClasses('s', 'regular', 'body')}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* サマリーカード */}
      <Card className={createCardClasses('glacier')}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center",
                "bg-gradient-to-br from-[#00c4cc] to-[#0891b2]"
              )}>
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className={createTypographyClasses('l', 'bold', 'muted')}>
                  タイマーセッション
                </h3>
                <p className={createTypographyClasses('s', 'regular', 'secondary')}>
                  {sortedTimers.length}セッション・総時間{formatDuration(getTotalDuration())}
                </p>
              </div>
            </div>
            {sortedTimers.length > 0 && (
              <Badge className="bg-[#00c4cc] text-white">
                {sortedTimers.length}個
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* セッション追加（オーナーのみ） */}
      {isOwner && (
        <Card className={createCardClasses('soft')}>
          <CardHeader>
            <CardTitle className={createTypographyClasses('m', 'bold', 'muted')}>
              新しいセッションを追加
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="分"
                  value={newSessionDuration}
                  onChange={(e) => setNewSessionDuration(parseInt(e.target.value) || 0)}
                  min="1"
                  max="300"
                />
              </div>
              <Button
                onClick={handleAddSession}
                disabled={isPending}
                className={cn(
                  createButtonClasses('primary', 'medium'),
                  UI_CONSTANTS.transitions.default
                )}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                <span className={createTypographyClasses('s', 'medium', 'body')}>
                  追加
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* セッションリスト */}
      <div className="space-y-3">
        {sortedTimers.length === 0 ? (
          <Card className={createCardClasses('mist')}>
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className={createTypographyClasses('m', 'medium', 'muted')}>
                まだタイマーセッションがありません
              </p>
              <p className={createTypographyClasses('s', 'regular', 'secondary')}>
                {isOwner 
                  ? '上のフォームから最初のセッションを追加しましょう' 
                  : 'オーナーがセッションを追加するまでお待ちください'}
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedTimers.map((timer, index) => (
            <Card 
              key={timer.id} 
              className={cn(
                createCardClasses('glacier'),
                "border-l-4 border-l-[#00c4cc]"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isOwner && (
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-grab" />
                    )}
                    <Badge variant="outline" className="bg-[#f0fdff] border-[#00c4cc] text-[#00c4cc]">
                      セッション {timer.sequence}
                    </Badge>
                    <div>
                      {editingTimer === timer.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            value={editDuration}
                            onChange={(e) => setEditDuration(parseInt(e.target.value) || 0)}
                            className="w-20"
                            min="1"
                            max="300"
                          />
                          <span className={createTypographyClasses('s', 'regular', 'muted')}>分</span>
                          <Button
                            size="sm"
                            onClick={() => handleUpdateSession(timer.id)}
                            disabled={isPending}
                            className={createButtonClasses('success', 'small')}
                          >
                            保存
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={isPending}
                          >
                            キャンセル
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className={createTypographyClasses('m', 'bold', 'muted')}>
                            {formatDuration(timer.durationMinutes)}
                          </span>
                          {isOwner && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => startEdit(timer)}
                              disabled={isPending}
                              className="h-6 px-2 text-xs"
                            >
                              編集
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isOwner && editingTimer !== timer.id && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteSession(timer.id)}
                      disabled={isPending}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}