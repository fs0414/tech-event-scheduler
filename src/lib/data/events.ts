import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import type { EventWithDetails } from '@/types/events';

export interface EventDetail extends EventWithDetails {}

export const getEventsForUser = cache(async (userId: string, search?: string) => {
  const events = await prisma.event.findMany({
    where: {
      AND: [
        search ? {
          title: { 
            contains: search, 
            mode: 'insensitive' 
          }
        } : {},
        {
          owners: {
            some: {
              userId: userId
            }
          }
        }
      ]
    },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return events;
});

export const getEventById = cache(async (id: number) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    }
  });
  
  return event;
});

export const getEventWithOwnership = cache(async (id: number, userId?: string) => {
  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    }
  });
  
  if (!event) {
    return null;
  }
  
  const isOwner = userId ? event.owners.some(owner => owner.userId === userId) : false;
  
  return {
    event,
    isOwner,
    timers: event.timers
  };
});

export const getEventStats = cache(async (userId: string) => {
  const [totalEvents, totalAttendance] = await Promise.all([
    prisma.event.count({
      where: {
        owners: {
          some: {
            userId: userId
          }
        }
      }
    }),
    prisma.event.aggregate({
      where: {
        owners: {
          some: {
            userId: userId
          }
        }
      },
      _sum: {
        attendance: true
      }
    })
  ]);

  return {
    totalEvents,
    totalAttendance: totalAttendance._sum.attendance || 0
  };
});

export const checkEventOwnership = cache(async (userId: string, eventId: number): Promise<boolean> => {
  const owner = await prisma.owner.findFirst({
    where: {
      eventId,
      userId
    }
  });
  
  return !!owner;
});

export const getEventTimers = cache(async (eventId: number) => {
  const timers = await prisma.timer.findMany({
    where: {
      eventId
    },
    orderBy: {
      sequence: 'asc'
    }
  });
  
  return timers;
});

export const getMultipleEventData = cache(async (eventIds: number[]) => {
  const events = await prisma.event.findMany({
    where: {
      id: {
        in: eventIds
      }
    },
    include: {
      owners: {
        include: { 
          user: true
        }
      },
      speakers: {
        include: {
          user: true,
          article: true
        }
      },
      timers: {
        orderBy: {
          sequence: 'asc'
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return events;
});

export function invalidateEventCache(eventId?: number, userId?: string) {
  const tags = ['events:list', 'events:detail'];
  
  if (eventId) {
    tags.push(`event:${eventId}`, `timers:event:${eventId}`);
  }
  
  if (userId) {
    tags.push(`events:user:${userId}`, `events:stats:${userId}`);
  }
  
  return tags;
}
