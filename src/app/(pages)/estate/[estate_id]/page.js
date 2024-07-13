import { notFound } from 'next/navigation';
import { fetchEstate } from '@/app/lib/estateActions';
import { getSession } from '@/app/lib/sessionActions';

import ReserveEstateForm from '@/app/components/ReserveEstateForm';

export default async function EstatePage({ params }) {
  const { estate_id } = params;

  const session = await getSession();
  const estate = await fetchEstate(estate_id);

  if (estate?.error) {
    notFound();
  }

  return <ReserveEstateForm estate={estate} user_id={session?.sub} />;
}
