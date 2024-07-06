'use client';

import { useFormState } from 'react-dom';
import { updateUser, deleteUser } from '../lib/userActions';
import { useState } from 'react';

export default function UpdateUserForm({ user }) {
  const user_id = user._id;

  const initialState = {
    error: null,
  };

  const initialFormFields = {
    username: user.username,
    email: user.email,
  };

  const [updateUserState, updateUserAction] = useFormState(updateUser, initialState);
  const [formFields, setFormFields] = useState(initialFormFields);

  return (
    <div className='container my-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={updateUserAction}>
        <h1 className='text-2xl mb-4'>User Profile</h1>
        <label htmlFor='username'>Username</label>
        <input
          id='username'
          name='username'
          type='text'
          className='mb-2 p-1 rounded-md'
          value={formFields.username}
          onChange={(e) => setFormFields({ ...formFields, username: e.target.value })}
          required
        />
        <label htmlFor='email'>E-mail</label>
        <input
          id='email'
          name='email'
          type='email'
          className='mb-2 p-1 rounded-md'
          placeholder={formFields.email}
          disabled
        />
        <label htmlFor='new-password'>New Password</label>
        <input
          id='new-password'
          name='password'
          type='password'
          className='mb-2 p-1 rounded-md'
          placeholder='*****'
        />
        <label htmlFor='confirm-password'>Confirm Password</label>
        <input
          id='confirm-password'
          name='confirm-password'
          type='password'
          className='mb-4 p-1 rounded-md'
          placeholder='*****'
        />
        <input id='user-id' name='user-id' type='hidden' value={user_id} />
        {updateUserState.error && (
          <h1 className='text-red-600 mb-3'>{updateUserState.error}</h1>
        )}

        <div className='flex justify-between'>
          <input
            type='button'
            onClick={() => deleteUser(user_id)}
            className='p-2 mr-2 bg-slate-500 hover:bg-red-800 transition-colors duration-500 cursor-pointer rounded'
            value='Delete account'
          />
          <input
            type='reset'
            className='p-2 mr-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            onClick={() => setFormFields({ ...initialFormFields })}
            value='Cancel'
          />
          <input
            type='submit'
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value='Save settings'
          />
        </div>
      </form>
    </div>
  );
}
