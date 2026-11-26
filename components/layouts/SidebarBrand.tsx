import Link from 'next/link'
import Image from 'next/image'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const SidebarBrand = ({ scss }: PropsDefinition) => {
    return (
        <Link href='/bookkeeper/dashboard' className={scss.sidebarBrand}>
            <span className={scss.sidebarBrandFull}>
                <Image
                    src='/images/logo.png'
                    alt=''
                    aria-hidden
                    priority
                    width={120}
                    height={34}
                    unoptimized={true}
                    className={scss.sidebarBrandFullMono}
                />
                <Image
                    src='/images/logo.png'
                    alt='TaxHelp'
                    priority
                    width={120}
                    height={34}
                    unoptimized={true}
                    className={scss.sidebarBrandFullColor}
                />
            </span>
            <span className={scss.sidebarBrandIcon} role='img' aria-label='TaxHelp' />
        </Link>
    )
}

export default SidebarBrand
