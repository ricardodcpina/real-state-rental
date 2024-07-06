'use client';

import { useFormState } from 'react-dom';
import { createEstate } from '@/app/lib/estateActions';
import { useState } from 'react';
import Image from 'next/image';

export default function CreateEstateForm({ user_id }) {
  const initialErrorState = {
    error: null,
  };

  const initialFormFields = {
    description: '',
    location: '',
    price: '',
    image: null,
    available: true,
  };

  const [createEstateState, createEstateAction] = useFormState(createEstate, initialErrorState);
  const [formFields, setFormFields] = useState(initialFormFields);

  return (
    <div className='container m-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={createEstateAction}>
        <h1 className='text-2xl mb-4'>Add Estate</h1>

        {formFields.image && (
          <Image src={formFields.image} width={400} height={500} alt='Picture of estate' />
        )}

        <label
          className=' my-4 p-2 mr-auto bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
          htmlFor='estate-picture'
        >
          Insert Image
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
        <label htmlFor='price'>Price (USD)</label>
        <input
          className='mb-2 p-1 rounded-md'
          id='estate-price'
          name='price'
          type='number'
          value={formFields.price}
          onChange={(e) => setFormFields({ ...formFields, price: e.target.value })}
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
        {createEstateState.error && (
          <h1 className='text-red-600 mb-3'>{createEstateState.error}</h1>
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
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 rounded cursor-pointer'
          >
            Submit Estate
          </button>
        </div>
      </form>
    </div>
  );
}
