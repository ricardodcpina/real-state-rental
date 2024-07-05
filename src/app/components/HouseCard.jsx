'use client';

import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { usePathname } from 'next/navigation';
import { deleteEstate } from '../lib/actions';
import Link from 'next/link';
import Image from 'next/image';

export default function HouseCard({
  src,
  name,
  estate_id,
  user_id,
  reserve_date,
  reserve_id,
  estate_price,
}) {
  const path = usePathname();

  return (
    <div
      className='h-[200px] w-[200px] m-4 shadow-lg overflow-hidden
                hover:outline hover:outline-yellow-600 cursor-pointer transition-all rounded-xl'
    >
      <Link
        href={
          (reserve_id && `/estate/${estate_id}/reserve/${reserve_id}`) ||
          (estate_id && `/estate/${estate_id}`) ||
          ''
        }
      >
        <div className='relative h-3/4'>
          {src && <Image src={src} fill sizes='200px' priority={true} alt='Estate picture' />}
        </div>
      </Link>
      <div className='flex justify-between items-center mr-4 my-4'>
        <h1 className='text-black ml-4'>{name}</h1>
        {!reserve_date && path === `/dashboard/${user_id}` ? (
          <div className='flex justify-center items-center'>
            <Link href={`/dashboard/${user_id}/edit-estate/${estate_id}`}>
              <PencilSquareIcon
                className='h-6 w-6 mx-2 rounded-md border-2 
                                bg-yellow-700  hover:bg-yellow-600  border-gray-700 text-zinc-100 transition-colors duration-500'
              />
            </Link>
            <button onClick={() => deleteEstate(estate_id)}>
              <TrashIcon
                className='h-6 w-6 rounded-md border-2 text-zinc-100 
                                 bg-red-900 hover:bg-red-700  border-gray-700 transition-colors duration-500'
              />
            </button>
          </div>
        ) : (
          reserve_date && (
            <span className='text-md text-green-700 font-semibold'>{reserve_date}</span>
          )
        )}
        {estate_price && path === '/' && (
          <span className='text-md text-yellow-600 font-semibold'>${estate_price}/day</span>
        )}
      </div>
    </div>
  );
}
