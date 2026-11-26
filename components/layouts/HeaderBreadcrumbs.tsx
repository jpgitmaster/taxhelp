import { CSSProperties } from 'react'
import Link from 'next/link'

interface BreadcrumbItem {
    label: string
    url?: string
}

interface PropsDefinition {
    scss: { [key: string]: string }
    icon?: string
    items: BreadcrumbItem[]
}

const maskIconStyle = (src: string): CSSProperties => ({
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
})

const HeaderBreadcrumbs = ({ scss, icon, items }: PropsDefinition) => {
    return (
        <div className={scss.breadcrumbTrail}>
            {icon && (
                <span
                    className={scss.breadcrumbIcon}
                    style={maskIconStyle(icon)}
                    role="img"
                    aria-label=""
                />
            )}
            {items.map((item, index) => {
                const isLast = index === items.length - 1

                return (
                    <span key={index} className={scss.breadcrumbItem}>
                        {index > 0 && <span className={scss.breadcrumbSep}>&gt;</span>}
                        {!isLast && item.url ? (
                            <Link href={item.url} className={scss.breadcrumbLink}>
                                {item.label}
                            </Link>
                        ) : (
                            <span className={scss.breadcrumbCurrent}>{item.label}</span>
                        )}
                    </span>
                )
            })}
        </div>
    )
}

export default HeaderBreadcrumbs
