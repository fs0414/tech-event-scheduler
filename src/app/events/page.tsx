import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import EventsClient from '@/components/events-client';

async function getEventsData(userId: string, search?: string) {
  return await prisma.event.findMany({
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
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

interface EventsPageProps {
  searchParams: Promise<{ search?: string }>;
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { search } = await searchParams;
  
  // Supabaseから認証ユーザー取得
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  // SupabaseユーザーIDから内部ユーザー取得
  let dbUser = await prisma.user.findUnique({
    where: { supabaseId: user.id }
  });
  
  if (!dbUser) {
    // ユーザーが存在しない場合は初回ログインとして作成
    dbUser = await prisma.user.create({
      data: {
        id: `user-${Date.now()}`,
        supabaseId: user.id,
        email: user.email || '',
        name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
        avatarUrl: user.user_metadata?.avatar_url || null
      }
    });
  }
  
  // ユーザーが所有するイベントを取得
  const events = await getEventsData(dbUser.id, search);

  return (
    <Suspense fallback={<EventsLoadingSkeleton />}>
      <EventsClient events={events} initialSearch={search} />
    </Suspense>
  );
}

function EventsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="mb-8">
        <div className="h-9 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="text-center">
                <div className="h-8 bg-gray-200 rounded w-12 mx-auto mb-2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}