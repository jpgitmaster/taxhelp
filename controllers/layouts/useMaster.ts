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
    const [linksState, setLinksState] = useState<NavLink[]>([])
    // ✅ stable pathname split
    const activeLink = useMemo(() => {
        return pathname?.split('/') ?? []
    }, [pathname])

    const handleExpand = () => {
        setIsMobile(prev => !prev)
    }

    const handleShowSublinks = (nav: NavLink, indx: number, click?: string) => {
        if (!(isMobile || click === 'withoutLink')) return

        setLinksState(prev =>
            prev.map((link, index) =>
                index === indx
                    ? { ...link, active: !link.active }
                    : { ...link, active: false }
            )
        )
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
        if (typeof window !== 'undefined' && window.innerWidth < 800) {
            // NOTE: if needed, this should also be derived state, not mutation
        }
    }

    const ref = useOutsideClick(handleClickOutside)

    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation()
    }

    useEffect(() => {
        if (!isUserReady) return

        const baseLinks =
            user.app_type === 'custom'
                ? initCustomLinks
                : initDatLinks

        setLinksState(baseLinks)
    }, [isUserReady, user?.app_type])

    // ✅ FINAL: derived menu (NO STATE, NO EFFECT)
    const appLinks = useMemo(() => {
        if (!isUserReady) return [] // 👈 prevents wrong initial render

        const baseLinks =
            user.app_type === 'custom'
                ? initCustomLinks
                : initDatLinks

        return baseLinks.map((link) => {
            if (link.key === activeLink[2]) {
                return {
                    ...link,
                    active: true,
                    children: link.children?.map((sublink) => ({
                        ...sublink,
                        active: sublink.key === activeLink[3],
                    })),
                }
            }

            return { ...link, active: false }
        })
    }, [isUserReady, user?.app_type, activeLink])

    // page load (unchanged)
    useEffect(() => {
        if (typeof window !== 'undefined' && window.innerWidth < 800) {
            setIsMobile(true)
        }

        const timer = setTimeout(() => {
            setIsPageLoad(true)
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return {
        // STATES
        ref,
        user,
        appLinks: linksState,
        isMobile,
        isPageLoad,
        activeLink,
        isUserReady,

        // HANDLES
        userLogout,
        handleExpand,
        handleHeaderClick,
        handleShowSublinks,
    }
}

export default useMaster