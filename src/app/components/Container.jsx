import HouseCard from './HouseCard'
import { revalidatePath } from 'next/cache'

export default async function Container() {
    async function fetchHouses() {
        'use server'
        const data = await fetch('http://localhost:8000/houses?available=true', {
            method: 'GET',
        })

        const houses = await data.json()
        revalidatePath(`/`)
        return houses
    }
    const houses = await fetchHouses()

    return (
        <div className="h-[890px] w-[1400px] mx-16 my-8 px-8 py-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg">
            <div className='ml-4 flex justify-start items-center font-semibold text-slate-950'>
                <h1 className='text-3xl'>Estates</h1>
            </div>
            <div className='grid grid-cols-5 grid-rows-3'>
                {houses && houses.map(estate => (
                    <HouseCard key={estate._id} name={estate.description} src={`/${estate.thumbnail}`} estate_id={estate._id} />
                ))}
                <HouseCard src="" />
            </div>
            <div className='flex justify-center items-center'>
                <nav aria-label="Page navigation">
                    <ul className="inline-flex">
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 rounded-l-lg bg-white focus:shadow-outline hover:bg-indigo-200">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg></button>
                        </li>
                        <li><button className="h-8 px-5 text-white transition-colors duration-150 focus:shadow-outline bg-zinc-700">1</button></li>
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">2</button></li>
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">3</button></li>
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">4</button></li>
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">5</button></li>
                        <li><button className="h-8 px-5 text-black transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-200">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg></button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    )
} 
