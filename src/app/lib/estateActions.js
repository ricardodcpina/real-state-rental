'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const baseURL = `http://localhost:8000/houses`;

export async function createEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

  try {
    const data = await fetch(`${baseURL}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
      cache: 'no-cache',
    });

    const estate = await data.json();
    if (estate?.error) {
      return { error: estate.error };
    }
  } catch (error) {
    console.log('Could not create estate');
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

export async function fetchEstate(estate_id) {
  let estate = null;
  const token = cookies().get('user_token')?.value;

  try {
    const data = await fetch(`${baseURL}/${estate_id}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    estate = await data.json();
    if (estate?.error) {
      return { error: estate.error };
    }
  } catch (error) {
    console.log('Could not fetch estate');
  }

  return estate;
}

export async function fetchEstates(
  limit = 0,
  skip = 0,
  maxCost = 0,
  estateLocation = '',
  estateName = ''
) {
  let estates = [];
  const paginationQueryParams = `available=true&limit=${limit}&skip=${skip}`;
  const filterQueryParams = `maxCost=${maxCost}&estateLocation=${estateLocation}&estateName=${estateName}`;

  try {
    const data = await fetch(`${baseURL}?${paginationQueryParams}&${filterQueryParams}`, {
      method: 'GET',
    });

    estates = await data.json();
    if (estates?.error) {
      return [];
    }
  } catch (err) {
    console.log('Could not fetch estates');
  }

  revalidatePath(`/`);

  return estates;
}

export async function updateEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id')?.value;

  if (!token) redirect('/login');

  const estate_id = formData.get('estate-id');

  try {
    const data = await fetch(`${baseURL}/${estate_id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
      cache: 'no-cache',
    });

    const estate = await data.json();
    if (estate?.error) {
      return { error: estate.error };
    }
  } catch (error) {
    console.log('Could not update estate');
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteEstate(estate_id) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id').value;

  if (!token) redirect('/login');

  try {
    const data = await fetch(`${baseURL}/${estate_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    const estate = await data.json();
    if (estate?.error) {
      return { error: estate.error };
    }
  } catch (error) {
    console.log('Could not delete estate');
  }

  revalidatePath(`/dashboard/${user_id}`);
}
