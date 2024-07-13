'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from './sessionActions';

const baseURL = `http://localhost:8000/dashboard`;

export async function fetchMyEstates(limit = 0, skip = 0) {
  let myEstates = [];

  const session = await getSession();
  if (!session) redirect('/login');

  const token = cookies().get('session')?.value;
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

  revalidatePath(`/dashboard/${session?.sub}`);

  return myEstates;
}

export async function fetchMyReserves(limit = 0, skip = 0) {
  let myReserves = [];

  const session = await getSession();
  if (!session) redirect('/login');

  const token = cookies().get('session')?.value;
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

  revalidatePath(`/dashboard/${session?.sub}`);

  return myReserves;
}
