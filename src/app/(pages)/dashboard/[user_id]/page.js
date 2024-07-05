import CarouselContainer from '@/app/components/CarouselContainer';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

export default async function DashboardPage({ params, searchParams }) {
  const user_id = params.user_id;
  const loggedUserId = cookies().get('user_id')?.value;

  if (user_id !== loggedUserId) {
    notFound();
  }

  const currentEstatesPage = parseInt(searchParams.estatePage);
  const currentReservesPage = parseInt(searchParams.reservePage);

  return (
    <div className='flex flex-col w-[80%]'>
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
