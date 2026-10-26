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

    const [isMobile, setIsMobile] = useState(false)
    const [isPageLoad, setIsPageLoad] = useState(false)
    const [expandedKey, setExpandedKey] = useState<string | null>(null)

    const activeLink = useMemo(
        () => pathname?.split('/') ?? [],
        [pathname]
    )

    const isRouteActive = (url?: string) => {
        if (!url) return false
        return pathname === url || pathname.startsWith(`${url}/`)
    }

    const handleExpand = () => {
        setIsMobile(prev => !prev)
    }

    const handleShowSublinks = (
        nav: NavLink,
        indx: number,
        click?: string
    ) => {
        if (!(isMobile || click === 'withoutLink')) return

        setExpandedKey(prev => prev === nav.key ? null : nav.key)
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

    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 800) {
            setIsMobile(true)
        }

        const timer = setTimeout(() => setIsPageLoad(true), 100)
        return () => clearTimeout(timer)
    }, [])

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
        user,
        appLinks,
        isMobile,
        isPageLoad,
        activeLink,
        isUserReady,
        userLogout,
        handleExpand,
        handleHeaderClick,
        handleShowSublinks,
    }
}

export default useMaster