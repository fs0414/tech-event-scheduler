import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, Clock, Presentation } from 'lucide-react';
import { UI_CONSTANTS, cn, createTypographyClasses } from '@/lib/ui-constants';
import type { EventForList } from '@/types/events';

interface EventStats {
  totalEvents: number;
  totalAttendance: number;
}

interface EventsStatsProps {
  events: EventForList[];
  stats?: EventStats;
}

export default function EventsStats({ events, stats }: EventsStatsProps) {
  // 統計データがある場合はそれを使用、なければeventsから計算
  const totalEvents = stats?.totalEvents ?? events.length;
  const totalAttendance = stats?.totalAttendance ?? events.reduce((sum, event) => sum + (event.attendance || 0), 0);
  
  const totalUsers = new Set(
    events.flatMap(event => 
      (event.owners || []).map(owner => owner.userId)
    ).filter(Boolean)
  ).size;
  
  const totalOwners = events.reduce((sum, event) => sum + (event.owners?.length || 0), 0);
  const totalSpeakers = events.reduce((sum, event) => sum + (event.speakers?.length || 0), 0);
  const totalTimers = events.reduce((sum, event) => sum + (event.timers?.length || 0), 0);

  const statsData = [
    {
      title: "総イベント数",
      value: totalEvents,
      icon: Presentation,
      color: UI_CONSTANTS.colors.primary
    },
    {
      title: "総参加者数",
      value: totalAttendance,
      icon: UserCheck,
      color: UI_CONSTANTS.colors.accent
    },
    {
      title: "ユニークユーザー",
      value: totalUsers,
      icon: Users,
      color: UI_CONSTANTS.colors.secondary
    },
    {
      title: "総オーナー数",
      value: totalOwners,
      icon: UserCheck,
      color: UI_CONSTANTS.colors.accent
    },
    {
      title: "総タイマー数",
      value: totalTimers,
      icon: Clock,
      color: "bg-purple-100 dark:bg-purple-900/20"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className={cn(UI_CONSTANTS.transitions.default, UI_CONSTANTS.states.hover)}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg", stat.color)}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className={createTypographyClasses('xl', 'bold', 'primary')}>
                  {stat.value}
                </div>
                <div className={createTypographyClasses('xs', 'regular', 'muted')}>
                  {stat.title}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}