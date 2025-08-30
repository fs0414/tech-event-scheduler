import { redirect } from 'next/navigation';
import { getCurrentUserWithAutoCreate } from '@/lib/auth-helpers';
import ProfileClient from '@/components/profile-client';

export default async function ProfilePage() {
  try {
    // 認証ユーザー取得
    const dbUser = await getCurrentUserWithAutoCreate();
    
    return <ProfileClient user={dbUser} />;
  } catch (error) {
    console.error('Profile page error:', error);
    redirect('/auth/login');
  }
}