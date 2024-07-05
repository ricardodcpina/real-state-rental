'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function fetchMyEstates(limit = 0, skip = 0) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  const data = await fetch(`http://localhost:8000/dashboard/houses?limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const myEstates = await data.json();

  if (myEstates?.error) {
    console.log('Cant load houses');
    return;
  }

  revalidatePath(`/dashboard/${user_id}`);

  return myEstates;
}

export async function fetchMyReserves(limit = 0, skip = 0) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  const data = await fetch(`http://localhost:8000/dashboard/reserves?limit=${limit}&skip=${skip}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const myReserves = await data.json();

  if (myReserves?.error) {
    console.log('Cant load reserves');
    return;
  }

  revalidatePath(`/dashboard/${user_id}`);

  return myReserves;
}
