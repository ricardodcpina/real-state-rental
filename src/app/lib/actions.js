'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function loginUser(prevState, formData) {

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
    if (credentials.error) {
        return { message: credentials.error}
    }

    cookies().set('user_token', credentials.token)
    cookies().set('user_id', credentials.userId)
    redirect(`/dashboard/${credentials.userId}`)
}

export async function createUser(prevState, formData) {

    const data = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
        })
    })

    const user = await data.json()
    if (user.error) {
        return { message: user.error}
    }

    await loginUser(formData)
}