import { FC } from 'react'
import scss from './CMS_Layout.module.scss'
import SidebarNav from './SidebarNav'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'
import SidebarBrand from './SidebarBrand'
import useMaster from '@/controllers/layouts/useMaster'
import { MasterProps } from '@/controllers/layouts/types/cms_types'

const CMS_Layout: FC<MasterProps> = ({ children, spacious }) => {
  const {
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
    isUserReady,
    userLogout,
    closeDrawer,
    handleExpand,
    handleHeaderClick,
    handleShowSublinks,
    handleSublinkMouseEnter,
    handleSublinkMouseLeave
  } = useMaster()

  const sidebarClassName = isMobileViewport
    ? `${scss.appSidebar} ${scss.mobileDrawer} ${isDrawerOpen ? scss.drawerOpen : scss.drawerClosed} ${suppressDrawerTransition ? scss.noTransition : ''}`
    : `${scss.appSidebar} ${isCollapsed ? scss.slideLeft : scss.slideRight}`

  return (
    isPageLoad &&
    <div className={scss.app}>
      {isMobileViewport && isDrawerOpen && (
        <div className={scss.drawerBackdrop} onClick={closeDrawer} />
      )}
      <aside className={sidebarClassName} onClick={handleHeaderClick}>
        <SidebarBrand scss={scss} />

        <SidebarNav
          scss={scss}
          navRef={ref}
          appLinks={appLinks}
          isUserReady={isUserReady}
          onHeaderClick={handleHeaderClick}
          onShowSublinks={handleShowSublinks}
          onSublinkMouseEnter={handleSublinkMouseEnter}
          onSublinkMouseLeave={handleSublinkMouseLeave}
        />
      </aside>
      <main className={scss.appContent}>
        <AppHeader
          scss={scss}
          user={user}
          breadcrumb={breadcrumb}
          onToggleSidebar={handleExpand}
          onLogout={userLogout}
        />
        <div ref={bodyRef} className={scss.appBody + (spacious ? ' ' + scss.appBodySpacious : '')}>
          <div className={scss.appBodyContent}>
            {children}
          </div>
          <AppFooter scss={scss} />
        </div>
      </main>
    </div>
  );
}
export default CMS_Layout
