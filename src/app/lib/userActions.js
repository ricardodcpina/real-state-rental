'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from './sessionActions';
import { serverError } from '../../../backend/src/errors';

const baseURL = `http://localhost:8000/users`;

export async function loginUser(callbackURL, prevState, formData) {
  try {
    const data = await fetch(`${baseURL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      }),
      cache: 'no-store',
    });

    const credentials = await data.json();
    if (credentials?.error) {
      return { error: credentials.error };
    }

    const timeLapse = 1000 * 60;
    const cookieConfig = { expires: Date.now() + timeLapse, path: '/', httpOnly: true };

    cookies().set('session', credentials?.token, cookieConfig);
  } catch (error) {
    console.log('Could not login');
    return { error: serverError.message };
  }

  const session = await getSession();

  if (callbackURL) redirect(callbackURL);

  redirect(`/dashboard/${session?.sub}`);
}

export async function createUser(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (confirmPassword !== password) {
    return { error: 'Password confirmation does not match!' };
  }

  try {
    const data = await fetch(`${baseURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });

    const user = await data.json();
    if (user?.error) {
      return { error: user.error };
    }
  } catch (error) {
    console.log('Could not create user');
    return { error: serverError.message };
  }

  await loginUser(null, null, formData);
}

export async function fetchUser(user_id) {
  let user = null;
  const token = cookies().get('session')?.value;

  try {
    const data = await fetch(`${baseURL}/${user_id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    user = await data.json();
    if (user?.error) {
      return null;
    }
  } catch (error) {
    console.log('Could not fetch user');
    return null;
  }

  return user;
}

export async function updateUser(pathname, prevState, formData) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login/?${callbackUrl}`);

  const token = cookies().get('session')?.value;

  const username = formData.get('username');
  const newPassword = formData.get('password');
  const confirmNewPassword = formData.get('confirm-password');
  const body = { username };

  if (confirmNewPassword !== newPassword) {
    return { error: 'Password confirmation does not match!' };
  }

  if (newPassword) {
    body.password = newPassword;
  }

  try {
    const data = await fetch(`${baseURL}/${session?.sub}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-cache',
    });

    const user = await data.json();
    if (user?.error) {
      return { error: user.error };
    }
  } catch (error) {
    console.log('Could not update user');
    return { error: serverError.message };
  }

  revalidatePath(`/dashboard/${session?.sub}/settings`);
  redirect(`/dashboard/${session?.sub}`);
}

export async function deleteUser(pathname, prevState) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login/?${callbackUrl}`);

  const token = cookies().get('session')?.value;

  try {
    const data = await fetch(`${baseURL}/${session?.sub}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await data.json();
    if (user?.error) {
      return { error: user.error };
    }
  } catch (error) {
    console.log('Could not delete user');
    return { error: serverError.message };
  }

  await logoutUser();
}

export async function logoutUser() {
  cookies().delete('session');
  redirect('/');
}
