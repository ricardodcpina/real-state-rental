import { fetchEstate } from '@/app/lib/estateActions';
import { cookies } from 'next/headers';
import ReserveEstateForm from '@/app/components/ReserveEstateForm';
import { notFound } from 'next/navigation';

export default async function ReservePage({ params }) {
  const { estate_id, reserve_id } = params;
  const loggedUserId = cookies().get('user_id')?.value;
  const estate = await fetchEstate(estate_id);

  if (estate?.reserve?._id !== reserve_id) {
    notFound();
  }

  return <ReserveEstateForm estate={estate} user_id={loggedUserId} reserve_id={reserve_id} />;
}
