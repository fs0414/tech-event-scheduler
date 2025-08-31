import { useCallback, useEffect, useState } from "react";

export type TimerState = "stopped" | "running" | "paused" | "finished";

interface PersistedTimerData {
  eventId: number;
  userId: string;
  currentIndex: number;
  remainingSeconds: number;
  state: TimerState;
  startedAt?: number;
  pausedAt?: number;
  pausedDuration?: number;
}

interface UsePersistedTimerProps {
  eventId: number;
  userId: string;
  totalTimers: number;
  getTimerDuration: (index: number) => number;
}

interface UsePersistedTimerReturn {
  currentTimerIndex: number;
  remainingSeconds: number;
  timerState: TimerState;
  setCurrentTimerIndex: (index: number) => void;
  setRemainingSeconds: (seconds: number) => void;
  setTimerState: (state: TimerState) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  resetTimer: (index: number, durationMinutes: number) => void;
}

export function usePersistedTimer({
  eventId,
  userId,
  totalTimers,
  getTimerDuration,
}: UsePersistedTimerProps): UsePersistedTimerReturn {
  const storageKey = `timer_${eventId}_${userId}`;
  const syncKey = `timer_sync_${eventId}`;

  const getInitialState = (): Omit<
    PersistedTimerData,
    "eventId" | "userId"
  > => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const data: PersistedTimerData = JSON.parse(stored);

        // 実行中の場合、経過時間を考慮して残り時間を再計算
        if (data.state === "running" && data.startedAt) {
          const now = Date.now();
          const elapsedMs = now - data.startedAt;
          const elapsedSeconds = Math.floor(elapsedMs / 1000);
          const pausedDuration = data.pausedDuration || 0;
          const actualElapsed = elapsedSeconds - pausedDuration;
          const newRemaining = Math.max(
            0,
            data.remainingSeconds - actualElapsed,
          );

          if (newRemaining === 0) {
            return {
              currentIndex: data.currentIndex,
              remainingSeconds: 0,
              state: "finished",
              pausedDuration: 0,
            };
          }

          return {
            ...data,
            remainingSeconds: newRemaining,
            startedAt: now,
            pausedDuration: 0,
          };
        }

        if (data.state === "paused" && data.pausedAt && data.startedAt) {
          const pausedDurationBefore = data.pausedDuration || 0;
          const pausedMs = data.pausedAt - data.startedAt;
          const pausedSeconds = Math.floor(pausedMs / 1000);
          const totalPausedDuration = pausedDurationBefore + pausedSeconds;

          return {
            ...data,
            pausedDuration: totalPausedDuration,
          };
        }

        return data;
      }
    } catch (error) {
      console.error("Failed to load timer state:", error);
    }

    const firstTimerDuration = totalTimers > 0 ? getTimerDuration(0) : 15;
    return {
      currentIndex: 0,
      remainingSeconds: firstTimerDuration * 60,
      state: "stopped",
      pausedDuration: 0,
    };
  };

  const initialState = getInitialState();
  const [currentTimerIndex, setCurrentTimerIndexState] = useState(
    initialState.currentIndex,
  );
  const [remainingSeconds, setRemainingSecondsState] = useState(
    initialState.remainingSeconds,
  );
  const [timerState, setTimerStateState] = useState<TimerState>(
    initialState.state,
  );
  const [startedAt, setStartedAt] = useState<number | undefined>(
    initialState.startedAt,
  );
  const [pausedAt, setPausedAt] = useState<number | undefined>(
    initialState.pausedAt,
  );
  const [pausedDuration, setPausedDuration] = useState<number>(
    initialState.pausedDuration || 0,
  );

  const saveState = useCallback(() => {
    const data: PersistedTimerData = {
      eventId,
      userId,
      currentIndex: currentTimerIndex,
      remainingSeconds,
      state: timerState,
      startedAt,
      pausedAt,
      pausedDuration,
    };

    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      localStorage.setItem(
        syncKey,
        JSON.stringify({ ...data, timestamp: Date.now() }),
      );
    } catch (error) {
      console.error("Failed to save timer state:", error);
    }
  }, [
    eventId,
    userId,
    currentTimerIndex,
    remainingSeconds,
    timerState,
    startedAt,
    pausedAt,
    pausedDuration,
    storageKey,
    syncKey,
  ]);

  useEffect(() => {
    saveState();
  }, [saveState]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === syncKey && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          if (data.userId === userId && data.eventId === eventId) {
            setCurrentTimerIndexState(data.currentIndex);
            setRemainingSecondsState(data.remainingSeconds);
            setTimerStateState(data.state);
            setStartedAt(data.startedAt);
            setPausedAt(data.pausedAt);
            setPausedDuration(data.pausedDuration || 0);
          }
        } catch (error) {
          console.error("Failed to sync timer state:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [syncKey, userId, eventId]);

  const setCurrentTimerIndex = useCallback((index: number) => {
    setCurrentTimerIndexState(index);
  }, []);

  const setRemainingSeconds = useCallback((seconds: number) => {
    setRemainingSecondsState(seconds);
  }, []);

  const setTimerState = useCallback((state: TimerState) => {
    setTimerStateState(state);

    if (state === "stopped" || state === "finished") {
      setStartedAt(undefined);
      setPausedAt(undefined);
      setPausedDuration(0);
    }
  }, []);

  const startTimer = useCallback(() => {
    const now = Date.now();
    setTimerStateState("running");
    setStartedAt(now);
    setPausedAt(undefined);

    if (timerState === "paused" && pausedAt && startedAt) {
      const pausedMs = now - pausedAt;
      const pausedSec = Math.floor(pausedMs / 1000);
      setPausedDuration((prev) => prev + pausedSec);
    } else {
      setPausedDuration(0);
    }
  }, [timerState, pausedAt, startedAt]);

  const pauseTimer = useCallback(() => {
    setTimerStateState("paused");
    setPausedAt(Date.now());
  }, []);

  const stopTimer = useCallback(() => {
    setTimerStateState("stopped");
    setStartedAt(undefined);
    setPausedAt(undefined);
    setPausedDuration(0);
    const duration = getTimerDuration(currentTimerIndex);
    setRemainingSecondsState(duration * 60);
  }, [currentTimerIndex, getTimerDuration]);

  const resetTimer = useCallback((index: number, durationMinutes: number) => {
    setCurrentTimerIndexState(index);
    setRemainingSecondsState(durationMinutes * 60);
    setTimerStateState("stopped");
    setStartedAt(undefined);
    setPausedAt(undefined);
    setPausedDuration(0);
  }, []);

  useEffect(() => {
    return () => {
      if (timerState === "finished") {
        try {
          localStorage.removeItem(storageKey);
        } catch (error) {
          console.error("Failed to clear timer state:", error);
        }
      }
    };
  }, [timerState, storageKey]);

  return {
    currentTimerIndex,
    remainingSeconds,
    timerState,
    setCurrentTimerIndex,
    setRemainingSeconds,
    setTimerState,
    startTimer,
    pauseTimer,
    stopTimer,
    resetTimer,
  };
}
