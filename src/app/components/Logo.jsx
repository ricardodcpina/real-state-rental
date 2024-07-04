import Image from 'next/image'

export default function Logo() {
    return (
        <div id='logo' className="w-[20vw] flex justify-center">
            <Image src="/logo.png" width={150} height={200} alt="Real Estate Logo" />
        </div>
    )
}