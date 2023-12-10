import { cookies } from "next/headers"
import Link from "next/link"

export default function NavBar() {
    const user_id = cookies().get('user_id')?.value

    return (
        <div id="nav-bar" className="flex">
            <Link className='py-6 px-10 hover:bg-zinc-900' href='/'>HOME</Link>
            <Link className='py-6 px-10 hover:bg-zinc-900' href={`/dashboard/${user_id}`}>DASHBOARD</Link>
            <Link className='py-6 px-10 hover:bg-zinc-900' href={`/dashboard/${user_id}/settings`}>SETTINGS</Link>
        </div>
    )
}