import UpdateUserForm from '@/app/components/UpdateUserForm';
import { getSession } from '@/app/lib/sessionActions';
import { fetchUser } from '@/app/lib/userActions';
import { notFound } from 'next/navigation';

export default async function Page({ params }) {
  const { user_id } = params;

  const session = await getSession();

  if (user_id !== session?.sub) {
    notFound();
  }

  const user = await fetchUser(user_id);

  return <UpdateUserForm user={user} />;
}
