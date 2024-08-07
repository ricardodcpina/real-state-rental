'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { loginUser, createUser } from '../lib/userActions';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackURL = searchParams?.get('callbackUrl');

  useEffect(() => {
    router.refresh();
  }, [router]);

  const initialState = {
    error: null,
  };

  const loginUserWithCallbackURL = loginUser.bind(null, callbackURL);

  const [hasAccount, setHasAccount] = useState(true);
  const [loginState, loginUserAction] = useFormState(loginUserWithCallbackURL, initialState);
  const [createUserState, createUserAction] = useFormState(createUser, initialState);

  return (
    <section className='w-[25%] h-1/3 ml-16 my-8 px-4 py-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950'>
      <form className='flex flex-col' action={hasAccount ? loginUserAction : createUserAction}>
        <div className='flex flex-grow justify-between items-baseline'>
          <h1 className='text-2xl mb-4'>{hasAccount ? 'Login' : 'Register Account'}</h1>
          <input
            type='button'
            onClick={() => setHasAccount(!hasAccount)}
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value={hasAccount ? 'Sign Up' : 'Login'}
          />
        </div>
        <label htmlFor='username'>Username</label>
        <input id='username' name='username' type='text' className='mb-2 p-1 rounded-md' required />
        {!hasAccount && (
          <>
            <label htmlFor='email'>E-mail</label>
            <input id='email' name='email' type='email' className='mb-2 p-1 rounded-md' required />
          </>
        )}
        <label htmlFor='password'>Password</label>
        <input
          id='password'
          name='password'
          type='password'
          className='mb-2 p-1 rounded-md'
          required
        />
        {!hasAccount && (
          <>
            <label htmlFor='confirm-password'>Confirm Password</label>
            <input
              id='confirm-password'
              name='confirm-password'
              type='password'
              className='mb-2 p-1 rounded-md'
              required
            />
          </>
        )}
        {hasAccount && loginState.error && (
          <h1 className='text-red-600 mb-3'>{loginState.error}</h1>
        )}
        {!hasAccount && createUserState.error && (
          <h1 className='text-red-600 mb-3'>{createUserState.error}</h1>
        )}
        <div className='flex justify-end'>
          <input
            type='reset'
            className='p-2 mr-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value='Cancel'
          />
          <input
            type='submit'
            className='p-2 bg-slate-500 hover:bg-slate-400 transition-colors duration-500 cursor-pointer rounded'
            value='Submit'
          />
        </div>
      </form>
    </section>
  );
}
