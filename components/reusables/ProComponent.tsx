import Link from 'next/link'
import { FC, ReactNode } from 'react'
import scss from './styles/NoPermission.module.scss'
interface MastertProps {
    loading: boolean
    children: ReactNode
    featureType?: string
    hasPermission: boolean
}
const ProComponent: FC<MastertProps> = ({ loading, featureType, hasPermission, children }) => {
    if(!loading){
        return false
    }
    if(!hasPermission){
        return (
            <div className={scss.box}>
                <div className={scss.card}>
                    <h3>
                    Unlock This Feature
                    </h3>
                    
                    <p className={scss.caption}>
                        You're currently using a plan that doesn't include this feature. Upgrade to <strong>Tax<span>Help</span> {featureType ? featureType : 'Pro'}</strong> to access advanced tools designed to help you work faster and more efficiently.
                    </p>
                    <br />
                    <Link href='/bookkeeper/subscription/plans' className={scss.button+' '+scss.btnorange}>
                        Compare Plans & Upgrade
                    </Link>
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