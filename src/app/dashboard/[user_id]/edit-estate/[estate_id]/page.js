import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function Page({ params }) {
    const token = cookies().get('user_token').value
    const { user_id, estate_id } = params

    async function fetchEstate() {
        'use server'

        const data = await fetch(`http://localhost:8000/houses/${estate_id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const estate = await data.json()
        return estate
    }
    const estate = await fetchEstate()

    async function updateEstate(formData) {
        'use server'

        await fetch(`http://localhost:8000/houses/${estate_id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
            cache: 'no-cache'
        })

        revalidatePath(`/dashboard/${user_id}`)
        redirect(`/dashboard/${user_id}`)
    }

    return (
        <div className="container m-8 mx-16 w-[400px] p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action={updateEstate}>
                <h1 className="text-2xl mb-4">Edit Estate</h1>
                <label htmlFor="estate-picture">Picture</label>
                <input className="mb-4" id="estate-picture" name="thumbnail" type="file" accept=".jpg, .jpeg, .png" />
                <label htmlFor="estate-name">Estate Name</label>
                <input className="mb-4" id="estate-name" name="description" type="text" placeholder={estate.description} />
                <label htmlFor="estate-location">Location</label>
                <input className="mb-4" id="estate-location" name="location" type="text" placeholder={estate.location} />
                <label htmlFor="estate-price">Price in USD</label>
                <input className="mb-4" id="estate-price" name="price" type="number" step="100.00" placeholder={estate.price} />
                <div>
                    <h1>Estate available for rental?</h1>
                    <label htmlFor="estate-available">
                        <input className="mt-4 mr-1" id="estate-available" name="available" type="radio" value="true" defaultChecked={estate.available === true} />
                        Yes
                    </label>
                    <label htmlFor="estate-unavailable" className="ml-2">
                        <input id="estate-unavailable" name="available" type="radio" value="false" className="mr-1" defaultChecked={estate.available === false} />
                        No
                    </label>
                </div>

                <div className="flex justify-end">
                    <input type="button" className="p-2 mr-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Cancel" />
                    <input type="submit" className="p-2 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded" value="Submit changes" />
                </div>
            </form>
        </div>
    )
}