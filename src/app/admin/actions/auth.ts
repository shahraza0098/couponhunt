'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const password = formData.get('password');
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    
    redirect('/admin');
    // redirect throws an error that Next.js catches, so we don't return here.
  } else {
    return { error: 'Invalid password' };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.set('admin_session', '', {
    path: '/admin',
    maxAge: 0,
  });
  redirect('/admin/login');
}
