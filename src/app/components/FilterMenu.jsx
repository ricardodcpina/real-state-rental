'use client';

import { MagnifyingGlassCircleIcon } from '@heroicons/react/24/outline';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function FilterMenu() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);

  function applyFilters() {
    const newSearchParams = new URLSearchParams(searchParams);

    name ? newSearchParams.set('name', name) : newSearchParams.delete('name');
    price ? newSearchParams.set('maxCost', price) : newSearchParams.delete('maxCost');
    location ? newSearchParams.set('location', location) : newSearchParams.delete('location');

    newSearchParams.set('catalogPage', 1);
    newSearchParams.delete('reservePage');
    newSearchParams.delete('estatePage');

    router.push(`/?${newSearchParams.toString()}`, { scroll: false });
  }

  return (
    <aside
      id='filter-menu'
      className='w-[20%] flex flex-col p-4 border-r-2 border-zinc-700 bg-gradient-to-r from-black'
    >
      <h1 className='pb-4 text-xl'>CATALOG FILTERS</h1>

      <div className='flex flex-col'>
        <label htmlFor='estate-name'>Estate Name</label>
        <input
          id='estate-name'
          name='estate-name'
          type='text'
          className='mb-2 p-1 rounded-md text-slate-950 font-bold'
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor='location'>Estate Location</label>
        <input
          id='location'
          name='location'
          type='select'
          className='mb-2 p-1 rounded-md text-slate-950 font-bold'
          onChange={(e) => setLocation(e.target.value)}
        />

        <label htmlFor='price'>Maximum Cost per Day</label>
        <input
          id='price'
          name='price'
          type='number'
          className='mb-2 p-1 rounded-md text-slate-950 font-bold'
          onChange={(e) => setPrice(e.target.value)}
        />

        <div className='flex justify-center font-bold text-slate-950'>
          <button
            type='button'
            className='flex items-center bg-slate-600 hover:bg-slate-400 mt-5 w-36 rounded-md'
            onClick={applyFilters}
          >
            <MagnifyingGlassCircleIcon className='h-7 w-7 mr-5 text-yellow-700 bg-black rounded-md border-2 border-gray-700' />
            Search
          </button>
        </div>
      </div>
    </aside>
  );
}
