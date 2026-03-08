import { ReactNode } from 'react'
interface MastertProps {
    children: ReactNode
}
interface SessionUser{
  id: number
  email: string
  lastName: string
  firstName: string
  role: {
    name: string
    color: string
  }
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
  user?: SessionUser
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
    MastertProps
}