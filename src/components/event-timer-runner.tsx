'use client';

import { useState, useEffect, useRef } from 'react';
import { Timer } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, Square, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';

interface EventTimerRunnerProps {
  timers: Timer[];
  currentUser?: { id: string; email: string; name: string | null } | null;
}

type TimerState = 'stopped' | 'running' | 'paused' | 'finished';

export default function EventTimerRunner({ timers, currentUser }: EventTimerRunnerProps) {
  const [currentTimerIndex, setCurrentTimerIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>('stopped');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // タイマーをsequence順にソート
  const sortedTimers = [...timers].sort((a, b) => a.sequence - b.sequence);
  const currentTimer = sortedTimers[currentTimerIndex];

  // タイマー初期化
  useEffect(() => {
    if (currentTimer && remainingSeconds === 0 && timerState === 'stopped') {
      setRemainingSeconds(currentTimer.durationMinutes * 60);
    }
  }, [currentTimer, remainingSeconds, timerState]);

  // タイマー実行
  useEffect(() => {
    if (timerState === 'running' && remainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // タイマー終了
            setTimerState('finished');
            playNotificationSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timerState, remainingSeconds]);

  const playNotificationSound = () => {
    // ブラウザの音声通知
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('タイマーが終了しました');
      utterance.lang = 'ja-JP';
      utterance.volume = 0.5;
      speechSynthesis.speak(utterance);
    }
    
    // ビープ音を再生（Web Audio API）
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const handleStart = () => {
    setTimerState('running');
  };

  const handlePause = () => {
    setTimerState('paused');
  };

  const handleStop = () => {
    setTimerState('stopped');
    if (currentTimer) {
      setRemainingSeconds(currentTimer.durationMinutes * 60);
    }
  };

  const handleNext = () => {
    if (currentTimerIndex < sortedTimers.length - 1) {
      const nextIndex = currentTimerIndex + 1;
      setCurrentTimerIndex(nextIndex);
      setRemainingSeconds(sortedTimers[nextIndex].durationMinutes * 60);
      setTimerState('stopped');
    }
  };

  const handlePrevious = () => {
    if (currentTimerIndex > 0) {
      const prevIndex = currentTimerIndex - 1;
      setCurrentTimerIndex(prevIndex);
      setRemainingSeconds(sortedTimers[prevIndex].durationMinutes * 60);
      setTimerState('stopped');
    }
  };

  const handleFinishAndNext = () => {
    if (currentTimerIndex < sortedTimers.length - 1) {
      handleNext();
    } else {
      setTimerState('stopped');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    if (!currentTimer) return 0;
    const totalSeconds = currentTimer.durationMinutes * 60;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  const getStateColor = () => {
    switch (timerState) {
      case 'running':
        return 'text-[#16a34a]';
      case 'paused':
        return 'text-[#eab308]';
      case 'finished':
        return 'text-[#dc2626]';
      default:
        return 'text-[#6b7280]';
    }
  };

  const getStateText = () => {
    switch (timerState) {
      case 'running':
        return '実行中';
      case 'paused':
        return '一時停止';
      case 'finished':
        return '終了';
      default:
        return '待機中';
    }
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

  if (sortedTimers.length === 0) {
    return (
      <Card className={createCardClasses('mist')}>
        <CardContent className="p-6 text-center">
          <p className={createTypographyClasses('m', 'regular', 'secondary')}>
            実行できるタイマーセッションがありません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* メインタイマー表示 */}
      <Card className={cn(
        createCardClasses('glacier'),
        "border-l-4",
        timerState === 'running' ? "border-l-[#16a34a]" : 
        timerState === 'finished' ? "border-l-[#dc2626]" : 
        "border-l-[#00c4cc]"
      )}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={createTypographyClasses('l', 'bold', 'muted')}>
              セッション {currentTimer?.sequence || 1}
            </CardTitle>
            <Badge className={cn(
              "font-medium",
              timerState === 'running' && "bg-[#16a34a] text-white",
              timerState === 'paused' && "bg-[#eab308] text-white", 
              timerState === 'finished' && "bg-[#dc2626] text-white",
              timerState === 'stopped' && "bg-gray-500 text-white"
            )}>
              {getStateText()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* タイマー表示 */}
          <div className="text-center mb-6">
            <div className={cn(
              createTypographyClasses('xxl', 'bold', 'muted'),
              "text-6xl mb-2",
              timerState === 'finished' && 'text-[#dc2626]',
              timerState === 'running' && 'text-[#16a34a]'
            )}>
              {formatTime(remainingSeconds)}
            </div>
            <Progress value={getProgress()} className="w-full h-2 mb-4" />
            <p className={createTypographyClasses('s', 'regular', 'secondary')}>
              {currentTimer?.durationMinutes}分のセッション
            </p>
          </div>

          {/* コントロールボタン */}
          <div className="flex justify-center gap-3 mb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTimerIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            {timerState === 'running' ? (
              <Button
                onClick={handlePause}
                className={createButtonClasses('warning', 'medium')}
              >
                <Pause className="h-4 w-4 mr-2" />
                一時停止
              </Button>
            ) : (
              <Button
                onClick={handleStart}
                disabled={remainingSeconds === 0 && timerState !== 'paused'}
                className={createButtonClasses('success', 'medium')}
              >
                <Play className="h-4 w-4 mr-2" />
                {timerState === 'paused' ? '再開' : '開始'}
              </Button>
            )}

            <Button
              size="sm"
              variant="outline"
              onClick={handleStop}
              disabled={timerState === 'stopped'}
            >
              <Square className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={handleNext}
              disabled={currentTimerIndex === sortedTimers.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          {/* 終了時のアクション */}
          {timerState === 'finished' && (
            <div className="text-center">
              <p className={cn(
                createTypographyClasses('m', 'bold', 'muted'),
                "text-[#dc2626] mb-3"
              )}>
                セッション {currentTimer?.sequence} が終了しました！
              </p>
              {currentTimerIndex < sortedTimers.length - 1 ? (
                <Button
                  onClick={handleFinishAndNext}
                  className={createButtonClasses('primary', 'medium')}
                >
                  次のセッションへ
                </Button>
              ) : (
                <Badge className="bg-[#16a34a] text-white px-4 py-2">
                  全セッション完了！
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current セッション */}
      <Card className={createCardClasses('soft')}>
        <CardHeader>
          <CardTitle className={createTypographyClasses('m', 'bold', 'muted')}>
            Current
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sortedTimers.map((timer, index) => (
              <div
                key={timer.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border",
                  index === currentTimerIndex 
                    ? "bg-[#f0fdff] border-[#00c4cc]" 
                    : "bg-white border-[#e2e8f0]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={index === currentTimerIndex ? "default" : "outline"}
                    className={index === currentTimerIndex ? "bg-[#00c4cc] text-white" : ""}
                  >
                    {timer.sequence}
                  </Badge>
                  <span className={createTypographyClasses('s', 'medium', 'muted')}>
                    {timer.durationMinutes}分
                  </span>
                </div>
                {index === currentTimerIndex && (
                  <Badge className={cn("text-xs", getStateColor(), "bg-current text-white")}>
                    現在
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}