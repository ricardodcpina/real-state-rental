'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { updateEstate } from '../lib/actions';

export default function UpdateEstateForm({ estate }) {
  const initialState = {
    message: null,
  };

  const [updateEstateState, updateEstateAction] = useFormState(updateEstate, initialState);

  const [estateDescription, setEstateDescription] = useState(estate.description);
  const [estateLocation, setEstateLocation] = useState(estate.location);
  const [estatePrice, setEstatePrice] = useState(estate.price);
  const [estateImage, setEstateImage] = useState(null);

  return (
    <div className='container m-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={updateEstateAction}>
        <h1 className='text-2xl mb-4'>Edit Estate</h1>

        <Image
          src={estateImage || `/images/${estate.thumbnail}`}
          width={400}
          height={500}
          alt='Picture of estate'
        />

        <label className='mt-4' htmlFor='estate-picture'>
          Picture
        </label>
        <input
          className='mb-4'
          id='estate-picture'
          name='thumbnail'
          type='file'
          accept='.jpg, .jpeg, .png'
          onChange={(e) => setEstateImage(URL.createObjectURL(e.target.files[0]))}
        />

        <label htmlFor='estate-name'>Estate Name</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-name'
          name='description'
          type='text'
          value={estateDescription}
          onChange={(e) => setEstateDescription(e.target.value)}
        />

        <label htmlFor='estate-location'>Location</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-location'
          name='location'
          type='text'
          value={estateLocation}
          onChange={(e) => setEstateLocation(e.target.value)}
        />

        <label htmlFor='estate-price'>Price in USD</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-price'
          name='price'
          type='number'
          step='100.00'
          value={estatePrice}
          onChange={(e) => setEstatePrice(e.target.value)}
        />

        <input id='estate-id' name='estate-id' type='hidden' value={estate._id} />
        <input id='user-id' name='user-id' type='hidden' value={estate.user} />

        <div className='mb-2'>
          <h1>Estate available for rental?</h1>
          <label htmlFor='estate-available'>
            <input
              className='mt-4 mr-1'
              id='estate-available'
              name='available'
              type='radio'
              value='true'
              defaultChecked={estate.available === true}
            />
            Yes
          </label>
          <label htmlFor='estate-unavailable' className='ml-2'>
            <input
              id='estate-unavailable'
              name='available'
              type='radio'
              value='false'
              className='mr-1'
              defaultChecked={estate.available === false}
            />
            No
          </label>
        </div>
        {updateEstateState.message && (
          <h1 className='text-red-600 mb-3'>{updateEstateState.message}</h1>
        )}
        <div className='flex justify-end'>
          <input
            type='reset'
            className='p-2 mr-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value='Discard changes'
            onClick={() => setEstateImage(`/${estate.thumbnail}`)}
          />
          <input
            type='submit'
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value='Submit changes'
          />
        </div>
      </form>
    </div>
  );
}
