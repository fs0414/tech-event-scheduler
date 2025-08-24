'use client';

import { useState } from 'react';
import type { Event, User, Owner, Speaker, Article, Timer } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Users, UserCheck, Clock, Calendar, Crown, UserPlus } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';
import AttendanceCounter from '@/components/attendance-counter';
import AddOrganizerForm from '@/components/add-organizer-form';
import EventTimerManager from '@/components/event-timer-manager';
import EventTimerRunner from '@/components/event-timer-runner';
import { changeUserRole } from '@/app/events/[id]/organizer-actions';

type EventWithDetails = Event & {
  owners: (Owner & {
    user: User;
  })[];
  speakers: (Speaker & {
    user: User;
    article: Article | null;
  })[];
  timers: Timer[];
};

interface EventDetailClientProps {
  event: EventWithDetails;
  currentUser?: { id: string; email: string; name: string | null } | null;
}

export default function EventDetailClient({ event, currentUser }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'participants' | 'speakers' | 'timers'>('participants');
  const [showAddOrganizerForm, setShowAddOrganizerForm] = useState(false);

  const eventOwners = event.owners.map(owner => owner.user);
  const eventSpeakers = event.speakers;
  const eventTimers = event.timers.sort((a, b) => a.sequence - b.sequence);
  
  const isOwner = currentUser && event.owners.some(owner => 
    owner.userId === currentUser.id && owner.role === 'organizer'
  );

  const handleRoleChange = async (ownerId: number, newRole: string) => {
    try {
      await changeUserRole(ownerId, event.id, newRole);
    } catch (error: any) {
      console.error('ロール変更エラー:', error);
    }
  };

  const handleAddOrganizerSuccess = () => {
    setShowAddOrganizerForm(false);
  };

  return (
    <div className={cn("min-h-screen", UI_CONSTANTS.colors.pageBg)}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        {/* Mobile-first Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className={cn("h-8 w-8 p-0", UI_CONSTANTS.transitions.default)}
            >
              <a href="/events">
                <ArrowLeft className="h-4 w-4" />
              </a>
            </Button>
            <h1 className={createTypographyClasses('xl', 'bold', 'muted')}>
              <span className="hidden sm:inline">イベント管理</span>
              <span className="sm:hidden">管理</span>
            </h1>
          </div>
          <nav className="flex items-center gap-1 text-xs sm:text-sm flex-wrap">
            <a href="/events" className={cn(
              "hover:underline",
              createTypographyClasses('xs', 'regular', 'secondary')
            )}>
              イベント一覧
            </a>
            <span className={createTypographyClasses('xs', 'regular', 'muted')}>/</span>
            <span className={cn(
              createTypographyClasses('xs', 'medium', 'muted'),
              "truncate max-w-[200px] sm:max-w-none"
            )}>{event.title}</span>
          </nav>
        </div>

        {/* Event Details Header - Mobile First */}
        <Card className={cn(
          createCardClasses('glacier'),
          "mb-4 sm:mb-6",
          "border-l-4 border-l-[#00c4cc]"
        )}>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <h2 className={cn(
                  createTypographyClasses('xl', 'bold', 'muted'),
                  "mb-2 break-words"
                )}>{event.title}</h2>
                {event.eventUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className={cn(
                      "w-full sm:w-auto",
                      UI_CONSTANTS.transitions.default
                    )}
                  >
                    <a
                      href={event.eventUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className={createTypographyClasses('s', 'medium', 'body')}>イベントページを開く</span>
                    </a>
                  </Button>
                )}
              </div>

              {/* Event Stats - Mobile First Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-[#e2e8f0]">
                <div className="text-center">
                  <div className={cn(
                    createTypographyClasses('xl', 'bold', 'muted'),
                    "mb-1"
                  )}>{eventOwners.length}</div>
                  <div className={createTypographyClasses('xs', 'medium', 'muted')}>参加者</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    createTypographyClasses('xl', 'bold', 'muted'),
                    "mb-1"
                  )}>{eventSpeakers.length}</div>
                  <div className={createTypographyClasses('xs', 'medium', 'muted')}>スピーカー</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    createTypographyClasses('xl', 'bold', 'muted'),
                    "mb-1"
                  )}>{eventTimers.length}</div>
                  <div className={createTypographyClasses('xs', 'medium', 'muted')}>セッション</div>
                </div>
                <div className="text-center">
                  <div className={cn(
                    createTypographyClasses('xl', 'bold', 'muted'),
                    "mb-1 text-[#16a34a]"
                  )}>{event.attendance}</div>
                  <div className={createTypographyClasses('xs', 'medium', 'muted')}>参加予定</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Counter */}
        <div className="mb-4 sm:mb-6">
          <AttendanceCounter 
            currentAttendance={event.attendance} 
            eventId={event.id} 
            isOwner={!!isOwner} 
          />
        </div>

        {/* Mobile-optimized Tabs */}
        <Card className={cn(createCardClasses('glacier'))}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
            <TabsList className={cn(
              "grid w-full grid-cols-3",
              "bg-[#f8fafc] rounded-lg p-1 mb-4"
            )}>
              <TabsTrigger 
                value="timers"
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                  "flex-col sm:flex-row gap-1 py-2 px-2",
                  createTypographyClasses('xs', 'medium', 'muted'),
                  UI_CONSTANTS.transitions.default
                )}
              >
                <Clock className="h-4 w-4" />
                <span className="text-center">タイマー</span>
              </TabsTrigger>
              <TabsTrigger 
                value="participants" 
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                  "flex-col sm:flex-row gap-1 py-2 px-2",
                  createTypographyClasses('xs', 'medium', 'muted'),
                  UI_CONSTANTS.transitions.default
                )}
              >
                <Users className="h-4 w-4" />
                <span className="text-center">管理者</span>
              </TabsTrigger>
              <TabsTrigger 
                value="speakers"
                className={cn(
                  "data-[state=active]:bg-white data-[state=active]:shadow-sm",
                  "flex-col sm:flex-row gap-1 py-2 px-2",
                  createTypographyClasses('xs', 'medium', 'muted'),
                  UI_CONSTANTS.transitions.default
                )}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-center">スピーカー</span>
              </TabsTrigger>
            </TabsList>

            {/* owner add Contents */}
            <TabsContent value="participants" className="p-3 sm:p-6">
              <div className="mb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                  <h3 className={createTypographyClasses('l', 'bold', 'muted')}>管理者 ({eventOwners.length})</h3>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowAddOrganizerForm(!showAddOrganizerForm)}
                      className={cn(
                        createButtonClasses('primary', 'small'),
                        UI_CONSTANTS.transitions.default
                    )}>
                      <UserPlus className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">参加者を</span>追加
                    </Button>
                  </div>
                </div>
              </div>

              {showAddOrganizerForm && isOwner && (
                <div className="mb-4">
                  <AddOrganizerForm 
                    eventId={event.id}
                    onSuccess={handleAddOrganizerSuccess}
                    onCancel={() => setShowAddOrganizerForm(false)}
                  />
                </div>
              )}

              {eventOwners.length > 0 ? (
                <div className="space-y-3">
                  {event.owners.map(owner => (
                    <div key={owner.id} className={cn(
                      "p-3 rounded-lg border bg-white",
                      "border-[#cffafe] hover:shadow-md",
                      UI_CONSTANTS.transitions.default
                    )}>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full bg-gradient-to-br from-[#00c4cc] to-[#0891b2] flex items-center justify-center flex-shrink-0"
                        )}>
                          <span className={cn(
                            "text-white font-semibold text-sm"
                          )}>
                            {owner.user.name?.[0] || 'U'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={cn(
                              createTypographyClasses('m', 'semibold', 'muted'),
                              "truncate"
                            )}>{owner.user.name || 'Unknown'}</span>
                            <Badge className={cn(
                              'bg-[#00c4cc] text-white text-xs px-2 py-0.5'
                            )}>
                              {owner.role === 'organizer' ? '管理者' : '管理者'}
                            </Badge>
                          </div>
                          <div className={cn(
                            createTypographyClasses('s', 'regular', 'secondary'),
                            "truncate"
                          )}>{owner.user.email}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0",
                            UI_CONSTANTS.transitions.default
                          )}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center",
                    UI_CONSTANTS.colors.mutedBg
                  )}>
                    <Users className={cn("w-8 h-8", UI_CONSTANTS.colors.mutedText)} />
                  </div>
                  <h4 className={createTypographyClasses('m', 'medium', 'muted')}>参加者がいません</h4>
                  <p className={cn("mb-4", createTypographyClasses('s', 'regular', 'secondary'))}>まだ誰も参加していません</p>
                  <Button className={createButtonClasses('primary', 'medium')}>
                    最初の参加者を追加
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="speakers" className="p-3 sm:p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className={createTypographyClasses('l', 'bold', 'muted')}>スピーカー ({eventSpeakers.length})</h3>
                  <Button className={cn(
                    createButtonClasses('accent', 'small'),
                    UI_CONSTANTS.transitions.default
                  )}>
                    <UserCheck className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">スピーカーを</span>追加
                  </Button>
                </div>
              </div>

              {eventSpeakers.length > 0 ? (
                <div className="space-y-3">
                  {eventSpeakers.map(speaker => (
                    <div key={speaker.id} className={cn(
                      "p-3 rounded-lg border bg-white",
                      "border-[#fef3c7] hover:shadow-md",
                      UI_CONSTANTS.transitions.default
                    )}>
                      <div className="flex gap-3">
                        <div className={cn(
                          "w-12 h-12 rounded-full bg-gradient-to-br from-[#ff9900] to-[#e6800d] flex items-center justify-center flex-shrink-0"
                        )}>
                          <span className="text-white font-semibold text-sm">
                            {speaker.user.name?.[0] || 'S'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className={cn(
                              createTypographyClasses('m', 'semibold', 'muted'),
                              "truncate"
                            )}>{speaker.user.name || 'Unknown'}</span>
                            <Badge className={cn(
                              speaker.role === 'keynote' ? 'bg-purple-600 text-white text-xs px-2 py-0.5' : 
                              speaker.role === 'moderator' ? 'bg-[#ff9900] text-white text-xs px-2 py-0.5' :
                              'bg-[#16a34a] text-white text-xs px-2 py-0.5'
                            )}>
                              {speaker.role === 'keynote' ? 'キーノート' : 
                               speaker.role === 'moderator' ? 'モデレーター' : 'スピーカー'}
                            </Badge>
                          </div>
                          <div className={cn(
                            createTypographyClasses('s', 'regular', 'secondary'),
                            "truncate mb-2"
                          )}>{speaker.user.email}</div>
                          {speaker.article && (
                            <div className={cn(
                              "p-2 rounded border bg-[#fcfcfc] border-[#f3f4f6]"
                            )}>
                              <div className={cn("mb-1", createTypographyClasses('s', 'semibold', 'muted'))}>
                                {speaker.article.title}
                              </div>
                              {speaker.article.description && (
                                <p className={cn("mb-2 line-clamp-2", createTypographyClasses('xs', 'regular', 'secondary'))}>
                                  {speaker.article.description}
                                </p>
                              )}
                              {speaker.article.url && (
                                <Button
                                  variant="link"
                                  size="sm"
                                  asChild
                                  className="p-0 h-auto"
                                >
                                  <a
                                    href={speaker.article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1"
                                  >
                                    <span className={createTypographyClasses('xs', 'medium', 'primary')}>記事を見る</span>
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 flex-shrink-0",
                            UI_CONSTANTS.transitions.default
                          )}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center",
                    UI_CONSTANTS.colors.warmBg
                  )}>
                    <UserCheck className={cn("w-8 h-8 text-[#ff9900]")} />
                  </div>
                  <h4 className={createTypographyClasses('m', 'medium', 'muted')}>スピーカーがいません</h4>
                  <p className={cn("mb-4", createTypographyClasses('s', 'regular', 'secondary'))}>まだスピーカーが登録されていません</p>
                  <Button className={createButtonClasses('accent', 'medium')}>
                    最初のスピーカーを追加
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="timers" className="p-3 sm:p-6">
              <div className="space-y-6">
                {/* タイマー管理セクション */}
                <div>
                  <h3 className={cn(createTypographyClasses('l', 'bold', 'muted'), "mb-4")}>
                    セッション管理
                  </h3>
                  <EventTimerManager 
                    event={event}
                    currentUser={currentUser}
                  />
                </div>

                {/* タイマー実行セクション */}
                {eventTimers.length > 0 && (
                  <div>
                    <h3 className={cn(createTypographyClasses('l', 'bold', 'muted'), "mb-4")}>
                      タイマー実行
                    </h3>
                    <EventTimerRunner 
                      timers={eventTimers}
                    />
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
