import UpdateEstateForm from '@/app/components/UpdateEstateForm';
import { fetchEstate } from '@/app/lib/actions';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function EditStatePage({ params }) {
  const { estate_id, user_id } = params;
  const estate = await fetchEstate(estate_id);

  if (estate.user !== user_id) {
    notFound();
  }

  return <UpdateEstateForm estate={estate} />;
}
