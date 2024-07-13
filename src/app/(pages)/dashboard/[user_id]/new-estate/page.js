import CreateEstateForm from '@/app/components/CreateEstateForm';
import { getSession } from '@/app/lib/sessionActions';
import { notFound } from 'next/navigation';

export default async function NewEstatePage({ params }) {
  const { user_id } = params;

  const session = await getSession();

  if (user_id !== session?.sub) {
    notFound();
  }

  return <CreateEstateForm />;
}
