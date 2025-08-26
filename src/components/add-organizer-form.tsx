'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { searchUserByEmailAuth } from '@/app/events/_actions/user.actions';
import { addOrganizer } from '@/app/events/_actions/owner.actions';
import { Search, Crown, Loader2, X, UserPlus } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';

interface AddOrganizerFormProps {
  eventId: number;
  isOwner: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function AddOrganizerForm({ eventId, isOwner, onSuccess, onCancel }: AddOrganizerFormProps) {
  const [email, setEmail] = useState('');
  const [searchResult, setSearchResult] = useState<{ id: string; name: string | null; email: string } | null>(null);
  const [isSearching, startSearchTransition] = useTransition();
  const [isAdding, startAddTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!email.trim()) return;
    
    startSearchTransition(async () => {
      try {
        setError(null);
        const result = await searchUserByEmailAuth(email);
        
        if (result.error) {
          // エラーがある場合
          setError(result.error);
          setSearchResult(null);
        } else if (result.user) {
          // ユーザーが見つかった場合
          setSearchResult(result.user);
          setError(null);
        } else {
          // ユーザーが見つからない場合
          setError('指定されたメールアドレスのユーザーが見つかりません');
          setSearchResult(null);
        }
      } catch (error: any) {
        setError(error.message);
        setSearchResult(null);
      }
    });
  };

  const handleAddOrganizer = () => {
    if (!searchResult) return;
    
    startAddTransition(async () => {
      try {
        setError(null);
        await addOrganizer(eventId, isOwner, searchResult.email);
        setEmail('');
        setSearchResult(null);
        onSuccess?.();
      } catch (error: any) {
        setError(error.message);
      }
    });
  };

  return (
    <Card className={cn(createCardClasses('glacier'))}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Crown className={cn("h-5 w-5", UI_CONSTANTS.colors.primaryText)} />
            <h4 className={createTypographyClasses('m', 'semibold', 'muted')}>管理者を追加</h4>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="ghost"
                size="sm"
                className="ml-auto h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className={createTypographyClasses('s', 'regular', 'body')}>
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Input
              type="email"
              placeholder="メールアドレスを入力..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button
              onClick={handleSearch}
              disabled={!email.trim() || isSearching}
              className={cn(
                createButtonClasses('secondary', 'medium'),
                UI_CONSTANTS.transitions.default
              )}
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {searchResult && (
            <div className={cn(
              "p-3 rounded-lg border bg-white border-[#cffafe]"
            )}>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full bg-gradient-to-br from-[#00c4cc] to-[#0891b2] flex items-center justify-center flex-shrink-0"
                )}>
                  <span className="text-white font-semibold text-sm">
                    {searchResult.name?.[0] || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={createTypographyClasses('m', 'semibold', 'muted')}>
                    {searchResult.name || 'Unknown'}
                  </div>
                  <div className={cn(
                    createTypographyClasses('s', 'regular', 'secondary'),
                    "truncate"
                  )}>{searchResult.email}</div>
                </div>
                <Button
                  onClick={handleAddOrganizer}
                  disabled={isAdding}
                  className={cn(
                    createButtonClasses('success', 'small'),
                    UI_CONSTANTS.transitions.default
                  )}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      追加中
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3 w-3 mr-1" />
                      管理者として追加
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}