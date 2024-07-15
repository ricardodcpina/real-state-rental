'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getSession } from './sessionActions';
import { serverError } from '../../../backend/src/errors';

const baseURL = `http://localhost:8000/houses`;

export async function createEstate(pathname, prevState, formData) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login?${callbackUrl}`);

  const token = cookies().get('session')?.value;

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
    return { error: serverError.message };
  }

  revalidatePath(`/dashboard/${session?.sub}`);
  redirect(`/dashboard/${session?.sub}`);
}

export async function fetchEstate(estate_id) {
  let estate = null;

  try {
    const data = await fetch(`${baseURL}/${estate_id}`, {
      method: 'GET',
    });

    estate = await data.json();
    if (estate?.error) {
      return { error: estate.error };
    }
  } catch (error) {
    console.log('Could not fetch estate');
    return { error: serverError.message };
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
    return [];
  }

  revalidatePath(`/`);

  return estates;
}

export async function updateEstate(pathname, prevState, formData) {
  const callbackUrl = `callbackUrl=${pathname}`;

  const session = await getSession();
  if (!session) redirect(`/login?${callbackUrl}`);

  const token = cookies().get('session')?.value;

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
    return { error: serverError.message };
  }

  revalidatePath(`/dashboard/${session?.sub}`);
  redirect(`/dashboard/${session?.sub}`);
}

export async function deleteEstate(estate_id) {
  const session = await getSession();
  if (!session) redirect('/login');

  const token = cookies().get('session')?.value;

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
    return { error: serverError.message };
  }

  revalidatePath(`/dashboard/${session?.sub}`);
}
