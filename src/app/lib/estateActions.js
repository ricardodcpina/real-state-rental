'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user_id = formData.get('user-id');

  const data = await fetch('http://localhost:8000/houses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: 'no-cache',
  });

  const estate = await data.json();

  if (estate?.error) {
    return { error: estate?.error };
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

export async function fetchEstate(estate_id) {
  const token = cookies().get('user_token')?.value;

  const data = await fetch(`http://localhost:8000/houses/${estate_id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const estate = await data.json();
  return estate;
}

export async function fetchEstates(
  limit = 0,
  skip = 0,
  maxCost = 0,
  estateLocation = '',
  estateName = ''
) {
  const data = await fetch(
    `http://localhost:8000/houses?available=true&limit=${limit}&skip=${skip}&maxCost=${maxCost}&estateLocation=${estateLocation}&estateName=${estateName}`,
    {
      method: 'GET',
    }
  );

  const estates = await data.json();
  revalidatePath(`/`);

  return estates;
}

export async function updateEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;

  if (!token) redirect('/login');

  const user_id = formData.get('user-id');
  const estate_id = formData.get('estate-id');

  const data = await fetch(`http://localhost:8000/houses/${estate_id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: 'no-cache',
  });

  const estate = await data.json();
  if (estate?.error) {
    return { error: estate.error };
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteEstate(houseId) {
  const token = cookies().get('user_token')?.value;
  if (!token) redirect('/login');

  const user_id = cookies().get('user_id').value;

  const data = await fetch(`http://localhost:8000/houses/${houseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const estate = await data.json();

  revalidatePath(`/dashboard/${user_id}`);
}
