'use client';

import { useState, useTransition } from 'react';
import { User } from '@prisma/client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User as UserIcon, Mail, Calendar, Edit2, Save, X, Loader2 } from 'lucide-react';
import { UI_CONSTANTS, cn, createButtonClasses, createCardClasses, createTypographyClasses } from '@/lib/ui-constants';
import { updateUserName } from '@/app/profile/actions';

interface ProfileClientProps {
  user: User;
}

export default function ProfileClient({ user }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || '');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    
    const formData = new FormData();
    formData.append('name', name);
    
    startTransition(async () => {
      const result = await updateUserName(formData);
      
      if (result.success) {
        setSuccess(true);
        setIsEditing(false);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || 'エラーが発生しました');
      }
    });
  };

  const handleCancel = () => {
    setName(user.name || '');
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className={cn("max-w-4xl mx-auto py-8 px-4", UI_CONSTANTS.colors.pageBg)}>
      {/* ページタイトル */}
      <div className="mb-8">
        <h1 className={cn(createTypographyClasses('xxl', 'bold', 'primary'), "mb-2")}>
          プロフィール
        </h1>
        <p className={createTypographyClasses('m', 'regular', 'muted')}>
          アカウント情報の確認と編集
        </p>
      </div>

      {/* アラート */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            プロフィールを更新しました
          </AlertDescription>
        </Alert>
      )}

      {/* プロフィールカード */}
      <Card className={createCardClasses('default')}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className={createTypographyClasses('xl', 'bold', 'primary')}>
              基本情報
            </CardTitle>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                size="sm"
                variant="outline"
                className={cn(createButtonClasses('primary', 'small'), "gap-2")}
              >
                <Edit2 className="h-4 w-4" />
                編集
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* アバター */}
            <div className="flex items-center gap-6">
              <div className="flex-shrink-0">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.name || 'User'}
                    width={80}
                    height={80}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-br from-[#00c4cc] to-[#0891b2] rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user.name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className={createTypographyClasses('xs', 'medium', 'muted')}>
                  プロフィール画像
                </div>
                <div className={createTypographyClasses('s', 'regular', 'secondary')}>
                  Googleアカウントから同期されます
                </div>
              </div>
            </div>

            <div className="border-t pt-6 space-y-4">
              {/* 名前 */}
              <div className="flex items-start gap-4">
                <UserIcon className={cn("h-5 w-5 mt-0.5", UI_CONSTANTS.colors.mutedText)} />
                <div className="flex-1">
                  <div className={cn("mb-1", createTypographyClasses('xs', 'medium', 'muted'))}>
                    表示名
                  </div>
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="名前を入力"
                        className="flex-1 max-w-sm"
                        disabled={isPending}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleSave}
                          size="sm"
                          disabled={isPending || !name.trim()}
                          className={cn(createButtonClasses('primary', 'small'), "gap-2")}
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          保存
                        </Button>
                        <Button
                          onClick={handleCancel}
                          size="sm"
                          variant="outline"
                          disabled={isPending}
                          className={cn(createButtonClasses('accent', 'small'), "gap-2")}
                        >
                          <X className="h-4 w-4" />
                          キャンセル
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className={createTypographyClasses('m', 'medium', 'primary')}>
                      {user.name || '未設定'}
                    </div>
                  )}
                </div>
              </div>

              {/* メールアドレス（編集不可） */}
              <div className="flex items-start gap-4">
                <Mail className={cn("h-5 w-5 mt-0.5", UI_CONSTANTS.colors.mutedText)} />
                <div className="flex-1">
                  <div className={cn("mb-1", createTypographyClasses('xs', 'medium', 'muted'))}>
                    メールアドレス
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={createTypographyClasses('m', 'medium', 'primary')}>
                      {user.email}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      認証済み
                    </Badge>
                  </div>
                  <div className={cn("mt-1", createTypographyClasses('xs', 'regular', 'secondary'))}>
                    メールアドレスは変更できません
                  </div>
                </div>
              </div>

              {/* 登録日 */}
              <div className="flex items-start gap-4">
                <Calendar className={cn("h-5 w-5 mt-0.5", UI_CONSTANTS.colors.mutedText)} />
                <div className="flex-1">
                  <div className={cn("mb-1", createTypographyClasses('xs', 'medium', 'muted'))}>
                    アカウント作成日
                  </div>
                  <div className={createTypographyClasses('m', 'medium', 'primary')}>
                    {new Date(user.createdAt).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* アカウント設定 */}
      <Card className={cn(createCardClasses('soft'), "mt-6")}>
        <CardHeader>
          <CardTitle className={createTypographyClasses('l', 'bold', 'primary')}>
            アカウント設定
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={createTypographyClasses('m', 'regular', 'muted')}>
              このアカウントはGoogle認証で管理されています。
              メールアドレスやアイコン画像の変更設定は、各認証プロバイダーで行ってください。
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
