export class BenchmarkLogger {
  private static startTimes = new Map<string, number>();
  
  static start(label: string): void {
    this.startTimes.set(label, performance.now());
    console.log(`[BENCHMARK START] ${label}`);
  }
  
  static end(label: string, metadata?: Record<string, any>): number {
    const startTime = this.startTimes.get(label);
    if (!startTime) {
      console.warn(`[BENCHMARK WARNING] No start time found for: ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    const durationMs = Math.round(duration * 100) / 100;
    
    console.log(
      `[BENCHMARK END] ${label}: ${durationMs}ms`,
      metadata ? `| Metadata: ${JSON.stringify(metadata)}` : ''
    );
    
    this.startTimes.delete(label);
    return durationMs;
  }
  
  static async measure<T>(
    label: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    this.start(label);
    try {
      const result = await fn();
      this.end(label, metadata);
      return result;
    } catch (error) {
      this.end(label, { ...metadata, error: String(error) });
      throw error;
    }
  }
  
  static measureSync<T>(
    label: string,
    fn: () => T,
    metadata?: Record<string, any>
  ): T {
    this.start(label);
    try {
      const result = fn();
      this.end(label, metadata);
      return result;
    } catch (error) {
      this.end(label, { ...metadata, error: String(error) });
      throw error;
    }
  }
}

export function logPerformance(
  operation: string,
  duration: number,
  details?: Record<string, any>
): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    operation,
    duration: `${duration}ms`,
    ...details
  };
  
  console.log(`[PERFORMANCE] ${JSON.stringify(logEntry, null, 2)}`);
}