'use client';

import { useFormState } from 'react-dom';
import { createEstate } from '@/app/lib/estateActions';
import { useState } from 'react';
import Image from 'next/image';

export default function CreateEstateForm({ user_id }) {
  const initialState = {
    message: null,
  };

  const [estateImage, setEstateImage] = useState(null);
  const [createEstateState, createEstateAction] = useFormState(createEstate, initialState);

  return (
    <div className='container m-16 w-[30%] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={createEstateAction}>
        <h1 className='text-2xl mb-4'>Add Estate</h1>

        {estateImage && (
          <Image src={estateImage} width={400} height={500} alt='Picture of estate' />
        )}

        <label htmlFor='thumbnail'>Picture</label>
        <input
          className='mb-4'
          id='estate-picture'
          name='thumbnail'
          type='file'
          accept='.jpg, .jpeg, .png'
          onChange={(e) => setEstateImage(URL.createObjectURL(e.target.files[0]))}
          required
        />
        <label htmlFor='estate-name'>Estate Name</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-name'
          name='description'
          type='text'
          required
        />
        <label htmlFor='estate-location'>Location</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-location'
          name='location'
          type='text'
          required
        />
        <label htmlFor='price'>Price (USD)</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-price'
          name='price'
          type='number'
          required
        />
        <input id='user-id' name='user-id' type='hidden' value={user_id} />
        <div>
          <h1>Estate available for rental?</h1>
          <label htmlFor='estate-available'>
            <input
              id='estate-available'
              name='available'
              type='radio'
              value='true'
              className='mt-4 mr-1'
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
            />
            No
          </label>
        </div>
        {createEstateState.message && (
          <h1 className='text-red-600 mb-3'>{createEstateState.message}</h1>
        )}
        <div className='flex justify-end'>
          <input
            type='reset'
            className='p-2 mr-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 rounded cursor-pointer'
            value='Cancel'
          />
          <input
            type='submit'
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 rounded cursor-pointer'
            value='Submit estate'
          />
        </div>
      </form>
    </div>
  );
}
