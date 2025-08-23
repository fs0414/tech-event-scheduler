'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import mockData from '@/data/mockData.json';

export default function Events() {
  const { events, users, owners } = mockData;
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const getEventOwners = (eventId: number) => {
    const ownerIds = owners
      .filter(owner => owner.event_id === eventId)
      .map(owner => owner.user_id);

    return users.filter(user => ownerIds.includes(user.id));
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">イベント一覧</h1>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="イベントを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
            </svg>
            新しいイベント
          </button>
        </div>

        {/* Stats */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{events.length}</div>
              <div className="text-sm text-gray-600">総イベント数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredEvents.length}</div>
              <div className="text-sm text-gray-600">表示中</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-gray-600">参加者</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{owners.length}</div>
              <div className="text-sm text-gray-600">参加記録</div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => {
          const eventOwners = getEventOwners(event.id);

          return (
            <div key={event.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="p-6">
                {/* Event Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  {/* Event Link */}
                  <a
                    href={event.event_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    イベントページを見る
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                    </svg>
                  </a>
                </div>

                {/* Participants Section */}
                {eventOwners.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">参加者</span>
                      <span className="text-sm text-gray-500">{eventOwners.length}人</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {eventOwners.slice(0, 3).map(owner => (
                        <span
                          key={owner.id}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {owner.name}
                        </span>
                      ))}
                      {eventOwners.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          +{eventOwners.length - 3}人
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Event Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => router.push(`/events/${event.id}`)}
                      className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      詳細
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">イベントが見つかりません</h3>
          <p className="text-gray-600 mb-4">検索条件を変更してお試しください</p>
          <button
            onClick={() => setSearchTerm('')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            検索をクリア
          </button>
        </div>
      )}
    </div>
  );
}