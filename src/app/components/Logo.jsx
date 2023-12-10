import Image from 'next/image'

export default function Logo() {
    return (
        <div id='logo' className="flex justify-center w-80">
            <Image className="" src="/logo2.png" width={150} height={200} />
        </div>
    )
}