'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { EventForList } from '@/types/events';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ExternalLink, Users, Calendar, UserCheck } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';

interface EventsClientProps {
  events: EventForList[];
  initialSearch?: string;
}

export default function EventsClient({ events, initialSearch = '' }: EventsClientProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/events?${params.toString()}`);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUsers = new Set(
    events.flatMap(event => 
      (event.owners || []).map(owner => owner.userId)
    ).filter(Boolean)
  ).size;
  const totalOwners = events.reduce((sum, event) => sum + (event.owners?.length || 0), 0);
  const totalSpeakers = events.reduce((sum, event) => sum + (event.speakers?.length || 0), 0);
  const totalTimers = events.reduce((sum, event) => sum + (event.timers?.length || 0), 0);

  return (
    <div className={cn("max-w-7xl mx-auto py-8 min-h-screen", UI_CONSTANTS.colors.pageBg)}>
      {/* Header Section */}
      <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
        <h1 className={cn(
          createTypographyClasses('xxl', 'bold', 'muted'),
          "mb-4"
        )}>イベント一覧</h1>
        
        {/* Search and Filter Bar */}
        <div className={cn("flex flex-col sm:flex-row mb-6", UI_CONSTANTS.spacing.gap)}>
          <div className="flex-1 relative">
            <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4", UI_CONSTANTS.colors.mutedText)} />
            <Input
              type="text"
              placeholder="イベントを検索..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={() => router.push('/events/create')}
            className={cn(
              createButtonClasses('primary', 'medium'),
              UI_CONSTANTS.transitions.bounce
            )}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className={createTypographyClasses('s', 'semibold', 'body')}>新しいイベント</span>
          </Button>
        </div>

        {/* Stats */}
        <Card className={cn(
          createCardClasses('glacier'),
          "mb-6",
          UI_CONSTANTS.transitions.default
        )}>
          <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={createTypographyClasses('xl', 'bold', 'muted')}>{events.length}</div>
                <div className={createTypographyClasses('s', 'regular', 'muted')}>総イベント数</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  createTypographyClasses('xl', 'bold', 'muted'),
                  "text-[#16a34a]"
                )}>{filteredEvents.length}</div>
                <div className={createTypographyClasses('s', 'regular', 'muted')}>表示中</div>
              </div>
              <div className="text-center">
                <div className={createTypographyClasses('xl', 'bold', 'muted')}>{totalUsers}</div>
                <div className={createTypographyClasses('s', 'regular', 'muted')}>ユニークユーザー</div>
              </div>
              <div className="text-center">
                <div className={cn(
                  createTypographyClasses('xl', 'bold', 'muted'),
                  "text-[#16a34a]"
                )}>{totalSpeakers}</div>
                <div className={createTypographyClasses('s', 'regular', 'muted')}>スピーカー</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const eventOwners = event.owners?.map(owner => owner.user) || [];
          const eventSpeakers = event.speakers || [];
          const eventTimers = event.timers || [];
          const totalParticipants = eventOwners.length + eventSpeakers.length + eventTimers.length;

          return (
            <Card key={event.id} className={cn(
              createCardClasses('glacier'),
              "group cursor-pointer hover:shadow-xl hover:scale-[1.02]", 
              UI_CONSTANTS.transitions.slow,
              "border-l-4 border-l-transparent hover:border-l-[#00c4cc]"
            )}>
              <CardContent className={cn("p-0")}>
                {/* Event Header */}
                <div className={cn("p-6 pb-4")}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className={cn(
                      createTypographyClasses('l', 'bold', 'muted'),
                      "line-clamp-2 flex-1 mr-2"
                    )}>
                      {event.title}
                    </h3>
                    {event.eventUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className={cn(
                          "h-8 w-8 p-0 opacity-60 group-hover:opacity-100",
                          UI_CONSTANTS.transitions.default
                        )}
                      >
                        <a
                          href={event.eventUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mb-4">
                    {totalParticipants > 0 && (
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full",
                        UI_CONSTANTS.colors.warmBg
                      )}>
                        <Users className={cn("h-4 w-4", UI_CONSTANTS.colors.primaryText)} />
                        <span className={createTypographyClasses('s', 'semibold', 'muted')}>
                          {totalParticipants}人
                        </span>
                      </div>
                    )}
                    {event.attendance && event.attendance > 0 && (
                      <div className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0fdf4]"
                      )}>
                        <UserCheck className={cn("h-4 w-4 text-[#16a34a]")} />
                        <span className={cn(
                          createTypographyClasses('s', 'semibold', 'muted'),
                          "text-[#16a34a]"
                        )}>
                          {event.attendance}人参加
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Participants Section */}
                {eventOwners.length > 0 && (
                  <div className={cn("mx-6 mb-4 p-4 rounded-lg", UI_CONSTANTS.colors.paleAccentBg)}>
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full bg-gradient-to-r from-[#00c4cc] to-[#0891b2]"
                        )} />
                        <span className={createTypographyClasses('s', 'semibold', 'muted')}>
                          オーナー
                        </span>
                        <Badge className={cn(
                          "h-6 px-3 bg-[#00c4cc] text-white border-0",
                          createTypographyClasses('xs', 'medium', 'bold')
                        )}>
                          {eventOwners.length}人
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {eventOwners.slice(0, 2).map((owner, index) => (
                          <div key={`${event.id}-owner-${index}`} className={cn(
                            "flex items-center gap-3 px-4 py-2 rounded-full bg-white shadow-sm border border-[#e0f2fe]"
                          )}>
                            <div className={cn(
                              "w-7 h-7 rounded-full bg-gradient-to-br from-[#00c4cc] to-[#0891b2] flex items-center justify-center shadow-sm"
                            )}>
                              <span className={cn(
                                "text-xs font-semibold text-white"
                              )}>
                                {owner?.name?.[0] || 'U'}
                              </span>
                            </div>
                            <span className={createTypographyClasses('s', 'semibold', 'muted')}>
                              {owner?.name || 'Unknown'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Event Actions */}
                <div className={cn("px-6 pb-6")}>
                  <Button 
                    onClick={() => router.push(`/events/${event.id}`)}
                    className={cn(
                      createButtonClasses('primary', 'medium'),
                      "w-full group-hover:shadow-md",
                      UI_CONSTANTS.transitions.default
                    )}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className={createTypographyClasses('s', 'medium', 'body')}>詳細を見る</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className={cn("w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center", UI_CONSTANTS.colors.mutedBg)}>
            <Calendar className={cn("w-12 h-12", UI_CONSTANTS.colors.mutedText)} />
          </div>
          <h3 className={createTypographyClasses('l', 'medium', 'body')}>イベントが見つかりません</h3>
          <p className={cn("mb-4", createTypographyClasses('m', 'regular', 'secondary'))}>検索条件を変更してお試しください</p>
          <Button
            onClick={() => handleSearchChange('')}
            className={createButtonClasses('primary', 'medium')}
          >
            検索をクリア
          </Button>
        </div>
      )}
    </div>
  );
}
