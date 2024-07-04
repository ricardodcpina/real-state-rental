import UpdateEstateForm from "@/app/components/UpdateEstateForm"
import { fetchEstate } from "@/app/lib/actions"

export default async function Page({ params }) {
    const { estate_id } = params
    const estate = await fetchEstate(estate_id)

    return (
        <UpdateEstateForm estate={estate} />
    )
}