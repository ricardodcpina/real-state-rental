import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='flex flex-col text-3xl font-bold justify-center items-center w-screen'>
            <h2>Not Found</h2>
            <p>Could not find requested resource</p>
            <Link href="/">Return Home</Link>
        </div>
    )
}