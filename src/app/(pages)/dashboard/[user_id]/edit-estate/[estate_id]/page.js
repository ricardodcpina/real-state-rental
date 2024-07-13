import UpdateEstateForm from '@/app/components/UpdateEstateForm';
import { fetchEstate } from '@/app/lib/estateActions';
import { getSession } from '@/app/lib/sessionActions';
import { notFound } from 'next/navigation';

export default async function EditStatePage({ params }) {
  const { estate_id, user_id } = params;

  const session = await getSession();

  if (session?.sub !== user_id) {
    notFound();
  }

  const estate = await fetchEstate(estate_id);

  return <UpdateEstateForm estate={estate} />;
}
