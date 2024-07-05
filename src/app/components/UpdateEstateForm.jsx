'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { updateEstate } from '@/app/lib/estateActions';

export default function UpdateEstateForm({ estate }) {
  const initialErrorState = {
    message: null,
  };

  const initialFormFields = {
    description: estate.description,
    location: estate.location,
    price: estate.price,
    image: null,
  };

  const [updateEstateState, updateEstateAction] = useFormState(updateEstate, initialErrorState);
  const [formFields, setFormFields] = useState(initialFormFields);

  return (
    <div className='container m-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={updateEstateAction}>
        <h1 className='text-2xl mb-4'>Edit Estate</h1>

        <Image
          src={formFields.image || `/images/${estate.thumbnail}`}
          width={400}
          height={500}
          alt='Picture of estate'
        />

        <label
          className=' my-4 p-2 mr-auto bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
          htmlFor='estate-picture'
        >
          Change Image
        </label>
        <input
          id='estate-picture'
          name='thumbnail'
          type='file'
          accept='.jpg, .jpeg, .png'
          onChange={(e) =>
            setFormFields({
              ...formFields,
              image: URL.createObjectURL(e.target.files[0]),
            })
          }
          hidden
        />

        <label htmlFor='estate-name'>Estate Name</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-name'
          name='description'
          type='text'
          value={formFields.description}
          onChange={(e) => setFormFields({ ...formFields, description: e.target.value })}
        />

        <label htmlFor='estate-location'>Location</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-location'
          name='location'
          type='text'
          value={formFields.location}
          onChange={(e) => setFormFields({ ...formFields, location: e.target.value })}
        />

        <label htmlFor='estate-price'>Price in USD</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-price'
          name='price'
          type='number'
          value={formFields.price}
          onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
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
          <button
            type='reset'
            className='p-2 mr-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            onClick={() => setFormFields({ ...initialFormFields })}
          >
            Discard
          </button>
          <button
            type='submit'
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
          >
            Submit Changes
          </button>
        </div>
      </form>
    </div>
  );
}
