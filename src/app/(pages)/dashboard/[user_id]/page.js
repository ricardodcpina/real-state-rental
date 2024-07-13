import CarouselContainer from '@/app/components/CarouselContainer';
import { getSession } from '@/app/lib/sessionActions';
import { notFound } from 'next/navigation';

export default async function DashboardPage({ params, searchParams }) {
  const user_id = params.user_id;

  const session = await getSession();

  if (user_id !== session?.sub) {
    notFound();
  }

  const currentEstatesPage = parseInt(searchParams.estatePage);
  const currentReservesPage = parseInt(searchParams.reservePage);

  return (
    <div className='flex flex-col w-[80%] py-8 gap-6'>
      <CarouselContainer
        user_id={user_id}
        description='My Estates'
        currentPage={currentEstatesPage}
      />
      <CarouselContainer
        user_id={user_id}
        description='My Reserves'
        currentPage={currentReservesPage}
      />
    </div>
  );
}
