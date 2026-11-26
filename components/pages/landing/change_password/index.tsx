import Image from 'next/image';
import scss from './styles/ChangePassword.module.scss';
import LandingModal from '@/components/pages/landing/landing_modal';
import { initStatus } from '@/controllers/global/states';
import Loader from '@/components/reusables/RotatingLoader';
import useResetPassword from '@/controllers/users/useResetPassword';
import PasswordCheckList from '@/components/pages/landing/register/PasswordCheckList';

interface PropsDefinition {
    displayModal: {
        change_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}

const LandingChangePasswordModal = ({
    toggleModal,
    displayModal,
}: PropsDefinition) => {
    const {
        user,
        status,
        initUser,
        passwordChecker,
        displayPassword,

        setUser,
        setStatus,
        setPasswordChecker,
        setDisplayPassword,

        handleBlur,
        handleChange,
        handleResubmit,
        handleResetPassword
    } = useResetPassword()
    const { loader, message, submessage } = status

    const closeAndReset = () => {
        setUser(initUser)
        setStatus(initStatus)
        toggleModal(false, 'change_password')
    }

    return (
        <LandingModal
            open={displayModal.change_password}
            width={460}
            onCancel={closeAndReset}
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
                            closeAndReset()
                            toggleModal(true, 'login')
                        }}>
                        Login Now
                        </button>
                    </div>
                </div>
                :
                <div className={scss.changePasswordModal}>
                    <div className={scss.title}>
                        <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.titleLogo} />
                        <strong>Set a new password</strong>
                        <p>Choose a strong password you haven&rsquo;t used before.</p>
                    </div>

                    <form className={scss.changePasswordForm} onSubmit={handleResetPassword}>
                        { loader && <Loader scss={scss} position='absolute' />}

                        <div className={scss.field + (user.userErr.newPassword ? ' '+scss.err : '')}>
                            <label htmlFor="changeNewPassword">New Password</label>
                            <input
                                maxLength={50}
                                autoComplete='off'
                                name='newPassword'
                                id="changeNewPassword"
                                value={user.userObj.newPassword}
                                type={displayPassword ? 'text' : 'password'}
                                placeholder='Enter New Password'
                                onKeyUp={handleBlur}
                                onChange={handleChange}
                                onFocus={() => setPasswordChecker(true)}
                                onBlur={() => setPasswordChecker(false)}
                            />
                            <button type='button' className={scss.eyecon} aria-label={displayPassword ? 'Hide password' : 'Show password'} onClick={() => setDisplayPassword(prevState => !prevState)}>
                                <Image src={'/svgs/'+(displayPassword ? 'eyecon_check.svg' : 'eyecon.svg')} alt='Show Password' width={20} height={20} />
                            </button>
                            {
                                user.userErr.newPassword &&
                                <small>{user.userErr.newPassword as string}</small>
                            }
                            {
                            passwordChecker &&
                                <PasswordCheckList
                                    scss={scss}
                                    value={String(user.userObj.newPassword)}
                                />
                            }
                        </div>

                        <div className={scss.field + (user.userErr.confirmNewPassword ? ' '+scss.err : '')}>
                            <label htmlFor="changeConfirmNewPassword">Confirm New Password</label>
                            <input
                                type='password'
                                maxLength={50}
                                autoComplete='off'
                                name='confirmNewPassword'
                                id="changeConfirmNewPassword"
                                value={user.userObj.confirmNewPassword}
                                placeholder='Confirm New Password'
                                onKeyUp={handleBlur}
                                onChange={handleChange}
                            />
                            {
                                user.userErr.confirmNewPassword &&
                                <small>{user.userErr.confirmNewPassword as string}</small>
                            }
                        </div>

                        <button type='submit' className={scss.btnblue} onKeyDown={handleResubmit}>
                            Change Password
                        </button>
                    </form>
                </div>
            }
        </LandingModal>
    )
}

export default LandingChangePasswordModal;
