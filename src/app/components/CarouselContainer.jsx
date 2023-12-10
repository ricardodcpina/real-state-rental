import Link from 'next/link'
import HouseCard from './HouseCard'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export default async function CarouselContainer({ description }) {
    const user_id = cookies().get('user_id')?.value
    const token = cookies().get('user_token')?.value

    async function getMyHouses() {
        'use server'
        const getHouses = await fetch('http://localhost:8000/dashboard', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        })

        const myHouses = await getHouses.json()

        revalidatePath(`/dashboard/${user_id}`)

        return myHouses
    }

    const houses = await getMyHouses()

    return (
        <div className="mx-16 my-8 p-8 h-[385px] w-[1400px] bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg">
            <div className='flex justify-between items-center font-bold text-slate-950'>
                <h1 className='ml-4 text-xl'>{description}</h1>
                {description === "My Estates" &&
                    <Link href={`/dashboard/${user_id}/new-estate`}>
                        <button className='flex mr-4 pr-2 bg-slate-500 hover:bg-slate-400 rounded-md '>
                            <PlusCircleIcon className='h-7 w-7 mr-2 text-yellow-700 bg-black rounded-md border-2 border-gray-700' />New Entry
                        </button>
                    </Link>
                }
            </div>
            <div className='flex mt-1 justify-center items-center'>
                {houses.map(estate =>
                    <HouseCard name={estate.description} src={`/${estate.thumbnail}`} estate_id={estate._id} user_id={user_id} />
                )}
                <HouseCard name="Pool House" src="/house-pool.png" estate_id={1} user_id={user_id} location="Arizona" />
                <HouseCard name="Exotic House" src="/exotic-house.png" estate_id={2} user_id={user_id} />
                <HouseCard name="Fancy House" src="/fancy-house.png" estate_id={3} user_id={user_id} />
                <HouseCard name="Simple House" src="/simple-house.png" estate_id={4} user_id={user_id} />
                <HouseCard name="Test House" src="/test-house.png" estate_id={5} user_id={user_id} />
            </div>
            <div className='flex justify-center'>
                <nav aria-label="Page navigation">
                    <ul className="inline-flex">
                        <li><button className="h-10 px-5 text-black transition-colors duration-150 rounded-l-lg bg-white focus:shadow-outline hover:bg-indigo-200">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                        </li>
                        <li><button className="h-10 px-5 text-white transition-colors duration-150 focus:shadow-outline bg-zinc-700">1</button></li>
                        <li><button className="h-10 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">2</button></li>
                        <li><button className="h-10 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">3</button></li>
                        <li><button className="h-10 px-5 text-black transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-200">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
} 
