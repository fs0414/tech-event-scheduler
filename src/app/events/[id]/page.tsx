'use client';

import { useParams } from 'next/navigation';
import mockData from '@/data/mockData.json';

export default function EventManagement() {
  const params = useParams();
  const eventId = parseInt(params.id as string);
  const { events, users, owners } = mockData;

  const event = events.find(e => e.id === eventId);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">イベントが見つかりません</h1>
          <p className="text-gray-600">指定されたイベントは存在しません。</p>
        </div>
      </div>
    );
  }

  const getEventOwners = (eventId: number) => {
    const ownerIds = owners
      .filter(owner => owner.event_id === eventId)
      .map(owner => owner.user_id);

    return users.filter(user => ownerIds.includes(user.id));
  };

  const eventOwners = getEventOwners(event.id);

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

          {/* Event Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{eventOwners.length}</div>
              <div className="text-sm text-blue-800">参加者数</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">有効</div>
              <div className="text-sm text-green-800">ステータス</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">#{event.id}</div>
              <div className="text-sm text-purple-800">イベントID</div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Management */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="p-6">
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
                      ID
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {eventOwners.map(owner => (
                    <tr key={owner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{owner.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">#{owner.id}</div>
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
      </div>
    </div>
  );
}