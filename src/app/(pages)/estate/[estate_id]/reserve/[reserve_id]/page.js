import { fetchEstate } from '@/app/lib/actions'
import { cookies } from 'next/headers'
import ReserveEstateForm from '@/app/components/ReserveEstateForm'

export default async function ReservePage({ params }) {
    const { estate_id, reserve_id } = params
    const loggedUserId = cookies().get('user_id')?.value
    const estate = await fetchEstate(estate_id)

    return (
        <ReserveEstateForm estate={estate} user_id={loggedUserId} reserve_id={reserve_id} />
    )
}