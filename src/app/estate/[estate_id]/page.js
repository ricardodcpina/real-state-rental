import Image from 'next/image'
import { cookies } from 'next/headers'

export default async function Page({ params }) {
    const estate_id = params.estate_id
    const token = cookies().get('user_token')?.value

    async function getHouse() {
        'use server'

        const data = await fetch(`http://localhost:8000/houses/${estate_id}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const estate = await data.json()
        return estate
    }

    const estate = await getHouse()

    return (
        <div className="w-2/6 h-2/3 container m-16 p-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg text-slate-950 font-bold">
            <div className='flex flex-col justify-center items-center '>
                <h1 className='mb-5  text-3xl'>{estate.description}</h1>
                <Image src={`/${estate.thumbnail}`} width={500} height={300} alt="Picture of estate" />
            </div>
            <div className='mt-8 text-lg'>
                <h1>Estate Name: {`${estate.description}`}</h1>
                <h1>Location: {`${estate.location}`}</h1>
                <h1>Price: {`${estate.price}`} USD per day</h1>
                <h1 className='mt-3 text-sm'>
                    Welcome to your ideal retreat – a stunning and meticulously designed home available for rental, perfectly marrying luxury with comfort. Nestled in a serene neighborhood, this exquisite property is a haven of tranquility, offering a seamless blend of modern elegance and timeless charm.
                </h1>
            </div>
            <div className='flex justify-between items-baseline'>
                <form action="">
                    <label htmlFor='reserve-date'>  </label>
                    <input type='date' name='reserve-date' id='reserve-date' className='rounded-md text-center' />
                </form>
                <button className='mt-3 p-3 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded-md '>
                    Reserve
                </button>
            </div>
        </div>
    )
}