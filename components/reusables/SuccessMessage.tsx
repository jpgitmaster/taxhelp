import { ReactNode } from 'react';
import scss from './styles/SuccessMessage.module.scss';
interface PropsDefinition {
    message: string | ReactNode
}
const SuccessMessage = (props: PropsDefinition) => {
    const { message } = props
    return (
        <div className={scss.success}>
            <div className={scss.successCheck}>
                <svg
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 130.2 130.2"
                >
                <circle
                    className={scss.path+' '+scss.circle}
                    fill="none"
                    stroke="#000"
                    strokeWidth="8"
                    strokeMiterlimit="12"
                    cx="65.1"
                    cy="65.1"
                    r="60.1"
                />
                <polyline
                    className={`${scss.path} ${scss.check}`}
                    fill="none"
                    stroke="#000"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeMiterlimit="12"
                    points="100.2,40.2 51.5,88.8 29.8,67.5 "
                />
                </svg>
            </div>
            <div className={scss.successMessage}>
                {message}
            </div>
        </div>
    )
}
export default SuccessMessage;