import { fetchEstate } from '@/app/lib/actions'
import { cookies } from 'next/headers'
import ReserveEstateForm from '@/app/components/ReserveEstateForm'

export default async function Page({ params }) {
    const { estate_id } = params
    const user_id = cookies().get('user_id')?.value

    const estate = await fetchEstate(estate_id)

    return (
        <ReserveEstateForm estate={estate} user_id={user_id} />
    )
}