'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { createEvent } from '@/app/events/create/actions';
import { searchUserByEmail } from '@/app/events/create/search-actions';
import type { User } from '@prisma/client';
import type { EventCreateClientProps } from '@/types/events';
import type { PublicUserInfo } from '@/types/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Search, X, Plus, ArrowLeft, Loader2, User as UserIcon } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createAvatarClasses, createTypographyClasses } from '@/lib/ui-constants';


function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      disabled={pending || disabled}
      className={cn(
        createButtonClasses('primary', 'medium'),
        (pending || disabled) && UI_CONSTANTS.states.disabled
      )}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? '作成中...' : 'イベントを作成'}
    </Button>
  );
}

export default function EventCreateClient({ currentUser, allUsers }: EventCreateClientProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  
  // フォームデータ
  const [formData, setFormData] = useState({
    title: '',
    eventUrl: '',
    attendance: 0
  });
  
  // 選択されたオーナー
  const [selectedOwners, setSelectedOwners] = useState<PublicUserInfo[]>([]);
  
  // メールアドレス検索
  const [emailSearch, setEmailSearch] = useState('');
  const [searchResult, setSearchResult] = useState<PublicUserInfo | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  // メールアドレスで検索（データベースから直接取得）
  const handleEmailSearchChange = async (value: string) => {
    setEmailSearch(value);
    setSearchResult(null);
    
    if (value.trim() === '') {
      return;
    }

    // メールアドレスとして有効な形式かチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return;
    }

    // 既に選択済みのユーザーかチェック
    if (selectedOwners.some(owner => owner.email.toLowerCase() === value.toLowerCase())) {
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

  const handleOwnerSelect = (user: PublicUserInfo) => {
    if (!selectedOwners.some(owner => owner.id === user.id)) {
      setSelectedOwners(prev => [...prev, user]);
    }
    setEmailSearch('');
    setSearchResult(null);
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
    <div className={cn("container max-w-4xl py-8 min-h-screen", UI_CONSTANTS.colors.pageBg)}>
      {/* Header */}
      <div className={cn(UI_CONSTANTS.spacing.marginBottom)}>
        <div className={cn("flex items-center mb-4", UI_CONSTANTS.spacing.gap)}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/events')}
            className={cn(UI_CONSTANTS.transitions.default)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className={createTypographyClasses('xxl', 'bold', 'body')}>イベント作成</h1>
        </div>
        <div className={cn("flex items-center", UI_CONSTANTS.spacing.smallGap)}>
          <Button 
            variant="link" 
            className={cn(
              "p-0 h-auto hover:underline", 
              createTypographyClasses('s', 'regular', 'secondary'),
              UI_CONSTANTS.transitions.default
            )}
            onClick={() => router.push('/events')}
          >
            イベント一覧
          </Button>
          <span className={createTypographyClasses('s', 'regular', 'secondary')}>/</span>
          <span className={createTypographyClasses('s', 'medium', 'body')}>新規作成</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive" className={cn(UI_CONSTANTS.spacing.marginBottom)}>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form action={handleSubmit} className="space-y-6">
        {/* Hidden fields for selected owners */}
        <input type="hidden" name="ownerIds" value={currentUser.id} />
        {selectedOwners.map(owner => (
          <input key={owner.id} type="hidden" name="ownerIds" value={owner.id} />
        ))}
        
        <Card className={cn(UI_CONSTANTS.transitions.default, UI_CONSTANTS.states.hover)}>
          <CardHeader className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
            <CardTitle className={createTypographyClasses('l', 'semibold', 'body')}>イベント情報</CardTitle>
            <CardDescription className={createTypographyClasses('s', 'regular', 'secondary')}>
              イベントの基本情報を入力してください
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-6", UI_CONSTANTS.spacing.cardPadding)}>
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                イベント名 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={formData.title}
                onChange={handleInputChange}
                required
                placeholder="例：React Tokyo Conference 2024"
                className="w-full"
              />
            </div>

            {/* Event URL */}
            <div className="space-y-2">
              <Label htmlFor="eventUrl">イベントURL（任意）</Label>
              <Input
                id="eventUrl"
                name="eventUrl"
                type="url"
                defaultValue={formData.eventUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/event"
                className="w-full"
              />
            </div>

            {/* Initial Attendance */}
            <div className="space-y-2">
              <Label htmlFor="attendance">初期参加者数（任意）</Label>
              <Input
                id="attendance"
                name="attendance"
                type="number"
                defaultValue={formData.attendance}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Owner Selection */}
        <Card className={cn(UI_CONSTANTS.transitions.default, UI_CONSTANTS.states.hover)}>
          <CardHeader className={cn(UI_CONSTANTS.spacing.sectionPadding)}>
            <CardTitle className={createTypographyClasses('l', 'semibold', 'body')}>オーナー設定</CardTitle>
            <CardDescription className={createTypographyClasses('s', 'regular', 'secondary')}>
              イベントの管理者を設定します
            </CardDescription>
          </CardHeader>
          <CardContent className={cn("space-y-4", UI_CONSTANTS.spacing.cardPadding)}>
            {/* Current User (Auto-included) */}
            <div>
              <Label className={cn(
                createTypographyClasses('s', 'medium', 'secondary'),
                "mb-2 block"
              )}>
                作成者（自動的にオーナーになります）
              </Label>
              <Card className={cn(UI_CONSTANTS.colors.mutedBg)}>
                <CardContent className={cn(UI_CONSTANTS.spacing.smallPadding)}>
                  <div className="flex items-center justify-between">
                    <div className={cn("flex items-center", UI_CONSTANTS.spacing.gap)}>
                      <div className={createAvatarClasses('small', 'primary')}>
                        <UserIcon className={cn("h-4 w-4", UI_CONSTANTS.colors.primaryText)} />
                      </div>
                      <div>
                        <p className={createTypographyClasses('s', 'medium', 'body')}>{currentUser.name}</p>
                        <p className={createTypographyClasses('xs', 'regular', 'secondary')}>{currentUser.email}</p>
                      </div>
                    </div>
                    <Badge variant="default">作成者</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Separator />

            {/* Additional Owners */}
            <div>
              <Label className={cn(
                createTypographyClasses('s', 'medium', 'secondary'),
                "mb-2 block"
              )}>
                追加オーナー（任意）
              </Label>
              <p className={cn(
                createTypographyClasses('xs', 'regular', 'secondary'),
                "mb-4"
              )}>
                メールアドレスを完全に入力してイベントの共同管理者を追加できます
              </p>
              
              {/* Email Search Input */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className={cn("absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4", UI_CONSTANTS.colors.mutedText)} />
                  <Input
                    type="email"
                    placeholder="メールアドレスを完全に入力..."
                    value={emailSearch}
                    onChange={(e) => handleEmailSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                {/* Search Result Card */}
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
                        <div className={cn("flex items-center", UI_CONSTANTS.spacing.gap)}>
                          <div className={createAvatarClasses('medium', 'primary')}>
                            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              {searchResult.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{searchResult.name || 'Unknown User'}</p>
                            <p className={cn("text-sm", UI_CONSTANTS.colors.mutedText)}>{searchResult.email}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleOwnerSelect(searchResult)}
                          className={createButtonClasses('primary', 'small')}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          追加
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {!isSearching && emailSearch.trim() !== '' && !searchResult && (
                  <Alert variant="default" className={cn("border-orange-200 bg-orange-50/50 dark:bg-orange-950/20")}>
                    <AlertDescription className="text-sm">
                      該当するユーザーが見つかりません
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Selected Owners List */}
              {selectedOwners.length > 0 && (
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">選択されたオーナー</Label>
                    <Badge variant="secondary">{selectedOwners.length}人</Badge>
                  </div>
                  <div className="space-y-2">
                    {selectedOwners.map(user => (
                      <div key={user.id} className={cn("flex items-center justify-between rounded-lg", UI_CONSTANTS.colors.border, UI_CONSTANTS.colors.mutedBg, UI_CONSTANTS.spacing.smallPadding)}>
                        <div className={cn("flex items-center", UI_CONSTANTS.spacing.gap)}>
                          <div className={createAvatarClasses('medium', 'success')}>
                            <UserIcon className="h-4 w-4 text-green-700 dark:text-green-300" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.name || 'Unknown User'}</p>
                            <p className={cn("text-xs", UI_CONSTANTS.colors.mutedText)}>{user.email}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOwnerRemove(user.id)}
                          className={cn(
                            "h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20",
                            UI_CONSTANTS.transitions.default
                          )}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className={cn("flex flex-col sm:flex-row pt-4", UI_CONSTANTS.spacing.gap)}>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/events')}
            className={cn("sm:w-auto", createButtonClasses('secondary', 'medium'))}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            キャンセル
          </Button>
          <SubmitButton disabled={!formData.title.trim()} />
        </div>
      </form>
    </div>
  );
}
