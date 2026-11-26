import Link from 'next/link';
import Image from 'next/image';
import useLogin from '@/controllers/users/useLogin';
import scss from './styles/ForgotPassword.module.scss';
import LandingModal from '@/components/pages/landing/landing_modal';
import { initStatus } from '@/controllers/global/states';
import Loader from '@/components/reusables/RotatingLoader';

interface PropsDefinition {
    displayModal: {
        registration: boolean
        forgot_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}
const LandingForgotPasswordModal = ({
    toggleModal,
    displayModal,
}: PropsDefinition) => {
    const {
        user,
        status,
        initUser,

        setUser,
        setStatus,

        handleBlur,
        handleChange,
        handleForgotPassword
    } = useLogin()
    const { loader, message, submessage } = status
    return (
        <LandingModal
            open={displayModal.forgot_password}
            width={460}
            onCancel={() => {
                setUser(initUser)
                toggleModal(false, 'forgot_password')
            }}
        >
            {
                message ?
                <div className={scss.success}>
                    <div className={scss.successCheck}>
                        <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
                            <circle className={`${scss.path} ${scss.circle}`} fill='none' stroke='#14b11c' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
                            <polyline className={`${scss.path} ${scss.check}`} fill='none' stroke='#14b11c' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' points='100.2,40.2 51.5,88.8 29.8,67.5 ' />
                        </svg>
                    </div>
                    <div className={scss.successMessage}>
                        <h4>{message}</h4>
                        <p>{submessage}</p>
                        <button className={scss.successClose} type='button' onClick={() => {
                            setUser(initUser)
                            setStatus(initStatus)
                            toggleModal(false, 'forgot_password')
                        }}>
                        Close
                        </button>
                    </div>
                </div>
                :
                <>
                    <div className={scss.modelTitle}>
                        <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.modelTitleLogo} />
                        <strong>
                            Reset your password
                        </strong>
                        <p>
                            Please provide the email address that you used when you signed up for your account. If you forgot your email, please <Link href='#contactus' onClick={() => toggleModal(false, 'forgot_password')}>contact us</Link>.
                        </p>
                    </div>
                    <form className={scss.resetUserPassword} onSubmit={handleForgotPassword}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.field + (user.userErr.email ? ' '+scss.err : '')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type='text'
                                name='email'
                                id='email'
                                maxLength={30}
                                autoComplete='off'
                                placeholder='Enter Email'
                                value={user.userObj.email}
                                onKeyUp={handleBlur}
                                onChange={handleChange}
                            />
                            {
                                user.userErr.email &&
                                <small>{user.userErr.email as string}</small>
                            }
                        </div>
                        <button type='submit' className={scss.btnblue}>
                            Reset Password
                        </button>

                        <div className={scss.resetLinks}>
                            <button type='button' onClick={() => {
                                setUser(initUser)
                                toggleModal(true, 'login')
                            }}>
                                Already have an account? <span>Login</span>
                            </button>
                        </div>
                    </form>
                </>
            }

        </LandingModal>
    )
}
export default LandingForgotPasswordModal;