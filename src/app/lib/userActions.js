'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const baseURL = `http://localhost:8000/users`;

export async function loginUser(prevState, formData) {
  let credentials = null;

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

    credentials = await data.json();
    if (credentials?.error) {
      return { error: credentials.error };
    }

    const timeLapse = 1000 * 30;
    const expirationConfig = { expires: Date.now() + timeLapse, path: '/' };

    cookies().set('user_token', credentials.token, expirationConfig);
    cookies().set('user_id', credentials.userId, expirationConfig);
  } catch (error) {
    console.log('Could not login');
  }

  redirect(`/dashboard/${credentials?.userId}`);
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

    await loginUser(null, formData);
  } catch (error) {
    console.log('Could not create user');
  }
}

export async function fetchUser(user_id) {
  let user = null;
  const token = cookies().get('user_token')?.value;

  if (!token) redirect('/login');

  try {
    const data = await fetch(`${baseURL}/${user_id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    user = await data.json();
    if (user?.error) {
      return { error: user.error };
    }
  } catch (error) {
    console.log('Could not fetch user');
  }

  return user;
}

export async function updateUser(prevState, formData) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

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
    const data = await fetch(`${baseURL}/${user_id}`, {
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
  }

  revalidatePath(`/dashboard/${user_id}/settings`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteUser(prevState) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

  try {
    const data = await fetch(`${baseURL}/${user_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await data.json();
    if (user?.error) {
      return { error: user.error };
    }
  } catch (error) {
    console.log('Could not delete user');
  }

  await logoutUser();
}

export async function logoutUser() {
  cookies().delete('user_id');
  cookies().delete('user_token');
  redirect('/');
}
