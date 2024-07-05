import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { fetchMyEstates, fetchMyReserves } from '../lib/actions';
import HouseCard from './HouseCard';
import Link from 'next/link';
import Paginator from './Paginator';

export default async function CarouselContainer({ user_id, description, currentPage }) {
  let estates = null;
  let reserves = null;
  let totalEntries = 0;

  const pageLimit = 5;
  const skipPages = (currentPage - 1) * pageLimit || 0;

  if (description === 'My Estates') {
    totalEntries = (await fetchMyEstates()).length;
    estates = await fetchMyEstates(pageLimit, skipPages);
  } else {
    totalEntries = (await fetchMyReserves()).length;
    reserves = await fetchMyReserves(pageLimit, skipPages);
  }

  const totalPages = Math.ceil(totalEntries / pageLimit);

  const blankCards =
    (estates?.length > 0 && Array(pageLimit - estates?.length).fill(null)) ||
    (reserves?.length > 0 && Array(pageLimit - reserves?.length).fill(null)) ||
    Array(pageLimit).fill(null);

  return (
    <div className='w-[90%] ml-16 my-8 px-8 py-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg'>
      <div className='flex justify-between items-center font-bold text-slate-950'>
        <h1 className='ml-4 text-2xl'>{description}</h1>
        {description === 'My Estates' && (
          <Link href={`/dashboard/${user_id}/new-estate`}>
            <button className='flex mr-4 pr-2 bg-slate-500 hover:bg-slate-400 rounded-md transition-colors duration-500'>
              <PlusCircleIcon className='h-7 w-7 mr-2 text-yellow-700 bg-black rounded-md border-2 border-gray-700' />
              New Entry
            </button>
          </Link>
        )}
      </div>
      <div className='flex mt-1 justify-between items-center'>
        {description === 'My Estates'
          ? estates &&
            estates.map((estate) => (
              <HouseCard
                key={estate._id}
                src={`/images/${estate.thumbnail}`}
                name={estate.description}
                estate_id={estate._id}
                user_id={user_id}
              />
            ))
          : reserves &&
            reserves.map((reserve) => (
              <HouseCard
                key={reserve._id}
                src={`/images/${reserve.house.thumbnail}`}
                name={reserve.house.description}
                reserve_date={reserve.date}
                estate_id={reserve.house._id}
                user_id={user_id}
                reserve_id={reserve._id}
              />
            ))}
        {blankCards.length > 0 && blankCards.map((_, index) => <HouseCard key={index} />)}
      </div>
      <Paginator
        totalPages={totalPages}
        type={description === 'My Estates' ? 'estate' : 'reserve'}
      />
    </div>
  );
}
