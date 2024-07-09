import Paginator from './Paginator';
import HouseCard from './HouseCard';
import { fetchEstates } from '@/app/lib/estateActions';

export default async function Container({ currentPage, maxCost, estateLocation, estateName }) {
  const pageLimit = 10;

  const skipPages = (currentPage - 1) * pageLimit || 0;
  const estates = await fetchEstates(pageLimit, skipPages, maxCost, estateLocation, estateName);

  const allEstates = await fetchEstates(0, 0, maxCost, estateLocation, estateName);
  const totalPages = Math.ceil(allEstates?.length / pageLimit) || 1;

  const blankCards =
    (estates?.length > 0 && Array(pageLimit - estates?.length).fill(null)) ||
    Array(pageLimit).fill(null);

  return (
    <div
      id='catalog-container'
      className='w-[90%] ml-16 my-8 px-8 py-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg'
    >
      <div className='ml-4 flex justify-start items-center font-bold text-slate-950'>
        <h1 className='text-2xl'>Catalog</h1>
      </div>
      <div className='grid grid-cols-5 grid-rows-2 mb-4'>
        {estates &&
          estates.map((estate) => (
            <HouseCard
              key={estate._id}
              name={estate.description}
              src={`/images/${estate.thumbnail}`}
              estate_id={estate._id}
              estate_price={estate.price}
            />
          ))}
        {blankCards.length > 0 && blankCards.map((_, index) => <HouseCard key={index} />)}
      </div>
      <Paginator totalPages={totalPages} />
    </div>
  );
}
