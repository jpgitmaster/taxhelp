import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { useState, useEffect, useRef, MouseEvent } from 'react'
import { initLinks } from '@/controllers/layouts/states/cms_states'
import { NavLink, SessionUser } from '@/controllers/layouts/types/cms_types'

const MasterController = () => {
    const session = useSession()
    const pathname = usePathname()
    const activeLink = pathname?.split('/')
    const [isMobile, setIsMobile] = useState(false)
    const [isPageLoad, setIsPageLoad] = useState(false)
    const sessionUser = session.data?.user as SessionUser
    const [appLinks, setAppLinks] = useState<NavLink[]>([])
    
    const handleExpand = () => {
        setIsMobile(prevState => !prevState)
    }
    const handleUserLogout = async () => {
        return await signOut({redirect: true, callbackUrl: '/login'});
    }
    const handleShowSublinks = (nav: NavLink, indx: number, click?: string) => {
        if(isMobile || click === 'withoutLink'){
            const toggleActive = initLinks.map((link: NavLink, index: number) =>
                index === indx ?
                {
                    ...link,
                    active: !nav.active
                }
                : {
                    ...link,
                    active: false
                }
            )
            setAppLinks(toggleActive)
        }
    }
    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLUListElement>(null)
      
        useEffect(() => {
          const handleClick = () => {
            callback();
          };
      
          document.addEventListener('click', handleClick);
      
          return () => {
            document.removeEventListener('click', handleClick);
          };
        }, [callback]);
      
        return ref;
    };
    const handleClickOutside = () => {
        if (typeof window !== 'undefined') {
            if(window.innerWidth < 800){
                const closeAllSublinks = initLinks.map((link: NavLink) =>
                (
                    {
                        ...link,
                        active: false
                    }
                ))
                setAppLinks(closeAllSublinks)
            }
        }
        
    };
    const ref = useOutsideClick(handleClickOutside)
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    }
    useEffect(() => {
        const setActiveLinks = initLinks.map((link) => {
            if (link.key === activeLink[2]) {
                const setActiveSublink = link.children?.map((sublink) =>
                    sublink.key === activeLink[3]
                        ? { ...sublink, active: true }
                        : sublink
                )

                return {
                    ...link,
                    active: true,
                    children: setActiveSublink
                }
            }

            return link
        })
        setAppLinks(setActiveLinks)

        if (typeof window !== 'undefined') {
            if(window.innerWidth < 800){
            setIsMobile(true)
            }
        }
        const timer = setTimeout(() => {
            setIsPageLoad(true)
        }, 100)
        return () => clearTimeout(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return {
        // STATES
        ref,
        appLinks,
        isMobile,
        isPageLoad,
        activeLink,
        sessionUser,
        // SET STATES

        // HANDLES
        handleExpand,
        handleUserLogout,
        handleHeaderClick,
        handleShowSublinks,
    }
}

export default MasterController;