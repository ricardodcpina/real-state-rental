import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"

export default function NavBar() {
    const user_id = cookies().get('user_id')?.value

    async function logOut() {
        'use server'
        cookies().delete('user_id')
        cookies().delete('user_token')
        redirect('/')
    }

    return (
        <div id="nav-bar" className="flex flex-grow justify-between items-center ">
            <div>
                <Link className='py-6 px-10 hover:bg-zinc-900' href='/'>HOME</Link>
                <Link className='py-6 px-10 hover:bg-zinc-900' href={user_id ? `/dashboard/${user_id}` : '/login'}>DASHBOARD</Link>
                <Link className='py-6 px-10 hover:bg-zinc-900' href={user_id ? `/dashboard/${user_id}/settings` : '/login'}>SETTINGS</Link>
            </div>
            <div className="flex">
                {user_id ?
                    (
                        <form action={logOut}>
                            <button type="submit" className='py-6 px-10 hover:bg-zinc-900' href='/login'>LOGOUT</button>
                        </form>
                    ) : (
                        <Link className='py-6 px-10 hover:bg-zinc-900' href='/login'>LOGIN</Link>
                    )
                }
            </div>
        </div>
    )
}