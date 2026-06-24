import Link from 'next/link'
import { FC, ReactNode, useState } from 'react'
import scss from './styles/NoPermission.module.scss'
interface MastertProps {
    err?: string
    loading: boolean
    children: ReactNode
    featureType?: string
    hasPermission: boolean
}
const ProComponent: FC<MastertProps> = ({ err, loading, featureType, hasPermission, children }) => {
    const message = err === '404'
        ? {
            title: '404 - Page Not Found',
            caption: <>The URL you entered doesn't point to an active page.</>
        }
        : {
            title: 'Unlock This Feature',
            caption: (
                <>
                    You're currently using a plan that doesn't include this feature.
                    Upgrade to <strong>Tax<span>Help</span> {featureType || 'Pro'}</strong>
                    {' '}to access advanced tools designed to help you work faster and more efficiently.
                </>
            )
        };
    if(!loading){
        return false
    }
    if(!hasPermission){
        return (
            <div className={scss.box}>
                <div className={scss.card}>
                    <h3>
                    {message.title}
                    </h3>
                    
                    <p className={scss.caption}>
                        {message.caption}
                    </p>
                    <br />
                    {
                        !err &&
                        <Link href='/bookkeeper/subscription/plans' className={scss.button+' '+scss.btnorange}>
                            Compare Plans & Upgrade
                        </Link>
                    }
                </div>
            </div>
        )
    }
    return (
        <div>
            {children}
        </div>
    );
}
export default ProComponent