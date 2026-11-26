import { usePathname } from 'next/navigation'
import useQueryUsers from '../users/api/queries'
import useMutationUsers from '../users/api/mutations'
import { useState, useEffect, useRef, MouseEvent, useMemo } from 'react'
import { NavLink } from '@/controllers/layouts/types/cms_types'
import { initDatLinks, initCustomLinks } from '@/controllers/layouts/states/cms_states'

const useMaster = () => {
    const { getUser } = useQueryUsers()
    const { userLogout } = useMutationUsers()

    const pathname = usePathname()
    const { data: user } = getUser()
    const isUserReady = !!user?.app_type

    const [isMobileViewport, setIsMobileViewport] = useState(false)
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [isPageLoad, setIsPageLoad] = useState(false)
    const [expandedKey, setExpandedKey] = useState<string | null>(null)
    const [suppressDrawerTransition, setSuppressDrawerTransition] = useState(true)
    const wasMobileViewport = useRef(false)
    const bodyRef = useRef<HTMLDivElement>(null)

    const activeLink = useMemo(
        () => pathname?.split('/') ?? [],
        [pathname]
    )

    const isRouteActive = (url?: string) => {
        if (!url) return false
        return pathname === url || pathname.startsWith(`${url}/`)
    }

    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearCloseTimer = () => {
        if (closeTimer.current) {
            clearTimeout(closeTimer.current)
            closeTimer.current = null
        }
    }

    const handleExpand = () => {
        clearCloseTimer()
        if (isMobileViewport) {
            setIsDrawerOpen(prev => {
                const next = !prev
                if (!next) setExpandedKey(null)
                return next
            })
        } else {
            setIsCollapsed(prev => {
                const next = !prev
                if (next) setExpandedKey(null)
                return next
            })
        }
    }

    const closeDrawer = () => {
        clearCloseTimer()
        setIsDrawerOpen(false)
        setExpandedKey(null)
    }

    const handleShowSublinks = (
        nav: NavLink,
        _indx: number,
        click?: string
    ) => {
        if (click !== 'withoutLink') return

        clearCloseTimer()
        setExpandedKey(prev => prev === nav.key ? null : nav.key)
    }

    const isIconRail = isCollapsed && !isMobileViewport

    const handleSublinkMouseEnter = (nav: NavLink) => {
        if (!isIconRail || !nav.children?.length) return
        clearCloseTimer()
        setExpandedKey(nav.key)
    }

    const handleSublinkMouseLeave = (nav: NavLink) => {
        if (!isIconRail) return
        clearCloseTimer()
        closeTimer.current = setTimeout(() => {
            setExpandedKey(prev => prev === nav.key ? null : prev)
        }, 300)
    }

    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLUListElement>(null)

        useEffect(() => {
            const handleClick = () => callback()

            document.addEventListener('click', handleClick)
            return () => document.removeEventListener('click', handleClick)
        }, [callback])

        return ref
    }

    const handleClickOutside = () => {
        // Keep current behavior; add outside-click closing here if needed.
    }

    const ref = useOutsideClick(handleClickOutside)

    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    const appLinks = useMemo(() => {
        if (!isUserReady) return []

        const baseLinks =
            user.app_type === 'custom'
                ? initCustomLinks
                : initDatLinks

        return baseLinks.map(link => {
            const children = link.children?.map(child => ({
                ...child,
                active: isRouteActive(child.url),
            }))

            const childIsActive =
                children?.some(child => child.active) ?? false

            const routeActive =
                isRouteActive(link.url) || childIsActive

            return {
                ...link,
                active: expandedKey === link.key,
                routeActive,
                children,
            }
        })
    }, [isUserReady, user?.app_type, pathname, expandedKey])

    const breadcrumb = useMemo(() => {
        if (pathname?.startsWith('/bookkeeper/profile')) {
            return {
                icon: '/svgs/header/profile.svg',
                items: [{ label: 'Profile', url: undefined }],
            }
        }

        if (pathname?.startsWith('/bookkeeper/subscription')) {
            return {
                icon: '/svgs/header/subscription.svg',
                items: [{ label: 'Subscription', url: undefined }],
            }
        }

        const activeParent = appLinks.find(link => link.routeActive)
        const activeChild = activeParent?.children?.find(child => child.active)

        if (activeParent) {
            const items = [
                { label: activeParent.name, url: activeParent.url },
                ...(activeChild ? [{ label: activeChild.name, url: activeChild.url }] : []),
            ]
            return { icon: `/svgs/master/${activeParent.icon}`, items }
        }

        const segments = (pathname ?? '').split('/').filter(Boolean)
        const last = segments[segments.length - 1] ?? ''
        const decoded = decodeURIComponent(last)
        const clean = decoded.startsWith('[') && decoded.endsWith(']')
            ? decoded.slice(1, -1)
            : decoded

        const label = clean
            .replace(/_/g, ' ')
            .replace(/-/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')

        return { icon: undefined, items: [{ label, url: undefined }] }
    }, [appLinks, pathname])

    useEffect(() => {
        return () => clearCloseTimer()
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        const checkViewport = () => {
            const mobile = window.innerWidth < 800

            if (mobile && !wasMobileViewport.current) {
                // Entering mobile: snap the drawer shut instantly, no slide animation.
                setSuppressDrawerTransition(true)
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => setSuppressDrawerTransition(false))
                })
            }
            wasMobileViewport.current = mobile

            setIsMobileViewport(mobile)
            if (mobile) {
                setIsCollapsed(false)
                setIsDrawerOpen(false)
                setExpandedKey(null)
                clearCloseTimer()
            }
        }
        checkViewport()
        window.addEventListener('resize', checkViewport)

        const timer = setTimeout(() => setIsPageLoad(true), 100)
        return () => {
            window.removeEventListener('resize', checkViewport)
            clearTimeout(timer)
        }
    }, [])

    // Close the mobile drawer whenever the route changes
    useEffect(() => {
        setIsDrawerOpen(false)
    }, [pathname])

    // Scroll the content area back to the top on every route change
    useEffect(() => {
        bodyRef.current?.scrollTo(0, 0)
    }, [pathname])

    // Automatically expand the parent matching the current route
    useEffect(() => {
        if (!isUserReady) return

        const baseLinks =
            user.app_type === 'custom'
                ? initCustomLinks
                : initDatLinks

        const matchingParent = baseLinks.find(link =>
            link.children?.some(child => isRouteActive(child.url))
        )

        setExpandedKey(matchingParent?.key ?? null)
    }, [isUserReady, user?.app_type, pathname])

    return {
        ref,
        bodyRef,
        user,
        appLinks,
        isCollapsed,
        isDrawerOpen,
        isMobileViewport,
        suppressDrawerTransition,
        breadcrumb,
        isPageLoad,
        activeLink,
        isUserReady,
        userLogout,
        closeDrawer,
        handleExpand,
        handleHeaderClick,
        handleShowSublinks,
        handleSublinkMouseEnter,
        handleSublinkMouseLeave,
    }
}

export default useMaster