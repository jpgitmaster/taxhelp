import { Ref, MouseEvent, CSSProperties } from 'react'
import Link from 'next/link'
import { Skeleton } from 'antd'
import { NavLink } from '@/controllers/layouts/types/cms_types'

interface AppLink extends NavLink {
    routeActive?: boolean
}

const maskIconStyle = (src: string): CSSProperties => ({
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
})

const SidebarSkeleton = () => {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{ padding: '5px 0' }}>
                    <Skeleton.Input
                        active
                        style={{
                            height: 32,
                            borderRadius: 6,
                            width: '100% !important',
                            display: 'inline-block',
                            minWidth: 'inherit !important'
                        }}
                    />
                </div>
            ))}
        </>
    )
}

interface PropsDefinition {
    scss: { [key: string]: string }
    navRef: Ref<HTMLUListElement>
    appLinks: AppLink[]
    isUserReady: boolean
    onHeaderClick: (event: MouseEvent<HTMLElement>) => void
    onShowSublinks: (nav: NavLink, index: number, click?: string) => void
    onSublinkMouseEnter?: (nav: NavLink) => void
    onSublinkMouseLeave?: (nav: NavLink) => void
}

const SidebarNav = ({
    scss,
    navRef,
    appLinks,
    isUserReady,
    onHeaderClick,
    onShowSublinks,
    onSublinkMouseEnter,
    onSublinkMouseLeave,
}: PropsDefinition) => {
    return (
        <nav className={scss.appSidebarLinks}>
            <ul className={scss.links} ref={navRef} onClick={onHeaderClick}>
                {!isUserReady ? (
                    <div style={{ width: '100%', overflow: 'hidden' }}>
                        <SidebarSkeleton />
                    </div>
                ) : (
                    appLinks.map((appLink, index) => (
                        <li
                            key={appLink.key}
                            onMouseEnter={() => onSublinkMouseEnter?.(appLink)}
                            onMouseLeave={() => onSublinkMouseLeave?.(appLink)}
                        >
                            <div
                                className={`${scss.mainLink} ${
                                    appLink.routeActive ? scss.isActive : ''
                                }`}
                            >
                                {appLink.url ? (
                                    <Link href={appLink.url} className={scss.link}>
                                        {appLink.icon && (
                                            <div
                                                className={scss.mainLinkIcon}
                                                style={{ width: `${appLink.iconWidth}px` }}
                                            >
                                                <span
                                                    className={scss.mainLinkIconMask}
                                                    style={maskIconStyle(`/svgs/master/${appLink.icon}`)}
                                                    role="img"
                                                    aria-label={appLink.name}
                                                />
                                            </div>
                                        )}
                                        <span className={scss.linkLabel}>{appLink.name}</span>
                                    </Link>
                                ) : (
                                    <button
                                        type="button"
                                        className={scss.link}
                                        onClick={() =>
                                            onShowSublinks(appLink, index, 'withoutLink')
                                        }
                                    >
                                        {appLink.icon && (
                                            <div
                                                className={scss.mainLinkIcon}
                                                style={{ width: `${appLink.iconWidth}px` }}
                                            >
                                                <span
                                                    className={scss.mainLinkIconMask}
                                                    style={maskIconStyle(`/svgs/master/${appLink.icon}`)}
                                                    role="img"
                                                    aria-label={appLink.name}
                                                />
                                            </div>
                                        )}
                                        <span className={scss.linkLabel}>{appLink.name}</span>
                                    </button>
                                )}

                                {appLink.children?.length ? (
                                    <button
                                        type="button"
                                        aria-expanded={appLink.active}
                                        className={`${scss.linkArrow} ${
                                            appLink.active
                                                ? scss.linkArrowOpen
                                                : scss.linkArrowClose
                                        }`}
                                        onClick={() =>
                                            onShowSublinks(appLink, index, 'withoutLink')
                                        }
                                    >
                                        <span
                                            className={scss.linkArrowMask}
                                            style={maskIconStyle('/svgs/master/arrowDown.svg')}
                                            role="img"
                                            aria-label="Toggle submenu"
                                        />
                                    </button>
                                ) : null}
                            </div>

                            {appLink.children?.length ? (
                                <ul
                                    className={`${scss.sublinks} ${
                                        appLink.active ? scss.open : scss.close
                                    } ${
                                        appLink.children.length <= 6
                                            ? scss[`has${[
                                                'Zero', 'One', 'Two', 'Three',
                                                'Four', 'Five', 'Six'
                                            ][appLink.children.length]}`]
                                            : ''
                                    }`}
                                >
                                    {appLink.children.map(sublink => (
                                        <li key={sublink.key}>
                                            <Link
                                                href={sublink.url || '#'}
                                                className={`${scss.link} ${
                                                    sublink.active ? scss.isActive : ''
                                                }`}
                                            >
                                                {sublink.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </li>
                    ))
                )}
            </ul>
        </nav>
    )
}

export default SidebarNav
