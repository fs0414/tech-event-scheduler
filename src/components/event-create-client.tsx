'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createEvent, searchUserByEmail } from '@/app/events/create/actions';
import type { User } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Search, Loader2, X } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';

interface EventCreateClientProps {
  currentUser: User;
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <Button
      type="submit"
      disabled={pending || disabled}
      className={cn(
        createButtonClasses('primary', 'medium'),
        UI_CONSTANTS.transitions.default
      )}
    >
      {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
      <span className={createTypographyClasses('s', 'medium', 'body')}>
        {pending ? '作成中...' : 'イベントを作成'}
      </span>
    </Button>
  );
}

export default function EventCreateClient({ currentUser }: EventCreateClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  
  // フォームデータ
  const [formData, setFormData] = useState({
    title: '',
    eventUrl: '',
    attendance: 0
  });
  
  // 選択されたオーナー（作成者は自動的に含まれる）
  const [selectedOwners, setSelectedOwners] = useState<Pick<User, 'id' | 'name' | 'email'>[]>([]);
  
  // メールアドレス検索
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResult, setSearchResult] = useState<Pick<User, 'id' | 'name' | 'email'> | null>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // 外側クリックで検索結果を閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResult(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleEmailSearch = (value: string) => {
    setEmailSearch(value);
    
    if (value.trim() === '') {
      setSearchResult(null);
      setShowSearchResult(false);
      setSearchError(null);
      return;
    }
    
    // Server Actionを使ってユーザー検索
    startTransition(async () => {
      const excludeUserIds = [currentUser.id, ...selectedOwners.map(owner => owner.id)];
      const excludeUserId = excludeUserIds.find(id => id);
      
      const result = await searchUserByEmail(value, excludeUserId);
      
      if (result.error) {
        setSearchError(result.error);
        setSearchResult(null);
      } else {
        setSearchError(null);
        setSearchResult(result.user);
      }
      
      setShowSearchResult(true);
    });
  };

  const handleOwnerSelect = (user: Pick<User, 'id' | 'name' | 'email'>) => {
    if (!selectedOwners.find(owner => owner.id === user.id)) {
      setSelectedOwners(prev => [...prev, user]);
    }
    setEmailSearch('');
    setSearchResult(null);
    setShowSearchResult(false);
  };

  const handleOwnerRemove = (userId: string) => {
    setSelectedOwners(prev => prev.filter(owner => owner.id !== userId));
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null);
      await createEvent(formData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={cn("min-h-screen", UI_CONSTANTS.colors.pageBg)}>
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl mx-auto">
        {/* Header */}
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
            <h1 className={createTypographyClasses('xxl', 'bold', 'muted')}>
              イベント作成
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
            <span className={createTypographyClasses('xs', 'medium', 'muted')}>新規作成</span>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive" className="mb-4 sm:mb-6">
            <AlertDescription className={createTypographyClasses('s', 'regular', 'body')}>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form action={handleSubmit}>
          {/* Hidden fields for selected owners */}
          <input type="hidden" name="ownerIds" value={currentUser.id} />
          {selectedOwners.map(owner => (
            <input key={owner.id} type="hidden" name="ownerIds" value={owner.id} />
          ))}
          
          <Card className={cn(
            createCardClasses('glacier'),
            "mb-4 sm:mb-6",
            "border-l-4 border-l-[#00c4cc]"
          )}>
            <CardHeader>
              <CardTitle className={createTypographyClasses('l', 'bold', 'dark')}>イベント情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Event Title */}
              <div>
                <label htmlFor="title" className={cn(
                  "block mb-2",
                  createTypographyClasses('s', 'medium', 'muted')
                )}>
                  イベント名 <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  id="title"
                  name="title"
                  defaultValue={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="イベントのタイトルを入力してください"
                />
              </div>

              {/* Event URL */}
              <div>
                <label htmlFor="eventUrl" className={cn(
                  "block mb-2",
                  createTypographyClasses('s', 'medium', 'muted')
                )}>
                  イベントURL
                </label>
                <Input
                  type="url"
                  id="eventUrl"
                  name="eventUrl"
                  defaultValue={formData.eventUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/event"
                />
              </div>

              {/* Initial Attendance */}
              <div>
                <label htmlFor="attendance" className={cn(
                  "block mb-2",
                  createTypographyClasses('s', 'medium', 'muted')
                )}>
                  初期参加者数
                </label>
                <Input
                  type="number"
                  id="attendance"
                  name="attendance"
                  defaultValue={formData.attendance}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </CardContent>
          </Card>

          {/* Owner Selection */}
          <Card className={cn(
            createCardClasses('soft'),
            "border-l-4 border-l-[#16a34a]"
          )}>
            <CardHeader>
              <CardTitle className={createTypographyClasses('l', 'bold', 'muted')}>管理者設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Current User (Auto-included) */}
              <div>
                <h3 className={cn(
                  "mb-2",
                  createTypographyClasses('s', 'medium', 'muted')
                )}>作成者（自動的に管理者になります）</h3>
                <div className={cn(
                  "p-3 rounded-lg border bg-white",
                  "border-[#cffafe]"
                )}>
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-full bg-gradient-to-br from-[#00c4cc] to-[#0891b2] flex items-center justify-center"
                    )}>
                      <span className={cn(
                        "text-white font-semibold text-sm"
                      )}>
                        {currentUser.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={createTypographyClasses('m', 'semibold', 'muted')}>{currentUser.name}</p>
                      <p className={createTypographyClasses('s', 'regular', 'secondary')}>{currentUser.email}</p>
                    </div>
                    <Badge className="bg-[#00c4cc] text-white text-xs px-2 py-0.5">
                      作成者
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Owners */}
              <div>
                <h3 className={cn(
                  "mb-2",
                  createTypographyClasses('s', 'medium', 'muted')
                )}>
                  追加管理者（任意）
                </h3>
                <p className={cn(
                  "mb-4",
                  createTypographyClasses('xs', 'medium', 'muted')
                )}>
                  メールアドレスで検索してイベントの共同管理者を追加できます
                </p>
                
                {/* Email Search Input */}
                <div className="relative" ref={searchRef}>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="メールアドレスで検索..."
                      value={emailSearch}
                      onChange={(e) => handleEmailSearch(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className={cn("h-4 w-4", UI_CONSTANTS.colors.mutedText)} />
                    </div>
                  </div>
                  
                  {/* Search Results Dropdown */}
                  {showSearchResult && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-[#e2e8f0] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {isPending ? (
                        <div className="px-4 py-3 flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className={createTypographyClasses('s', 'regular', 'secondary')}>
                            検索中...
                          </span>
                        </div>
                      ) : searchError ? (
                        <div className="px-4 py-3">
                          <span className={createTypographyClasses('s', 'regular', 'secondary')}>
                            {searchError}
                          </span>
                        </div>
                      ) : searchResult ? (
                        <button
                          type="button"
                          onClick={() => handleOwnerSelect(searchResult)}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-[#f8fafc] focus:bg-[#f8fafc] focus:outline-none",
                            UI_CONSTANTS.transitions.default
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full bg-gradient-to-br from-[#00c4cc] to-[#0891b2] flex items-center justify-center"
                            )}>
                              <span className="text-sm font-medium text-white">
                                {searchResult.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className={createTypographyClasses('s', 'medium', 'muted')}>{searchResult.name}</p>
                              <p className={createTypographyClasses('xs', 'regular', 'secondary')}>{searchResult.email}</p>
                            </div>
                          </div>
                        </button>
                      ) : (
                        <div className="px-4 py-3">
                          <span className={createTypographyClasses('s', 'regular', 'secondary')}>
                            該当するユーザーが見つかりません
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              
                {/* Selected Owners List */}
                {selectedOwners.length > 0 && (
                  <div className="mt-4">
                    <h4 className={cn(
                      "mb-2",
                      createTypographyClasses('s', 'medium', 'muted')
                    )}>選択されたオーナー</h4>
                    <div className="space-y-2">
                      {selectedOwners.map(user => (
                        <div key={user.id} className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          "bg-[#f0fdf4] border-[#bbf7d0]"
                        )}>
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center",
                              "bg-gradient-to-br from-[#16a34a] to-[#15803d]"
                            )}>
                              <span className={cn(
                                createTypographyClasses('s', 'medium', 'body'),
                                "text-white"
                              )}>
                                {user.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className={createTypographyClasses('s', 'medium', 'muted')}>{user.name}</p>
                              <p className={createTypographyClasses('xs', 'regular', 'secondary')}>{user.email}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOwnerRemove(user.id)}
                            className={cn(
                              "h-8 w-8 p-0 text-red-600 hover:text-red-800 hover:bg-red-50",
                              UI_CONSTANTS.transitions.default
                            )}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className={cn(
                      "mt-2 p-2 rounded border",
                      "bg-[#f0fdf4] border-[#bbf7d0]"
                    )}>
                      <p className={cn(
                        createTypographyClasses('xs', 'regular', 'body'),
                        "text-[#16a34a]"
                      )}>
                        {selectedOwners.length}人の追加オーナーが選択されています
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/events')}
              className={cn(
                createButtonClasses('secondary', 'medium'),
                UI_CONSTANTS.transitions.default
              )}
            >
              <span className={createTypographyClasses('s', 'medium', 'body')}>
                キャンセル
              </span>
            </Button>
            <SubmitButton disabled={!formData.title.trim()} />
          </div>
        </form>
      </div>
    </div>
  );
}
