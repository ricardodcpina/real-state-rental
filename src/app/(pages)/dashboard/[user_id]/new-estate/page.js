import CreateEstateForm from "@/app/components/CreateEstateForm";

export default async function Page({ params }) {
    const { user_id } = params

    return (
        <CreateEstateForm user_id={user_id} />
    )
}