'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const baseURL = `http://localhost:8000/dashboard`;

export async function fetchMyEstates(limit = 0, skip = 0) {
  let myEstates = [];
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

  const paginationQueryParams = `limit=${limit}&skip=${skip}`;

  try {
    const data = await fetch(`${baseURL}/houses?${paginationQueryParams}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    myEstates = await data.json();

    if (myEstates.error) {
      return null;
    }
  } catch (error) {
    console.log('Could not fetch owned estates');
  }

  revalidatePath(`/dashboard/${user_id}`);

  return myEstates;
}

export async function fetchMyReserves(limit = 0, skip = 0) {
  let myReserves = [];
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

  const paginationQueryParams = `limit=${limit}&skip=${skip}`;

  try {
    const data = await fetch(`${baseURL}/reserves?${paginationQueryParams}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    myReserves = await data.json();
    if (myReserves.error) {
      return null;
    }
  } catch (error) {
    console.log('Could not fetch own reserves');
  }

  revalidatePath(`/dashboard/${user_id}`);

  return myReserves;
}
