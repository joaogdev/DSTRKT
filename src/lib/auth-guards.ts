import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './auth';

export async function requireSession(callbackUrl: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  return session;
}

export async function requireAdminSession(callbackUrl = '/admin') {
  const session = await requireSession(callbackUrl);

  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return session;
}
