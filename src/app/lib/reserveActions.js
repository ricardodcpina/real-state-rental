'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const baseURL = 'http://localhost:8000/houses';

export async function reserveEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

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
  }

  revalidatePath('/');
  redirect(`/dashboard/${user_id}`);
}

export async function cancelReserve(prevState, reserve_id) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

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
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}
