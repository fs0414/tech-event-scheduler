'use client';

import type { EventWithDetails } from '@/types/events';
import { UI_CONSTANTS, cn } from '@/lib/ui-constants';
import EventDetailHeader from '@/components/event-detail-header';
import EventDetailTabs from '@/components/event-detail-tabs';

interface EventDetailClientProps {
  event: EventWithDetails;
  currentUser?: { id: string; email: string; name: string | null } | null;
  isOwner?: boolean;
}

export default function EventDetailClient({ event, currentUser, isOwner: propIsOwner }: EventDetailClientProps) {
  // isOwnerプロパティが渡されたらそれを使用、なければ従来のロジック
  const isOwner = propIsOwner ?? (currentUser && event.owners.some(owner => 
    owner.userId === currentUser.id && owner.role === 'organizer'
  ));

  return (
    <div className={cn("min-h-screen", UI_CONSTANTS.colors.pageBg)}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl mx-auto">
        <EventDetailHeader
          title={event.title}
          eventUrl={event.eventUrl}
          attendance={event.attendance}
          ownersCount={event.owners.length}
          speakersCount={event.speakers.length}
          timersCount={event.timers.length}
        />
        
        <EventDetailTabs
          event={event}
          currentUser={currentUser}
          isOwner={Boolean(isOwner)}
        />
      </div>
    </div>
  );
}