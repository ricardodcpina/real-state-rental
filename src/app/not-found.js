import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex flex-col text-3xl font-bold justify-center items-center w-screen'>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/" className=' mt-5 hover:opacity-30 transition-opacity duration-500'>Return to Home</Link>
        </div>
    )
}