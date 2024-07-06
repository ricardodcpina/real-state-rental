'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/dist/server/api-utils';

export async function fetchMyEstates(limit = 0, skip = 0) {
  const token = cookies().get('user_token')?.value;

  if (!token) redirect('/login');

  const user_id = cookies().get('user_id')?.value;

  const data = await fetch(`http://localhost:8000/dashboard/houses?limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const myEstates = await data.json();

  revalidatePath(`/dashboard/${user_id}`);

  return myEstates;
}

export async function fetchMyReserves(limit = 0, skip = 0) {
  const token = cookies().get('user_token')?.value;
  if (!token) redirect('/login');

  const user_id = cookies().get('user_id')?.value;

  const data = await fetch(`http://localhost:8000/dashboard/reserves?limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const myReserves = await data.json();

  revalidatePath(`/dashboard/${user_id}`);

  return myReserves;
}
