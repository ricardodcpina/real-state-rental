import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function Page({ params }) {
    const token = cookies().get('user_token').value
    const user_id = params.user_id

    async function createEstate(formData) {
        'use server'

        await fetch("http://localhost:8000/houses", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
            cache: 'no-cache'
        })

        redirect(`/dashboard/${user_id}`)
    }

    return (
        <div className="container m-16 w-2/6 p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action={createEstate} >
                <h1 className="text-2xl mb-4">Add Estate</h1>
                <label htmlFor="thumbnail">Picture</label>
                <input id="estate-picture" name="thumbnail" type="file" accept=".jpg, .jpeg, .png" className="mb-4 " />
                <label htmlFor="estate-name">Estate Name</label>
                <input id="estate-name" name="description" type="text" className="mb-4" />
                <label htmlFor="estate-location">Location</label>
                <input id="estate-location" name="location" type="text" className="mb-4" />
                <label htmlFor="price">Price in USD</label>
                <input id="estate-price" name="price" type="number" step="100.0" className="mb-4" />
                <div>
                    <h1>Estate available for rental?</h1>
                    <label htmlFor="estate-available">
                        <input id="estate-available" name="available" type="radio" value="true" className="mt-4 mr-1" />
                        Yes
                    </label>
                    <label htmlFor="estate-unavailable" className="ml-2">
                        <input id="estate-unavailable" name="available" type="radio" value="false" className="mr-1" />
                        No
                    </label>
                </div>

                <div className="flex justify-end">
                    <input type="button" className="p-2 mr-2 bg-slate-400 rounded cursor-pointer" value="Cancel" />
                    <input type="submit" className="p-2 bg-slate-400 rounded cursor-pointer" value="Submit estate" />
                </div>
            </form>
        </div>
    )
}