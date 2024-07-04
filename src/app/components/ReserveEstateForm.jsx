'use client'

import { useFormState } from 'react-dom'
import { cancelReserve, reserveEstate } from '../lib/actions'
import Image from 'next/image'

export default function ReserveEstateForm({ estate, user_id, reserve_id }) {

    const initialState = {
        message: null
    }

    const [reserveEstateState, reserveEstateAction] = useFormState(reserveEstate, initialState)

    return (
        <div className="w-2/6 h-2/3 container m-16 p-4 bg-gradient-to-r from-zinc-300 to-zinc-200 rounded-lg text-slate-950 font-bold">
            <div className='flex flex-col justify-center items-center '>
                <h1 className='mb-5  text-3xl'>{estate.description}</h1>
                <Image src={`/images/${estate.thumbnail}`} width={500} height={300} alt="Picture of estate" />
            </div>
            <div className='mt-8 text-lg'>
                <h1>Estate Name: {`${estate.description}`}</h1>
                <h1>Location: {`${estate.location}`}</h1>
                <h1>Price: {`${estate.price}`} USD per day</h1>
                <h1 className='mt-3 text-sm'>
                    Welcome to your ideal retreat – a stunning and meticulously designed home available for rental,
                    perfectly marrying luxury with comfort. Nestled in a serene neighborhood, this exquisite property
                    is a haven of tranquility, offering a seamless blend of modern elegance and timeless charm.
                </h1>
            </div>
            <div>
                {reserve_id ? (
                    <div className='flex flex-col'>
                        <button onClick={() => cancelReserve(reserve_id)} className='mt-3 p-3 bg-red-800 hover:bg-red-700 cursor-pointer rounded-md '>
                            Cancel reserve
                        </button>
                    </div>
                ) : (

                    user_id && user_id !== estate.user &&
                    < form action={reserveEstateAction}>
                        <div className='flex mt-3 justify-end'>
                            <label htmlFor='reserve-date'>Date of Reserve:</label>
                            <input name='date' id='reserve-date' type='date' className='rounded-md text-center ml-3' required />
                            <input id="estate-id" name="estate-id" type="hidden" value={estate._id} />
                            <input id="user-id" name="user-id" type="hidden" value={user_id} />
                        </div>
                        <div className='flex flex-col'>
                            <button className='mt-3 p-3 bg-green-800 hover:bg-green-700 cursor-pointer rounded-md '>
                                Reserve
                            </button>
                        </div>
                        {reserveEstateState.message && <h1 className="text-red-600 mb-3">{reserveEstateState.message}</h1>}
                    </form>
                )
                }
            </div>
        </div >
    )
}