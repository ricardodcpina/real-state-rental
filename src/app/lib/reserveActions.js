'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from './sessionActions';
import { serverError } from '../../../backend/src/errors';

const baseURL = 'http://localhost:8000/houses';

export async function reserveEstate(pathname, prevState, formData) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login/?${callbackUrl}`);

  const token = cookies().get('session')?.value;

  const estate_id = formData.get('estate-id');

  try {
    const data = await fetch(`${baseURL}/${estate_id}/reserves`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: formData.get('date'),
      }),
      cache: 'no-store',
    });

    const reserve = await data.json();
    if (reserve?.error) {
      return { error: reserve.error };
    }
  } catch (error) {
    console.log('Could not create reserve');
    return { error: serverError.message };
  }

  revalidatePath('/');
  redirect(`/dashboard/${session?.sub}`);
}

export async function cancelReserve(pathname, reserve_id, prevState) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login/?${callbackUrl}`);

  const token = cookies().get('session')?.value;

  try {
    const data = await fetch(`${baseURL}/reserves/${reserve_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const reserve = await data.json();
    if (reserve?.error) {
      return { error: reserve.error };
    }
  } catch (error) {
    console.log('Could not cancel reserve');
    return { error: serverError.message };
  }

  revalidatePath(`/dashboard/${session?.sub}`);
  redirect(`/dashboard/${session?.sub}`);
}
