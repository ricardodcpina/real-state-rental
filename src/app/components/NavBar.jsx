import Link from 'next/link';
import { logoutUser } from '../lib/userActions';
import { getSession } from '../lib/sessionActions';

export default async function NavBar() {
  const session = await getSession();

  return (
    <nav id='nav-bar' className='flex grow justify-between items-center'>
      <div>
        <Link className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500' href='/'>
          HOME
        </Link>
        <Link
          className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
          href={session ? `/dashboard/${session?.sub}` : `/login`}
        >
          DASHBOARD
        </Link>
        <Link
          className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
          href={session ? `/dashboard/${session?.sub}/settings` : `/login`}
        >
          SETTINGS
        </Link>
      </div>
      <div>
        {session?.sub ? (
          <form action={logoutUser}>
            <button
              type='submit'
              className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
              href='/login'
            >
              LOGOUT
            </button>
          </form>
        ) : (
          <Link
            className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
            href='/login'
          >
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
