import Link from 'next/link';
import { Modal } from 'antd';
import useLogin from '@/controllers/users/useLogin';
import scss from './styles/ForgotPassword.module.scss';
import { initStatus } from '@/controllers/global/states';
import Loader from '@/components/reusables/RotatingLoader';
import CustomContainer from '@/components/reusables/CustomContainer';

interface PropsDefinition {
    displayModal: {
        registration: boolean
        forgot_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}
const ForgotPassword_V = ({
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
        <Modal
            footer={null}
            open={displayModal.forgot_password}
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
                        <button className={`${scss.button} ${scss.btnblue}`} type='button' onClick={() => {
                            setUser(initUser)
                            setStatus(initStatus)
                            toggleModal(false, 'forgot_password')
                        }}>
                        Ok
                        </button>
                    </div>
                </div>
                :
                <>
                    <div className={scss.modelTitle}>
                        <strong>
                            Reset your password
                        </strong>
                        <p>
                            Please provide the email address that you used when you signed up for your account. If you forgot your email, please <Link href='#contactus' onClick={() => toggleModal(false, 'forgot_password')}>contact us</Link>.
                        </p>
                    </div>
                    <form className={scss.resetUserPassword} onSubmit={handleForgotPassword}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.cards}>
                            <CustomContainer
                                scss={scss}
                                width={100}
                                required={true}
                                label='Email'
                                labelFor='email'
                                err={user.userErr.email as string}
                            >
                                <input
                                    type='text'
                                    name='email'
                                    maxLength={30}
                                    autoComplete='off'
                                    value={user.userObj.email}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                            </CustomContainer>
                            <div className={scss.card+' '+scss.w100}>
                                <button type='submit' className={`${scss.button} ${scss.btnblue}`}>
                                    Reset Password
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            }
            
        </Modal>
    )
}
export default ForgotPassword_V;