import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { fetchEstate } from '@/app/lib/estateActions';

import ReserveEstateForm from '@/app/components/ReserveEstateForm';

export default async function EstatePage({ params }) {
  const { estate_id } = params;
  const loggedUserId = cookies().get('user_id')?.value;
  const estate = await fetchEstate(estate_id);

  if (estate?.error) {
    notFound();
  }

  return <ReserveEstateForm estate={estate} user_id={loggedUserId} />;
}
