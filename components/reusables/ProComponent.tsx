import { FC, ReactNode } from 'react'
import scss from './styles/NoPermission.module.scss'
interface MastertProps {
    loading: boolean
    children: ReactNode
    hasPermission: boolean
}
const ProComponent: FC<MastertProps> = ({ loading, hasPermission, children }) => {
    if(!loading){
        return false
    }
    if(!hasPermission){
        return (
            <div className={scss.box}>
                <div className={scss.card}>
                    <h3>
                    Upgrade Required...
                    </h3>
                    
                    <p className={scss.caption}>
                        This feature is available exclusively for <strong>Tax<span>Help</span> Pro</strong> subscribers. Upgrade your plan to access premium tools and advanced features.
                    </p>
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