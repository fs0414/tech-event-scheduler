import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Users, UserCheck, Clock, Calendar } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';
import Link from 'next/link';

interface EventDetailHeaderProps {
  title: string;
  eventUrl?: string | null;
  attendance: number;
  ownersCount: number;
  speakersCount: number;
  timersCount: number;
}

export default function EventDetailHeader({ 
  title, 
  eventUrl, 
  attendance, 
  ownersCount, 
  speakersCount, 
  timersCount 
}: EventDetailHeaderProps) {
  return (
    <>
      {/* Mobile-first Header */}
      <div className="mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className={cn("h-8 w-8 p-0", UI_CONSTANTS.transitions.default)}
          >
            <Link href="/events">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className={createTypographyClasses('xl', 'bold', 'muted')}>
            <span className="hidden sm:inline">イベント管理</span>
            <span className="sm:hidden">管理</span>
          </h1>
        </div>
        <nav className="flex items-center gap-1 text-xs sm:text-sm flex-wrap">
          <Link href="/events" className={cn(
            "hover:underline",
            UI_CONSTANTS.colors.mutedText,
            UI_CONSTANTS.transitions.default
          )}>
            イベント一覧
          </Link>
          <span className={UI_CONSTANTS.colors.mutedText}>›</span>
          <span className={createTypographyClasses('xs', 'medium', 'muted')}>
            {title.length > 30 ? `${title.substring(0, 30)}...` : title}
          </span>
        </nav>
      </div>

      {/* Event Overview Card */}
      <Card className={cn(createCardClasses('soft'), "mb-6 sm:mb-8")}>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="flex-1">
              <CardTitle className={cn(createTypographyClasses('xxl', 'bold', 'dark'), "mb-2 leading-tight")}>
                {title}
              </CardTitle>
            </div>
            {eventUrl && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className={cn(createButtonClasses('secondary', 'small'), "gap-2 self-start")}
              >
                <a
                  href={eventUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">イベントページ</span>
                  <span className="sm:hidden">詳細</span>
                </a>
              </Button>
            )}
          </div>
        </CardHeader>
        {/* Stats Section */}
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className={cn("flex flex-col items-center p-2 rounded", UI_CONSTANTS.colors.paleAccentBg, "border border-[#cffafe]")}>
              <div className={cn("p-1 rounded mb-1", UI_CONSTANTS.colors.primary)}>
                <UserCheck className="h-3 w-3 text-white" />
              </div>
              <div className={createTypographyClasses('l', 'bold', 'primary')}>
                {attendance}
              </div>
              <div className={createTypographyClasses('xs', 'regular', 'deep')}>
                出席者
              </div>
            </div>

            <div className={cn("flex flex-col items-center p-2 rounded", UI_CONSTANTS.colors.paleAccentBg, "border border-[#cffafe]")}>
              <div className={cn("p-1 rounded mb-1", UI_CONSTANTS.colors.primary)}>
                <Users className="h-3 w-3 text-white" />
              </div>
              <div className={createTypographyClasses('l', 'bold', 'primary')}>
                {ownersCount}
              </div>
              <div className={createTypographyClasses('xs', 'regular', 'deep')}>
                オーナー
              </div>
            </div>

            <div className={cn("flex flex-col items-center p-2 rounded", UI_CONSTANTS.colors.paleAccentBg, "border border-[#cffafe]")}>
              <div className={cn("p-1 rounded mb-1", UI_CONSTANTS.colors.primary)}>
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <div className={createTypographyClasses('l', 'bold', 'primary')}>
                {speakersCount}
              </div>
              <div className={createTypographyClasses('xs', 'regular', 'deep')}>
                スピーカー
              </div>
            </div>

            <div className={cn("flex flex-col items-center p-2 rounded", UI_CONSTANTS.colors.paleAccentBg, "border border-[#cffafe]")}>
              <div className={cn("p-1 rounded mb-1", UI_CONSTANTS.colors.primary)}>
                <Clock className="h-3 w-3 text-white" />
              </div>
              <div className={createTypographyClasses('l', 'bold', 'primary')}>
                {timersCount}
              </div>
              <div className={createTypographyClasses('xs', 'regular', 'deep')}>
                タイマー
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
