import { redirect } from 'next/navigation';
import { getCurrentUserWithAutoCreate } from '@/lib/auth-helpers';
import { getEventsForUser, getEventStats } from '@/lib/data';
import EventsPageHeader from '@/components/events-page-header';
import EventsStats from '@/components/events-stats';
import EventsList from '@/components/events-list';
import { UI_CONSTANTS, cn } from '@/lib/ui-constants';

interface EventsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search } = await searchParams;
  
  try {
    // 認証ユーザー取得（自動作成付き）
    const dbUser = await getCurrentUserWithAutoCreate();
    
    // 並列でデータを取得して最適化
    const [events, stats] = await Promise.all([
      getEventsForUser(dbUser.id, search),
      getEventStats(dbUser.id)
    ]);

    // 検索によるフィルタリング（クライアントサイドでも同期）
    const filteredEvents = search 
      ? events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()))
      : events;

    return (
      <div className={cn("max-w-7xl mx-auto py-8 min-h-screen", UI_CONSTANTS.colors.pageBg)}>
        <EventsPageHeader initialSearch={search} />
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