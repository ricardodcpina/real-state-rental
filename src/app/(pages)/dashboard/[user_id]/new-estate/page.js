import CreateEstateForm from '@/app/components/CreateEstateForm';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function NewEstatePage({ params }) {
  const { user_id } = params;
  const loggedUserId = cookies().get('user_id')?.value;

  if (user_id !== loggedUserId) {
    notFound();
  }

  return <CreateEstateForm user_id={user_id} />;
}
