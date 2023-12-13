import LoginForm from "../components/LoginForm"
import { redirect } from "next/navigation"
import { cookies } from 'next/headers'

async function loginUser(formData) {
    'use server'

    const data = await fetch('http://localhost:8000/users/auth', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            username: formData.get('username'),
            password: formData.get('password'),
        }),
        cache: 'no-store'
    })

    const credentials = await data.json()
    cookies().set('user_token', credentials.token)
    cookies().set('user_id', credentials.userId)
    console.log(cookies().getAll())
    redirect(`/dashboard/${credentials.userId}`)
}

async function createUser(formData) {
    'use server'

    const createUser = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        })
    })

    await createUser.json()
    await loginUser(formData)
}

export default function Page() {
    return (
        <LoginForm loginUser={loginUser} createUser={createUser} />
    )
}