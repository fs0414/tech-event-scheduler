'use client';

import { useState, useTransition } from 'react';
import type { User } from '@prisma/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AttendanceCounter from '@/components/attendance-counter';
import { searchUserByEmail } from '@/app/events/create/search-actions';
import { addOwner, removeOwner } from '@/app/events/[id]/owner-actions';
import type { EventWithDetails, EventDetailClientProps } from '@/types/events';
import type { PublicUserInfo } from '@/types/auth';
import { UI_CONSTANTS, cn, createButtonClasses, createAvatarClasses, createTypographyClasses } from '@/lib/ui-constants';
import { 
  Users, 
  Mic, 
  Clock, 
  ExternalLink, 
  Plus, 
  Trash2,
  Edit,
  UserPlus,
  Calendar,
  Hash,
  Search,
  Loader2
} from 'lucide-react';


export default function EventDetailClient({ event, currentUser, auth }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'participants' | 'speakers' | 'schedule'>('participants');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  
  // オーナー追加機能
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResult, setSearchResult] = useState<PublicUserInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const eventOwners = event.owners.map(owner => owner.user);
  const eventSpeakers = event.speakers;
  const eventTimers = event.timers.sort((a, b) => a.sequence - b.sequence);
  
  // 現在のユーザーがオーナーかどうか判定
  const isOwner = currentUser ? event.owners.some(owner => owner.userId === currentUser.id) : false;

  // メールアドレス検索
  const handleEmailSearchChange = async (value: string) => {
    setEmailSearch(value);
    setSearchResult(null);
    
    if (value.trim() === '') return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return;
    
    if (eventOwners.some(owner => owner.email.toLowerCase() === value.toLowerCase())) {
      return;
    }
    
    setIsSearching(true);
    try {
      const result = await searchUserByEmail(value);
      if (result) {
        setSearchResult(result);
      }
    } catch (error) {
      console.error('検索エラー:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // オーナー追加
  const handleAddOwner = (user: PublicUserInfo) => {
    startTransition(async () => {
      try {
        setError(null);
        await addOwner(event.id, user.email);
        setEmailSearch('');
        setSearchResult(null);
      } catch (error: any) {
        setError(error.message);
      }
    });
  };

  // オーナー削除
  const handleRemoveOwner = (userId: string) => {
    startTransition(async () => {
      try {
        setError(null);
        await removeOwner(event.id, userId);
      } catch (error: any) {
        setError(error.message);
      }
    });
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* Header */}
      <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
        <h1 className="text-3xl font-bold mb-4">イベント管理</h1>
        <div className={cn("flex items-center text-sm", UI_CONSTANTS.spacing.smallGap, UI_CONSTANTS.colors.mutedText)}>
          <a href="/events" className={cn("hover:underline", UI_CONSTANTS.transitions.default)}>
            イベント一覧
          </a>
          <span>/</span>
          <span>{event.title}</span>
        </div>
      </div>

      {/* Event Details Card */}
      <Card className={cn(UI_CONSTANTS.spacing.marginBottom)}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              {event.eventUrl && (
                <a
                  href={event.eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "inline-flex items-center text-sm mt-2 hover:underline",
                    UI_CONSTANTS.spacing.smallGap,
                    UI_CONSTANTS.colors.primaryText,
                    UI_CONSTANTS.transitions.default
                  )}
                >
                  イベントページを見る
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              <Hash className="h-4 w-4 mr-1" />
              {event.id}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Simple Stats Row */}
          <div className={cn("flex items-center gap-6 text-sm", UI_CONSTANTS.colors.secondary)}>
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
              <Users className="h-4 w-4" />
              <span>参加者 {eventOwners.length}人</span>
            </div>
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
              <Mic className="h-4 w-4" />
              <span>スピーカー {eventSpeakers.length}人</span>
            </div>
            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
              <Clock className="h-4 w-4" />
              <span>セッション {eventTimers.length}個</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Counter - Separated Component */}
      <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
        <AttendanceCounter 
          currentAttendance={event.attendance} 
          eventId={event.id} 
          isOwner={isOwner} 
        />
      </div>

      {/* Tabs */}
      <Card>
        <Tabs defaultValue="participants" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="participants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              オーナー管理 ({eventOwners.length})
            </TabsTrigger>
            <TabsTrigger value="speakers" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              スピーカー ({eventSpeakers.length})
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              スケジュール ({eventTimers.length})
            </TabsTrigger>
          </TabsList>

          {/* Participants Tab */}
          <TabsContent value="participants">
            <CardHeader>
              <CardTitle>オーナー管理</CardTitle>
            </CardHeader>
            <CardContent className={cn("space-y-6", UI_CONSTANTS.spacing.sectionPadding)}>
              {/* Error Message */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Owner Addition - Only for owners */}
              {isOwner && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        placeholder="メールアドレスを完全に入力してオーナーを追加..."
                        value={emailSearch}
                        onChange={(e) => handleEmailSearchChange(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    {/* Search Result */}
                    {isSearching && (
                      <Card>
                        <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
                          <div className="flex items-center justify-center">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span className={cn("text-sm", UI_CONSTANTS.colors.mutedText)}>検索中...</span>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                    
                    {!isSearching && searchResult && (
                      <Card className={cn(UI_CONSTANTS.colors.accentBorder)}>
                        <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding, UI_CONSTANTS.colors.accentBg)}>
                          <div className="flex items-center justify-between">
                            <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
                              <div className={createAvatarClasses('small', 'primary')}>
                                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                  {searchResult.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{searchResult.name}</p>
                                <p className={cn("text-sm", UI_CONSTANTS.colors.mutedText)}>{searchResult.email}</p>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => handleAddOwner(searchResult)}
                              disabled={isPending}
                              className={cn(
                                createButtonClasses('primary', 'small'),
                                isPending && UI_CONSTANTS.states.disabled
                              )}
                            >
                              {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                              ) : (
                                <Plus className="h-4 w-4 mr-1" />
                              )}
                              追加
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <Separator />
                </div>
              )}

              {/* Owners List */}
              {eventOwners.length > 0 ? (
                <div className="space-y-2">
                  {event.owners.map(owner => (
                    <Card key={owner.id}>
                      <CardContent className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
                        <div className="flex items-center justify-between">
                          <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
                            <div className={createAvatarClasses('medium', 'muted')}>
                              <span className="text-sm font-medium">
                                {owner.user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{owner.user.name}</p>
                              <p className={cn("text-sm", UI_CONSTANTS.colors.mutedText)}>{owner.user.email}</p>
                            </div>
                          </div>
                          <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
                            <Badge variant={owner.role === 'organizer' ? 'default' : 'secondary'}>
                              {owner.role === 'organizer' ? '主催者' : 'オーナー'}
                            </Badge>
                            {isOwner && owner.userId !== currentUser?.id && (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={cn(
                                  "text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20",
                                  isPending && UI_CONSTANTS.states.disabled
                                )}
                                onClick={() => handleRemoveOwner(owner.userId)}
                                disabled={isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    まだオーナーが登録されていません。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </TabsContent>

          {/* Speakers Tab */}
          <TabsContent value="speakers">
            <CardHeader className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
              <div className="flex items-center justify-between">
                <CardTitle className={createTypographyClasses('l', 'semibold', 'body')}>スピーカー管理</CardTitle>
                <Button className={cn(
                  createButtonClasses('accent', 'medium'),
                  UI_CONSTANTS.transitions.bounce
                )}>
                  <Plus className="mr-2 h-4 w-4" />
                  <span className={createTypographyClasses('s', 'medium', 'body')}>スピーカーを追加</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {eventSpeakers.length > 0 ? (
                <div className="space-y-4">
                  {eventSpeakers.map(speaker => (
                    <Card key={speaker.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <span className="text-sm font-medium">
                                  {speaker.user.name?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{speaker.user.name}</p>
                                <p className="text-sm text-muted-foreground">{speaker.user.email}</p>
                              </div>
                              <Badge variant={
                                speaker.role === 'keynote' ? 'default' : 
                                speaker.role === 'moderator' ? 'outline' : 'secondary'
                              }>
                                {speaker.role === 'keynote' ? 'キーノート' : 
                                 speaker.role === 'moderator' ? 'モデレーター' : 'スピーカー'}
                              </Badge>
                            </div>
                            {speaker.article && (
                              <Card className="bg-muted/30">
                                <CardContent className="p-3">
                                  <h4 className="font-medium mb-1">{speaker.article.title}</h4>
                                  {speaker.article.description && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {speaker.article.description}
                                    </p>
                                  )}
                                  {speaker.article.url && (
                                    <a
                                      href={speaker.article.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                    >
                                      記事を見る
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                          <Button variant="ghost" size="sm" className="text-destructive ml-4">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Alert>
                  <Mic className="h-4 w-4" />
                  <AlertDescription>
                    まだスピーカーが登録されていません。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </TabsContent>

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>スケジュール管理</CardTitle>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  セッションを追加
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {eventTimers.length > 0 ? (
                <div className="space-y-3">
                  {eventTimers.map((timer, index) => (
                    <Card key={timer.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {timer.sequence}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">セッション {timer.sequence}</p>
                              <p className="text-sm text-muted-foreground">
                                {timer.durationMinutes}分間
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Alert>
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      総所要時間: {eventTimers.reduce((sum, timer) => sum + timer.durationMinutes, 0)}分
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    まだセッションが登録されていません。
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
