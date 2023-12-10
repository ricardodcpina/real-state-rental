import CarouselContainer from "@/app/components/CarouselContainer"

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <CarouselContainer description="My Estates" />
            <CarouselContainer description="My Reserves" />
        </div>
    )
}

