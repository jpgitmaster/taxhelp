import Link from 'next/link'
import Image from 'next/image'
import { Suspense, FC } from 'react'
import scss from './CMS_Layout.module.scss'
import Breadcrumbs from '@/components/reusables/BreadCrumbs'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import MasterController from '@/controllers/layouts/Master_C'
import { MastertProps } from '@/controllers/layouts/types/cms_types'

const CMS_Layout: FC<MastertProps> = ({ children }) => {
  const {
    ref,
    appLinks,
    isMobile,
    isPageLoad,
    activeLink,
    sessionUser,
    handleExpand,
    handleUserLogout,
    handleHeaderClick,
    handleShowSublinks
  } = MasterController()
  
  return (
    isPageLoad && 
    <>
      <div className={scss.app}>
        <aside className={scss.appSidebar+' '+(isMobile ? scss.slideLeft : scss.slideRight)} onClick={handleHeaderClick}>
          
          <button className={scss.sidebarArrow} onClick={handleExpand}>
            <Image src='/svgs/master/arrowDown.svg' alt='Arrow Left' priority width={20} height={20} unoptimized={true} />
          </button>
          <nav className={scss.appSidebarLinks}>
            <ul className={scss.links} ref={ref}>
              {
                appLinks.map((appLink, index) =>
                  <li key={index}>
                    <div className={scss.mainLink+' '+((appLink.key === activeLink[2]) ? scss.isActive : '')}>
                      {
                        appLink.url ?
                        <Link href={appLink.url} className={scss.link} onClick={() => handleShowSublinks(appLink, index)}>
                          {
                            appLink.icon &&
                            <div className={scss.mainLinkIcon} style={{width: appLink.iconWidth+'px'}}>
                              <Image src={'/svgs/master/'+appLink.icon} alt={appLink.name} priority width={20} height={20} unoptimized={true} />
                            </div>
                          }
                          <span>
                            {appLink.name}
                          </span>
                        </Link>
                        :
                        <div className={scss.link} onClick={() => handleShowSublinks(appLink, index)}>
                          {
                            appLink.icon &&
                            <div className={scss.mainLinkIcon} style={{width: appLink.iconWidth+'px'}}>
                              <Image src={'/svgs/master/'+appLink.icon} alt={appLink.name} priority width={20} height={20} unoptimized={true} />
                            </div>
                          }
                          <span>
                            {appLink.name}
                          </span>
                        </div>
                      }
                      {
                        appLink.children?.length &&
                        <div className={scss.linkArrow+' '+(appLink.active ? scss.linkArrowOpen : scss.linkArrowClose)} onClick={() => handleShowSublinks(appLink, index, 'withoutLink')}>
                          <Image src='/svgs/master/arrowDown.svg' alt='Slider' priority width={20} height={20} unoptimized={true} />
                        </div>
                      }
                    </div>
                    {
                        appLink.children?.length &&
                        <ul className={
                            scss.sublinks+' '+
                            (
                              (appLink.active ? scss.open : scss.close) +
                              (appLink.children?.length == 1 ? ' '+scss.hasOne : '') +
                              (appLink.children?.length == 2 ? ' '+scss.hasTwo : '') +
                              (appLink.children?.length == 3 ? ' '+scss.hasThree : '') +
                              (appLink.children?.length == 4 ? ' '+scss.hasFour : '') +
                              (appLink.children?.length == 5 ? ' '+scss.hasFive : '')
                            )}>
                          {
                            appLink.children?.map((sublink, indx) =>
                                <li key={indx}>
                                  <Link href={sublink.url} className={scss.link +(sublink.key === activeLink[3] ? ' '+scss.isActive : '')}>
                                    {sublink.name}
                                  </Link>
                                </li>
                            )
                          }
                        </ul>
                      }
                  </li>
                )
              }
            </ul>
          </nav>
        </aside>
        <Suspense fallback={<p>Loading page...</p>}>
          <main className={scss.appContent}>
            <div className={scss.appHeader}>
              <Link href='/' className={scss.logo}>
                <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} />
              </Link>
              <div className={scss.headerRight}>
                <div className={scss.sessionUser}>
                  {
                    sessionUser?.role?.color &&
                    <>
                      <div className={scss.avatar} style={{border: '1px solid rgba('+sessionUser?.role?.color+', .8)'}}>
                        <Avatar color={sessionUser?.role?.color} />
                      </div>
                      <div className={scss.sessionUserDetails}>
                        <h2>
                          {sessionUser.firstName} {sessionUser.lastName}
                        </h2>
                        <div className={scss.headerIcons}>
                          <div className={scss.headerIcon} style={{marginLeft: '-15px'}}>
                            <div className={scss.icon}>
                              <Image src={'/svgs/header/chat.svg'} alt='Chat' priority width={20} height={20} unoptimized={true} />
                            </div>
                          </div>
                          <div className={scss.headerIcon+' '+scss.mid}>
                            <div className={scss.icon}>
                              <Image src={'/svgs/header/notification.svg'} alt='Notification' priority width={20} height={20} unoptimized={true} />
                            </div>
                          </div>
                          <div className={scss.headerIcon+' '+scss.mid}>
                            <div className={scss.icon}>
                              <Image src={'/svgs/header/profile.svg'} alt='Profile' priority width={20} height={20} unoptimized={true} />
                            </div>
                          </div>
                          <div className={scss.headerIcon}>
                            <button type='button' className={scss.icon} onClick={handleUserLogout}>
                              <Image src={'/svgs/header/logout.svg'} alt='Profile' priority width={20} height={20} unoptimized={true} />
                            </button>
                          </div>
                        </div>
                        {/* <strong style={{color: 'rgba('+sessionUser?.role?.color+')'}}>
                          {sessionUser.role.name}
                        </strong> */}
                      </div>
                    </>
                  }
                </div>
                
              </div>
            </div>
            <div className={scss.appBody}>
              <Breadcrumbs scss={scss} />
              {children}
            </div>
          </main>
        </Suspense>
      </div>
    </>
  );
}
export default CMS_Layout