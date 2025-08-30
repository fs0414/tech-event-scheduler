import { redirect } from 'next/navigation';
import { getCurrentUserWithAutoCreate } from '@/lib/auth-helpers';
import { getEventsForUser, getEventStats } from '@/lib/data';
import EventsPageHeader from '@/components/events-page-header';
import EventsStats from '@/components/events-stats';
import EventsList from '@/components/events-list';
import { UI_CONSTANTS, cn } from '@/lib/ui-constants';
import { BenchmarkLogger } from '@/lib/benchmark';

interface EventsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search } = await searchParams;
  
  try {
    // ページ全体の処理時間計測開始
    BenchmarkLogger.start('EventsPage_Total');
    
    // 認証ユーザー取得（自動作成付き）
    const dbUser = await BenchmarkLogger.measure(
      'EventsPage_GetCurrentUser',
      () => getCurrentUserWithAutoCreate(),
      { search }
    );
    
    // 並列でデータを取得して最適化
    const [events, stats] = await BenchmarkLogger.measure(
      'EventsPage_FetchData',
      () => Promise.all([
        getEventsForUser(dbUser.id, search),
        getEventStats(dbUser.id)
      ]),
      { userId: dbUser.id, search }
    );

    // 検索によるフィルタリング（クライアントサイドでも同期）
    const filteredEvents = BenchmarkLogger.measureSync(
      'EventsPage_FilterEvents',
      () => search 
        ? events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
        : events,
      { search, eventsCount: events.length }
    );

    // ページ全体の処理時間計測終了
    const totalTime = BenchmarkLogger.end('EventsPage_Total', {
      eventsCount: events.length,
      filteredCount: filteredEvents.length,
      search
    });

    return (
      <div className={cn("max-w-7xl mx-auto py-8 min-h-screen", UI_CONSTANTS.colors.pageBg)}>
        <EventsPageHeader initialSearch={search} />
        <EventsStats events={events} stats={stats} />
        <EventsList events={filteredEvents} />
      </div>
    );
  } catch (error) {
    console.error('Events page error:', error);
    // getCurrentUserWithAutoCreate内でリトライロジックが実装されたため、
    // 認証エラーの場合はログインページにリダイレクト
    redirect('/auth/login');
  }
}