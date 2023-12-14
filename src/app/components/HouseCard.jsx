'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'

export default function HouseCard({ src, name, estate_id, user_id, deleteHouse }) {
    const path = usePathname()

    return (
        <>
            <div className='h-[230px] w-[235px] m-4 shadow-lg hover:outline hover:outline-indigo-400 cursor-pointer overflow-hidden' >
                <Link href={`/estate/${name}`}>
                    <div className='flex flex-col justify-center items-center'>
                        {src && <Image src={src} width={300} height={250} alt='Estate picture' />}
                        <h1 className='text-black mt-1'>{name}</h1>
                    </div>
                </Link>
                <div className='flex justify-end items-center mr-4 my-2'>
                    {src && path === `/dashboard/${user_id}` &&
                        (<>
                            <Link href={`/dashboard/${user_id}/edit-estate/${estate_id}`}>
                                <PencilSquareIcon className='h-6 w-6 mx-2 text-zinc-100 bg-yellow-700 hover:bg-yellow-600 rounded-md border-2 border-gray-700' />
                            </Link>
                            <button onClick={() => deleteHouse(user_id, estate_id)}>
                                <TrashIcon className='h-6 w-6 text-zinc-100 bg-red-900 hover:bg-red-700 rounded-md border-2 border-gray-700' />
                            </button>
                        </>)
                    }
                </div>
            </div>
        </>
    )
}