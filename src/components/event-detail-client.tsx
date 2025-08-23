'use client';

import { useState } from 'react';
import type { Event, User, Owner, Speaker, Article, Timer } from '@prisma/client';

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
}

export default function EventDetailClient({ event }: EventDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'participants' | 'speakers' | 'schedule'>('participants');

  const eventOwners = event.owners.map(owner => owner.user);
  const eventSpeakers = event.speakers;
  const eventTimers = event.timers.sort((a, b) => a.sequence - b.sequence);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">イベント管理</h1>
        <nav className="text-sm">
          <a href="/events" className="text-blue-600 hover:text-blue-800">イベント一覧</a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-600">{event.title}</span>
        </nav>
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 mb-8">
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">{event.title}</h2>
            {event.eventUrl && (
              <a
                href={event.eventUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                イベントページを見る
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </a>
            )}
          </div>

          {/* Event Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{eventOwners.length}</div>
              <div className="text-sm text-blue-800">参加者数</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{eventSpeakers.length}</div>
              <div className="text-sm text-green-800">スピーカー数</div>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-600">{eventTimers.length}</div>
              <div className="text-sm text-orange-800">セッション数</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">#{event.id}</div>
              <div className="text-sm text-purple-800">イベントID</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('participants')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'participants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              参加者管理 ({eventOwners.length})
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'speakers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              スピーカー ({eventSpeakers.length})
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'schedule'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              スケジュール ({eventTimers.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'participants' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">参加者管理</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  参加者を追加
                </button>
              </div>

              {eventOwners.length > 0 ? (
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          参加者
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          メール
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          役割
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          操作
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {event.owners.map(owner => (
                        <tr key={owner.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{owner.user.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{owner.user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              owner.role === 'organizer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {owner.role === 'organizer' ? '主催者' : '参加者'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-red-600 hover:text-red-900">削除</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">参加者がいません</h4>
                  <p className="text-gray-600">まだ誰も参加していません。</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'speakers' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">スピーカー管理</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  スピーカーを追加
                </button>
              </div>

              {eventSpeakers.length > 0 ? (
                <div className="grid gap-6">
                  {eventSpeakers.map(speaker => (
                    <div key={speaker.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{speaker.user.name}</h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              speaker.role === 'keynote' ? 'bg-purple-100 text-purple-800' : 
                              speaker.role === 'moderator' ? 'bg-orange-100 text-orange-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {speaker.role === 'keynote' ? 'キーノート' : 
                               speaker.role === 'moderator' ? 'モデレーター' : 'スピーカー'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{speaker.user.email}</p>
                          {speaker.article && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-1">{speaker.article.title}</h5>
                              {speaker.article.description && (
                                <p className="text-sm text-gray-600 mb-2">{speaker.article.description}</p>
                              )}
                              {speaker.article.url && (
                                <a
                                  href={speaker.article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  記事を見る →
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                        <button className="text-red-600 hover:text-red-900 text-sm">削除</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">スピーカーがいません</h4>
                  <p className="text-gray-600">まだスピーカーが登録されていません。</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">スケジュール管理</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  セッションを追加
                </button>
              </div>

              {eventTimers.length > 0 ? (
                <div className="space-y-4">
                  {eventTimers.map((timer, index) => (
                    <div key={timer.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {timer.sequence}
                        </div>
                        <div>
                          <div className="text-lg font-medium text-gray-900">
                            セッション {timer.sequence}
                          </div>
                          <div className="text-sm text-gray-600">
                            {timer.durationMinutes}分間
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-sm">編集</button>
                        <button className="text-red-600 hover:text-red-900 text-sm">削除</button>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      総所要時間: {eventTimers.reduce((sum, timer) => sum + timer.durationMinutes, 0)}分
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">スケジュールがありません</h4>
                  <p className="text-gray-600">まだセッションが登録されていません。</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}