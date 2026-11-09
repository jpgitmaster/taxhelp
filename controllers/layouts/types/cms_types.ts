import { ReactNode } from 'react'
interface MasterProps {
  children: ReactNode
  /** Extra top/bottom breathing room in the content area — opt in per page
   * via `Component.getLayout` instead of changing every page's spacing. */
  spacious?: boolean
}
interface SessionUser{
  id: string
  email: string
}
interface NavLink {
  url: string
  key: string
  name: string
  icon: string
  active: boolean
  iconWidth: number
  children?: {
    key: string
    url: string
    name: string
    active: boolean
  }[]
}
interface Session {
  error?: string
  user?: SessionUser
  tokenType: string
  accessToken: string
  refreshToken: string
}
interface PageProps {
  session: Session | null
}
export type {
    NavLink,
    Session,
    PageProps,
    SessionUser,
    MasterProps
}