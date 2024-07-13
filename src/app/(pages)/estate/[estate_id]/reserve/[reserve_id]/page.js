import { notFound } from 'next/navigation';
import ReserveEstateForm from '@/app/components/ReserveEstateForm';
import { fetchEstate } from '@/app/lib/estateActions';
import { getSession } from '@/app/lib/sessionActions';

export default async function ReservePage({ params }) {
  const { estate_id, reserve_id } = params;

  const session = await getSession();

  const estate = await fetchEstate(estate_id);

  if (estate?.reserve?._id !== reserve_id || estate?.reserve?.user !== session?.sub) {
    notFound();
  }

  return <ReserveEstateForm estate={estate} user_id={session?.sub} reserve_id={reserve_id} />;
}
