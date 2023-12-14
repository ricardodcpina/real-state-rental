import { cookies } from "next/headers"

export default async function Page({ params }) {
    const userId = params.user_id
    console.log('userId', userId)
    const token = cookies().get('user_token')?.value

    async function getUser() {
        'use server'

        const data = await fetch(`http://localhost:8000/users/${userId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const user = await data.json()
        console.log('user from db', user)
        return user
    }

    const user = await getUser()

    return (
        <div className="container my-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action={''}>
                <h1 className="text-2xl mb-4">User Profile</h1>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" className="mb-4" placeholder={user.username} disabled/>
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" className="mb-4" placeholder={user.email} disabled />
                <label htmlFor="new-password">New Password</label>
                <input id="new-password" name="password" type="password" className="mb-4" />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input id="confirm-password" name="confirm-password" type="password" className="mb-4" />

                <div className="flex justify-end">
                    <input type="button" className="p-2 mr-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Reset settings" />
                    <input type="submit" className="p-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Save settings" />
                </div>
            </form>
        </div>
    )
}