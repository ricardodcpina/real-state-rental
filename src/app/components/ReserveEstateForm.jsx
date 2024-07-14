'use client';

import Image from 'next/image';
import { useFormState } from 'react-dom';
import { cancelReserve, reserveEstate } from '@/app/lib/reserveActions';
import { usePathname } from 'next/navigation';

export default function ReserveEstateForm({ estate, user_id, reserve_id }) {
  const pathname = usePathname();

  const initialState = {
    error: null,
  };

  const cancelReserveWithIdAndPathname = cancelReserve.bind(null, pathname, reserve_id);
  const reserveEstateWithPathname = reserveEstate.bind(null, pathname);

  const [reserveEstateState, reserveEstateAction] = useFormState(
    reserveEstateWithPathname,
    initialState
  );
  const [cancelReserveState, cancelReserveAction] = useFormState(
    cancelReserveWithIdAndPathname,
    initialState
  );

  return (
    <div className='w-2/6 h-2/3 container m-16 p-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg text-slate-950 font-bold'>
      <div className='flex flex-col justify-center items-center '>
        <h1 className='mb-5  text-3xl'>{estate.description}</h1>
        <Image
          src={`/images/${estate.thumbnail}`}
          width={500}
          height={300}
          alt='Picture of estate'
        />
      </div>
      <div className='mt-8 text-lg'>
        <h3>Estate Name: {`${estate.description}`}</h3>
        <h3>Location: {`${estate.location}`}</h3>
        <h3>Price: {`${estate.price}`} USD per day</h3>
        <p className='mt-3 text-sm'>
          Welcome to your ideal retreat – a stunning and meticulously designed home available for
          rental, perfectly marrying luxury with comfort. Nestled in a serene neighborhood, this
          exquisite property is a haven of tranquility, offering a seamless blend of modern elegance
          and timeless charm.
        </p>
      </div>
      <div>
        {reserve_id ? (
          <form action={cancelReserveAction}>
            <div className='flex flex-col pt-3 items-center'>
              <h3 className='text-lg text-green-700 font-bold'>
                Reservation Date: {estate?.reserve?.date}
              </h3>
              <button className='mt-3 mb-2 p-3 w-full bg-slate-500 hover:bg-red-800 cursor-pointer rounded-md transition-colors duration-500'>
                Cancel reserve
              </button>
            </div>
            {cancelReserveState?.error && (
              <h1 className='text-red-600 mb-3'>{cancelReserveState.error}</h1>
            )}
          </form>
        ) : (
          user_id &&
          user_id !== estate.user && (
            <form action={reserveEstateAction}>
              <div className='flex pt-3 justify-center'>
                <label htmlFor='reserve-date' className='text-lg font-bold'>
                  Date of Reserve:
                </label>
                <input
                  name='date'
                  id='reserve-date'
                  type='date'
                  className='rounded-md text-center ml-3'
                  required
                />

                <input id='estate-id' name='estate-id' type='hidden' value={estate._id} />
              </div>
              {reserveEstateState?.error && (
                <h1 className='text-red-600 mt-3'>{reserveEstateState.error}</h1>
              )}
              <div className='flex flex-col'>
                <button className='mt-3 mb-2 p-3 bg-slate-500 hover:bg-green-800 cursor-pointer rounded-md transition-colors duration-500'>
                  Reserve
                </button>
              </div>
            </form>
          )
        )}
      </div>
    </div>
  );
}
