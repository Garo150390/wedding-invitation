import Image from 'next/image'

interface LocationCardProps {
    title: string
    subtitle: string
    time: string
    imageSrc?: string,
    coordinates?: string
    reverse?: boolean
}

export function LocationCard({ title, subtitle, time, imageSrc, coordinates = "40.38054071398459, 44.39671876840379", reverse = false }: LocationCardProps) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates}`
    return (
        <div className={`flex items-center ${reverse ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`flex-1 ${reverse ? 'text-right pr-4' : 'text-left pl-4'}`}>
                <h3 className="text-[#E3CB88] text-xl font-medium mb-1">{title}</h3>
                <p className="text-gray-600 text-xs mb-1">{subtitle}</p>
                <p className="text-2xl text-gray-700 font-light mb-3">{time}</p>
                <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#E3CB88] text-white text-xs px-5 py-1.5 rounded-full"
                >
                    ՔԱՐՏԵԶ
                </a>
                {/*<button className="bg-[#E3CB88] text-white text-xs px-5 py-1.5 rounded-full">ՔԱՐՏԵԶ</button>*/}
            </div>

            <div className={`w-20 h-20 relative flex-shrink-0 ${reverse ? 'mr-4' : 'ml-4'}`}>
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#E3CB88]/20">
                    <Image src={imageSrc || '/placeholder.svg'} alt={title} fill className="object-cover"/>
                </div>
            </div>
        </div>
    )
}

