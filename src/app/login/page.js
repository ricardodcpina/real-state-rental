import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

export default async function Page() {
    async function loginUser(formData) {
        'use server'

        const rawFormData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirm-password'),
        }

        const createUser = await fetch('http://localhost:8000/users', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify(rawFormData)
        })

        const token = await fetch('http://localhost:8000/users/auth', {
            method: 'POST',
            headers: { 'Content-Type': "application/json" },
            body: JSON.stringify({
                username: rawFormData.username,
                password: rawFormData.password
            }),
            cache: 'no-store'
        })

        const user = await createUser.json()
        const auth = await token.json()

        cookies().set('user_id', user._id)
        cookies().set('user_token', auth.token)

        redirect(`/dashboard/${user._id}`)
    }

    return (
        <div className="m-16 w-2/6 p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action={loginUser}>
                <h1 className="text-2xl mb-4">
                    Account Register / Log In
                </h1>
                <label htmlFor="username">Username</label>
                <input id="username" name="username" type="text" className="mb-4" />
                <label htmlFor="email">E-mail</label>
                <input id="email" name="email" type="email" className="mb-4" />
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" className="mb-4" />
                <label htmlFor="confirm-password">Confirm Password</label>
                <input id="confirm-password" name="confirm-password" type="password" className="mb-4" />
                <div className="flex justify-end">
                    <input type="button" className="p-2 mr-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Cancel" />
                    <input type="submit" className="p-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Sign in / Log in" />
                </div>
            </form>
        </div>
    )
}