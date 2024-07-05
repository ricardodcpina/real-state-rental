import Link from 'next/link';
import { logoutUser } from '../lib/userActions';
import { cookies } from 'next/headers';

export default function NavBar() {
  const user_id = cookies().get('user_id')?.value;

  return (
    <nav id='nav-bar' className='flex grow justify-between items-center'>
      <div>
        <Link className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500' href='/'>
          HOME
        </Link>
        <Link
          className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
          href={`/dashboard/${user_id}`}
        >
          DASHBOARD
        </Link>
        <Link
          className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500'
          href={`/dashboard/${user_id}/settings`}
        >
          SETTINGS
        </Link>
      </div>
      <div>
        {user_id ? (
          <form action={logoutUser}>
            <button type='submit' className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500' href='/login'>
              LOGOUT
            </button>
          </form>
        ) : (
          <Link className='py-6 px-10 hover:bg-zinc-900 transition-colors duration-500' href='/login'>
            LOGIN
          </Link>
        )}
      </div>
    </nav>
  );
}
