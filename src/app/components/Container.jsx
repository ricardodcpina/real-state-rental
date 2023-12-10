import HouseCard from './HouseCard'

export default function Container() {
    return (
        <div className="flex flex-col items-center">
            <div className="container mx-5 my-16 p-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg">
                <div className='flex justify-center items-center font-bold text-slate-950'>
                    <h1 className='mb-3 text-3xl'>Estates</h1>
                </div>
                <div className='flex justify-center flex-wrap'>
                    <HouseCard name="House A" src="/house-pool.png" estate_id={1} />
                    <HouseCard name="House B" src="/exotic-house.png" estate_id={2} />
                    <HouseCard name="House C" src="/fancy-house.png" estate_id={3} />
                    <HouseCard name="House D" src="/simple-house.png" estate_id={4} />
                    <HouseCard name="House E" src="/test-house.png" estate_id={5} />
                    <HouseCard name="House F" src="/house-pool.png" estate_id={6} />
                    <HouseCard name="House G" src="/exotic-house.png" estate_id={7} />
                    <HouseCard name="House I" src="/fancy-house.png" estate_id={8} />
                    <HouseCard name="House J" src="/simple-house.png" estate_id={9} />
                    <HouseCard name="House K" src="/test-house.png" estate_id={10} />
                    <HouseCard name="House L" src="/house-pool.png" estate_id={11} />
                    <HouseCard name="House M" src="/exotic-house.png" estate_id={12} />
                    <HouseCard name="House N" src="/fancy-house.png" estate_id={13} />
                    <HouseCard name="House O" src="/simple-house.png" estate_id={14} />
                    <HouseCard name="House P" src="/test-house.png" estate_id={15} />
                </div>
                <div className='flex justify-center'>
                    <nav aria-label="Page navigation">
                        <ul class="inline-flex">
                            <li><button class="h-10 px-5 text-black transition-colors duration-150 rounded-l-lg bg-white focus:shadow-outline hover:bg-indigo-200">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                            </li>
                            <li><button class="h-10 px-5 text-white transition-colors duration-150 focus:shadow-outline bg-zinc-700">1</button></li>
                            <li><button class="h-10 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">2</button></li>
                            <li><button class="h-10 px-5 text-black transition-colors duration-150 focus:shadow-outline hover:bg-indigo-200">3</button></li>
                            <li><button class="h-10 px-5 text-black transition-colors duration-150 bg-white rounded-r-lg focus:shadow-outline hover:bg-indigo-200">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" fill-rule="evenodd"></path></svg></button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
} 
