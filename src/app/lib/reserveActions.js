'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function reserveEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;
  const user_id = formData.get('user-id');
  const estate_id = formData.get('estate-id');

  const data = await fetch(`http://localhost:8000/houses/${estate_id}/reserves`, {
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
  if (reserve?.error === 'Invalid credentials') {
    redirect('/login');
  } else if (reserve?.error) {
    return { error: reserve.error };
  }

  revalidatePath('/');
  redirect(`/dashboard/${user_id}`);
}

export async function cancelReserve(reserve_id) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  const data = await fetch(`http://localhost:8000/houses/reserves/${reserve_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const reserve = await data.json();

  if (reserve?.error === 'Invalid credentials') {
    redirect('/login');
  } else if (reserve?.error) {
    return { error: reserve.error };
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}
