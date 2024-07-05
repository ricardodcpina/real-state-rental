'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function loginUser(prevState, formData) {
  const data = await fetch('http://localhost:8000/users/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password'),
    }),
    cache: 'no-store',
  });

  const credentials = await data.json();
  if (credentials.error) {
    return { message: credentials.error };
  }

  const timeLapse = 1000 * 180;
  cookies().set('user_token', credentials.token, { expires: Date.now() + timeLapse, path: '/' });
  cookies().set('user_id', credentials.userId, { expires: Date.now() + timeLapse, path: '/' });
  redirect(`/dashboard/${credentials.userId}`);
}

export async function createUser(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (confirmPassword !== password) {
    return { message: 'Password confirmation does not match!' };
  }

  const data = await fetch('http://localhost:8000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const user = await data.json();
  if (user.error) {
    return { message: user.error };
  }

  await loginUser(null, formData);
}

export async function fetchUser(user_id) {
  const token = cookies().get('user_token')?.value;

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await data.json();
  if (user?.error) {
    return { error: user.error };
  }

  return user;
}

export async function updateUser(prevState, formData) {
  const token = cookies().get('user_token')?.value;

  const user_id = formData.get('user-id');
  const username = formData.get('username');
  const newPassword = formData.get('password');
  const confirmNewPassword = formData.get('confirm-password');

  if (confirmNewPassword !== newPassword) {
    return { message: 'Password confirmation does not match!' };
  }

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password: newPassword,
    }),
    cache: 'no-cache', // or no-store?
  });

  const user = await data.json();
  if (user?.error) {
    return { message: user.error };
  }

  revalidatePath(`/dashboard/${user_id}/settings`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteUser(user_id) {
  const token = cookies().get('user_token')?.value;

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await data.json();
  if (user?.error) {
    return { message: user.error };
  }

  await logoutUser();
}

export async function logoutUser() {
  cookies().delete('user_id');
  cookies().delete('user_token');
  redirect('/');
}
