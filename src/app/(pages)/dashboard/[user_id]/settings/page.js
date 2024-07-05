import UpdateUserForm from '@/app/components/UpdateUserForm';
import { fetchUser } from '@/app/lib/userActions';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { user_id } = params;
  const loggedUserId = cookies().get('user_id')?.value;

  if (user_id !== loggedUserId) {
    notFound();
  }

  const user = await fetchUser(user_id);

  return <UpdateUserForm user={user} />;
}
