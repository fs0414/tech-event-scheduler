export class BenchmarkLogger {
  private static startTimes = new Map<string, number>();

  static start(label: string): void {
    BenchmarkLogger.startTimes.set(label, performance.now());
    console.log(`[BENCHMARK START] ${label}`);
  }

  static end(label: string, metadata?: Record<string, any>): number {
    const startTime = BenchmarkLogger.startTimes.get(label);
    if (!startTime) {
      console.warn(`[BENCHMARK WARNING] No start time found for: ${label}`);
      return 0;
    }

    const duration = performance.now() - startTime;
    const durationMs = Math.round(duration * 100) / 100;

    console.log(
      `[BENCHMARK END] ${label}: ${durationMs}ms`,
      metadata ? `| Metadata: ${JSON.stringify(metadata)}` : "",
    );

    BenchmarkLogger.startTimes.delete(label);
    return durationMs;
  }

  static async measure<T>(
    label: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>,
  ): Promise<T> {
    BenchmarkLogger.start(label);
    try {
      const result = await fn();
      BenchmarkLogger.end(label, metadata);
      return result;
    } catch (error) {
      BenchmarkLogger.end(label, { ...metadata, error: String(error) });
      throw error;
    }
  }

  static measureSync<T>(
    label: string,
    fn: () => T,
    metadata?: Record<string, any>,
  ): T {
    BenchmarkLogger.start(label);
    try {
      const result = fn();
      BenchmarkLogger.end(label, metadata);
      return result;
    } catch (error) {
      BenchmarkLogger.end(label, { ...metadata, error: String(error) });
      throw error;
    }
  }
}

export function logPerformance(
  operation: string,
  duration: number,
  details?: Record<string, any>,
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    duration: `${duration}ms`,
    ...details,
  };

  console.log(`[PERFORMANCE] ${JSON.stringify(logEntry, null, 2)}`);
}
