import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from 'antd'
import scss from './CMS_Layout.module.scss'
import { Dropdown, type MenuProps } from 'antd'
import useMaster from '@/controllers/layouts/useMaster'
import Breadcrumbs from '@/components/reusables/BreadCrumbs'
import Avatar from '@/components/reusables/AvatarPlaceholder'
import NotificationBell from '@/components/reusables/NotificationBell'
import { MasterProps } from '@/controllers/layouts/types/cms_types'

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
const CMS_Layout: FC<MasterProps> = ({ children }) => {
  const {
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
    handleShowSublinks
  } = useMaster()
  const linkItems = (): MenuProps['items'] => [
		{
			key: '1',
			label: (
			<Link href={'/bookkeeper/profile/edit'} className={scss.actionItem}>
				Edit Profile
			</Link>
			),
		},
    // {
		// 	key: '2',
		// 	label: (
		// 	<Link href={''} className={scss.actionItem}>
		// 		Account Settings
		// 	</Link>
		// 	),
		// },
		// {
		// 	key: '3',
		// 	label: (
		// 	<Link href={''} className={scss.actionItem}>
		// 		Change Password
		// 	</Link>
		// 	),
		// },
    {
      key: '4',
      label: (
        <Link href={'/bookkeeper/subscription'} className={scss.actionItem}>
          Manage Subscription
        </Link>
      ),
    },
	];
  // console.log(user?.subscription?.plan)
  return (
    isPageLoad &&
    <div className={scss.app}>
      <aside className={scss.appSidebar+' '+(isMobile ? scss.slideLeft : scss.slideRight)} onClick={handleHeaderClick}>
        
        <button className={scss.sidebarArrow} onClick={handleExpand}>
          <Image src='/svgs/master/arrowDown.svg' alt='Arrow Left' priority width={20} height={20} unoptimized={true} />
        </button>
        <nav className={scss.appSidebarLinks}>
          <ul
              className={scss.links}
              ref={ref}
              onClick={handleHeaderClick}
          >
              {!isUserReady ? (
                  <div style={{ width: '100%', overflow: 'hidden' }}>
                      <SidebarSkeleton />
                  </div>
              ) : (
                  appLinks.map((appLink, index) => (
                      <li key={appLink.key}>
                          <div
                              className={`${scss.mainLink} ${
                                  appLink.routeActive ? scss.isActive : ''
                              }`}
                          >
                              {appLink.url ? (
                                  <Link
                                      href={appLink.url}
                                      className={scss.link}
                                  >
                                      {appLink.icon && (
                                          <div
                                              className={scss.mainLinkIcon}
                                              style={{ width: `${appLink.iconWidth}px` }}
                                          >
                                              <Image
                                                  src={`/svgs/master/${appLink.icon}`}
                                                  alt={appLink.name}
                                                  priority
                                                  width={20}
                                                  height={20}
                                                  unoptimized
                                              />
                                          </div>
                                      )}
                                      <span>{appLink.name}</span>
                                  </Link>
                              ) : (
                                  <button
                                      type="button"
                                      className={scss.link}
                                      onClick={() =>
                                          handleShowSublinks(appLink, index, 'withoutLink')
                                      }
                                  >
                                      {appLink.icon && (
                                          <div
                                              className={scss.mainLinkIcon}
                                              style={{ width: `${appLink.iconWidth}px` }}
                                          >
                                              <Image
                                                  src={`/svgs/master/${appLink.icon}`}
                                                  alt={appLink.name}
                                                  priority
                                                  width={20}
                                                  height={20}
                                                  unoptimized
                                              />
                                          </div>
                                      )}
                                      <span>{appLink.name}</span>
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
                                          handleShowSublinks(appLink, index, 'withoutLink')
                                      }
                                  >
                                      <Image
                                          src="/svgs/master/arrowDown.svg"
                                          alt="Toggle submenu"
                                          width={20}
                                          height={20}
                                          unoptimized
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
      </aside>
      <main className={scss.appContent}>
        <div className={scss.appHeader}>
          <Link href='/' className={scss.logo}>
            <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} />
          </Link>
          <div className={scss.headerRight}>
            <div className={scss.sessionUser}>
              <Link href='/bookkeeper/profile' className={scss.avatar}>
                <Avatar color={''} />
              </Link>
              <div className={scss.sessionUserDetails}>
                
                <h2>
                  {(user?.first_name && user?.last_name) ? user?.first_name+' '+user?.last_name: user?.email} &nbsp;
                </h2>
                <div className={scss.headerIcons}>
                  <div className={scss.headerIcon}>
                    <Link href='/bookkeeper/subscription' className={scss.icon+' '+scss.subscriptionStatus +' '+ (user?.subscription?.plan === 'pro' ? scss.pro : user?.subscription?.plan === 'basic' ? scss.basic : user?.subscription?.plan === 'enterprise' ? scss.enterprise : '')}>
                      {user?.subscription?.plan}
                    </Link>
                  </div>
                  {/* <div className={scss.headerIcon}>
                    <div className={scss.icon}>
                      <Image src={'/svgs/header/chat.svg'} alt='Chat' priority width={20} height={20} unoptimized={true} />
                    </div>
                  </div> */}
                  <div className={scss.headerIcon+' '+scss.active}>
                    <Dropdown 
                      menu={{ items: linkItems() }}
                      placement="bottomRight" trigger={['click']}
                    >
                      <button type='button' className={scss.icon}>
                        <Image src={'/svgs/header/profile.svg'} alt='Profile' priority width={20} height={20} unoptimized={true} />
                      </button>
                    </Dropdown>
                  </div>
                  <div className={scss.headerIcon+' '+scss.notif}>
                    <NotificationBell scss={scss} />
                  </div>
                  <div className={scss.headerIcon+' '+scss.logout}>
                    <button type='button' className={scss.icon} onClick={userLogout}>
                      <Image src={'/svgs/header/logout.svg'} alt='Profile' priority width={20} height={20} unoptimized={true} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={scss.appBody}>
          <Breadcrumbs scss={scss} />
          {children}
        </div>
      </main>
    </div>
  );
}
export default CMS_Layout