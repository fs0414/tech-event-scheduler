'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, UserPlus, Users, Calendar, Clock } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses, createTabsListClasses, createTabsTriggerClasses } from '@/lib/ui-constants';
import AttendanceCounter from '@/components/attendance-counter';
import AddOrganizerForm from '@/components/add-organizer-form';
import EventTimerManager from '@/components/event-timer-manager';
import EventTimerRunner from '@/components/event-timer-runner';
import { changeUserRole } from '@/app/events/_actions/owner.action';
import { OWNER_ROLES, OWNER_ROLE_LABELS } from '@/lib/owner-role';
import type { Event, User, Owner, Speaker, Article, Timer } from '@prisma/client';

type EventWithDetails = Event & {
  owners: (Owner & { user: User })[];
  speakers: (Speaker & { user: User; article: Article | null })[];
  timers: Timer[];
};

interface EventDetailTabsProps {
  event: EventWithDetails;
  currentUser?: { id: string; email: string; name: string | null } | null;
  isOwner: boolean;
}

export default function EventDetailTabs({ event, currentUser, isOwner }: EventDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<'participants' | 'speakers' | 'timers'>('participants');
  const [showAddOrganizerForm, setShowAddOrganizerForm] = useState(false);

  const eventOwners = event.owners.map(owner => owner.user);
  const eventSpeakers = event.speakers;
  const eventTimers = event.timers.sort((a, b) => a.sequence - b.sequence);

  const handleRoleChange = async (ownerId: number, newRole: number) => {
    try {
      await changeUserRole(ownerId, event.id, isOwner, newRole);
    } catch (error: any) {
      console.error('ロール変更エラー:', error);
    }
  };

  const handleAddOrganizerSuccess = () => {
    setShowAddOrganizerForm(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* 出席者数管理 - タブの外に配置 */}
      <Card className={createCardClasses('glacier')}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className={createTypographyClasses('l', 'bold', 'primary')}>
              出席者数管理
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <AttendanceCounter
            currentAttendance={event.attendance}
            eventId={event.id}
            isOwner={Boolean(isOwner)}
          />
        </CardContent>
      </Card>

      {/* タブコンテンツ */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="w-full">
        <TabsList className={cn(createTabsListClasses('soft'), "grid-cols-3")}>
          <TabsTrigger
            value="participants"
            className={createTabsTriggerClasses(activeTab === 'participants', 'primary')}
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">管理者</span>
            <span className="sm:hidden">参加</span>
          </TabsTrigger>
          <TabsTrigger
            value="timers"
            className={createTabsTriggerClasses(activeTab === 'timers', 'primary')}
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">タイマー</span>
            <span className="sm:hidden">時間</span>
          </TabsTrigger>
          <TabsTrigger
            value="speakers"
            className={createTabsTriggerClasses(activeTab === 'speakers', 'primary')}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">スピーカー</span>
            <span className="sm:hidden">発表</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-6">

          <Card className={createCardClasses('default')}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className={createTypographyClasses('l', 'bold', 'primary')}>
                  管理者 ({eventOwners.length})
                </CardTitle>
                {isOwner && !showAddOrganizerForm && (
                  <Button
                    onClick={() => setShowAddOrganizerForm(true)}
                    size="sm"
                    className={cn(createButtonClasses('secondary', 'small'), "gap-2")}
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">管理者を追加</span>
                    <span className="sm:hidden">追加</span>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {showAddOrganizerForm && (
                <div className="mb-6 p-4 border rounded-lg bg-muted/30">
                  <AddOrganizerForm
                    eventId={event.id}
                    isOwner={isOwner}
                    onSuccess={handleAddOrganizerSuccess}
                    onCancel={() => setShowAddOrganizerForm(false)}
                  />
                </div>
              )}

              <div className="space-y-3">
                {eventOwners.map((owner) => {
                  return (
                    <div key={owner.id} className="flex items-center justify-between p-3 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <Crown className={cn("h-4 w-4", UI_CONSTANTS.colors.accent)} />
                        <div>
                          <div className={createTypographyClasses('m', 'medium', 'primary')}>
                            {owner.name}
                          </div>
                          <div className={createTypographyClasses('s', 'regular', 'muted')}>
                            {owner.email}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speakers" className="space-y-4">
          <Card className={createCardClasses('default')}>
            <CardHeader>
              <CardTitle className={createTypographyClasses('l', 'bold', 'primary')}>
                スピーカー ({eventSpeakers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {eventSpeakers.length === 0 ? (
                <div className="text-center py-8">
                  <div className={createTypographyClasses('m', 'regular', 'muted')}>
                    まだスピーカーが登録されていません
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {eventSpeakers.map((speaker) => (
                    <div key={speaker.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center gap-4">
                        <Calendar className={cn("h-5 w-5", UI_CONSTANTS.colors.primary)} />
                        <div>
                          <div className={createTypographyClasses('m', 'medium', 'primary')}>
                            {speaker.user.name}
                          </div>
                          <div className={createTypographyClasses('s', 'regular', 'muted')}>
                            {speaker.user.email}
                          </div>
                        </div>
                      </div>
                      {speaker.article && (
                        <Badge variant="outline">
                          記事あり
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timers" className="space-y-4">
          <EventTimerRunner timers={eventTimers} currentUser={currentUser} />
          <EventTimerManager event={event} currentUser={currentUser} isOwner={isOwner} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
