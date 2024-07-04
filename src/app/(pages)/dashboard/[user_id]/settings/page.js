import UpdateUserForm from "@/app/components/UpdateUserForm"
import { fetchUser } from "@/app/lib/actions"

export default async function Page({ params }) {
    const { user_id } = params
    const user = await fetchUser(user_id)

    return (
        <UpdateUserForm user={user} />
    )
}