'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// USERS

export async function loginUser(prevState, formData) {
  const data = await fetch('http://localhost:8000/users/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: formData.get('username'),
      password: formData.get('password'),
    }),
    cache: 'no-store',
  });

  const credentials = await data.json();
  if (credentials.error) {
    return { message: credentials.error };
  }

  const timeLapse = 1000 * 180;
  cookies().set('user_token', credentials.token, { expires: Date.now() + timeLapse, path: '/' });
  cookies().set('user_id', credentials.userId, { expires: Date.now() + timeLapse, path: '/' });
  redirect(`/dashboard/${credentials.userId}`);
}

export async function createUser(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirm-password');

  if (confirmPassword !== password) {
    return { message: 'Password confirmation does not match!' };
  }

  const data = await fetch('http://localhost:8000/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  const user = await data.json();
  if (user.error) {
    return { message: user.error };
  }

  await loginUser(null, formData);
}

export async function fetchUser(user_id) {
  const token = cookies().get('user_token')?.value;

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await data.json();
  if (user?.error) {
    return { message: user.error };
  }

  return user;
}

export async function updateUser(prevState, formData) {
  const token = cookies().get('user_token')?.value;

  const user_id = formData.get('user-id');
  const username = formData.get('username');
  const newPassword = formData.get('password');
  const confirmNewPassword = formData.get('confirm-password');

  if (confirmNewPassword !== newPassword) {
    return { message: 'Password confirmation does not match!' };
  }

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password: newPassword,
    }),
    cache: 'no-cache', // or no-store?
  });

  const user = await data.json();
  if (user?.error) {
    return { message: user.error };
  }

  revalidatePath(`/dashboard/${user_id}/settings`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteUser(user_id) {
  const token = cookies().get('user_token')?.value;

  const data = await fetch(`http://localhost:8000/users/${user_id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  const user = await data.json();
  if (user?.error) {
    return { message: user.error };
  }

  await logoutUser();
}

export async function logoutUser() {
  cookies().delete('user_id');
  cookies().delete('user_token');
  redirect('/');
}

// ESTATES

export async function createEstate(prevState, formData) {
  const token = cookies().get('user_token')?.value;

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
  if (estate.error) {
    return { message: estate.error };
  }

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
  const user_id = formData.get('user-id');
  const estate_id = formData.get('estate-id');

  const data = await fetch(`http://localhost:8000/houses/${estate_id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
    cache: 'no-cache',
  });

  const estate = await data.json();
  if (estate.error) {
    return { message: estate.error };
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

export async function deleteEstate(houseId) {
  const token = cookies().get('user_token')?.value;
  const user_id = cookies().get('user_id').value;

  await fetch(`http://localhost:8000/houses/${houseId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  revalidatePath(`/dashboard/${user_id}`);
}

// RESERVES

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
  if (reserve.error) {
    return { message: reserve.error };
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

  if (reserve?.error) {
    console.log('Could not cancel reserve');
    return;
  }

  revalidatePath(`/dashboard/${user_id}`);
  redirect(`/dashboard/${user_id}`);
}

// DASHBOARD

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
