export default function Page() {
    return (
        <div className="container m-16 w-2/6 p-4 h-1/3 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg font-bold text-slate-950">
            <form className="flex flex-col" action="">
                <h1 className="text-2xl mb-4">Edit Estate</h1>
                <label htmlFor="estate-picture">Picture</label>
                <input id="estate-picture" name="estate-picture" type="file" accept=".jpg, .jpeg, .png" className="mb-4 " />
                <label htmlFor="estate-name">Estate Name</label>
                <input id="estate-name" name="estate-name" type="text" className="mb-4" />
                <label htmlFor="estate-location">Location</label>
                <input id="estate-location" name="estate-location" type="text" className="mb-4" />
                <label htmlFor="estate-price">Price in USD</label>
                <input id="estate-price" name="estate-price" type="number" step="100.00" className="mb-4" />
                <div>
                    <h1>Estate available for rental?</h1>
                    <label htmlFor="estate-available">
                        <input id="estate-available" name="estate-available" type="radio" className="mt-4 mr-1" />
                        Yes
                    </label>
                    <label htmlFor="estate-unavailable" className="ml-2">
                        <input id="estate-unavailable" name="estate-unavailable" type="radio" className="mr-1" />
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