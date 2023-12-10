import Link from "next/link"
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline"

export default function FilterMenu() {
    return (
        <aside id="filter-menu" className="flex flex-col w-80 p-4 h-screen border-r-2 border-zinc-700 bg-gradient-to-r from-black">
            <h1 className="pb-4 text-xl">FILTER</h1>

            <form className="flex flex-col" action="">
                <label htmlFor="estate-name">
                    Estate name
                </label>
                <input id="estate-name" name="estate-name" type="text" className="text-slate-950 font-bold" />
                <label htmlFor="location">
                    Location
                </label>
                <input id="location" name="location" type="select" className="text-slate-950 font-bold" />
                <label htmlFor="price">
                    Price
                </label>
                <input id="price" name="price" type="number" className="text-slate-950 font-bold" />

                <div className="flex justify-center font-bold text-slate-950">
                    <Link href="/">
                        <button type="submit" className="flex items-center bg-slate-600 hover:bg-slate-400 mt-5 w-36 rounded-md">
                            <MagnifyingGlassCircleIcon className="h-7 w-7 mr-5 text-yellow-700 bg-black rounded-md border-2 border-gray-700" />
                            Search
                        </button>
                    </Link>
                </div>
            </form>
        </aside >
    )
}