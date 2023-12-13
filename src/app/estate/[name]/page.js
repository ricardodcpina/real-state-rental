import Image from 'next/image'

export default function Page({ params }) {
    const name = params.name.replaceAll('%20', " ")

    

    return (
        <div className="w-2/6 h-2/3 container m-16 p-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg text-slate-950 font-bold">
            <div className='flex flex-col justify-center items-center '>
                <h1 className='mb-5  text-3xl'>{name}</h1>
                <Image src='/house-pool.png' width={500} height={300} />
            </div>
            <div className='mt-8 text-lg'>
                <h1>Estate Name: {name}</h1>
                <h1>Location: USA</h1>
                <h1>Price: 5000 USD per day</h1>
                <h1 className='mt-3 text-sm'>
                    Welcome to your ideal retreat – a stunning and meticulously designed home available for rental, perfectly marrying luxury with comfort. Nestled in a serene neighborhood, this exquisite property is a haven of tranquility, offering a seamless blend of modern elegance and timeless charm.
                </h1>
            </div>
            <div className='flex justify-between items-baseline'>
                <form action="">
                    <label>
                        Year
                        <select name="reserve_year" type="select" className=" text-slate-950 font-bold w-16 m-3">
                            <option value="">2023</option>
                            <option value="">2024</option>
                            <option value="">2025</option>
                        </select>
                    </label>
                    <label>
                        Month
                        <select name="reserve_month" type="select" className=" text-slate-950 font-bold w-28 m-3">
                            <option value="">January</option>
                            <option value="">February</option>
                            <option value="">March</option>
                            <option value="">April</option>
                            <option value="">May</option>
                            <option value="">June</option>
                            <option value="">July</option>
                            <option value="">August</option>
                            <option value="">September</option>
                            <option value="">October</option>
                            <option value="">November</option>
                            <option value="">December</option>
                        </select>
                    </label>

                    <label>
                        Day
                        <input name="reserve_day" type="number" max={31} min={1} className=" text-slate-950 font-bold w-16 m-3" />
                    </label>
                </form>
                <button className='mt-3 p-3 bg-slate-500 hover:bg-slate-400 cursor-pointer rounded-md '>
                    Reserve
                </button>
            </div>
        </div>
    )
}