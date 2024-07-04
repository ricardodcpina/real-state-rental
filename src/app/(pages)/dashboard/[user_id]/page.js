import CarouselContainer from '@/app/components/CarouselContainer';
import { cookies } from 'next/headers';

export default function Page({ searchParams }) {
  const user_id = cookies().get('user_id')?.value;

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
