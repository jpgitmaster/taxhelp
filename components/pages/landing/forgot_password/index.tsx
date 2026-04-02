import Link from 'next/link';
import { Modal } from 'antd';
import useLogin from '@/controllers/users/useLogin';
import scss from './styles/ForgotPassword.module.scss';
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

        handleBlur,
        handleChange,
        handleUserLogin
    } = useLogin()
    const { loader } = status
    return (
        <Modal
            footer={null}
            open={displayModal.forgot_password}
            onCancel={() => toggleModal(false, 'forgot_password')}
        >
            <div className={scss.modelTitle}>
                <strong>
                    Reset your password
                </strong>
                <p>
                    Please provide the email address that you used when you signed up for your account. If you forgot your email, please <Link href=''>contact us</Link>.
                </p>
            </div>
            <form className={scss.resetUserPassword} onSubmit={handleUserLogin}>
                { loader && <Loader scss={scss} position='absolute' />}
                <div className={scss.cards}>
                    <CustomContainer
                        scss={scss}
                        width={100}
                        required={true}
                        label='Password'
                        labelFor='password'
                        err={user.userErr.password as string}
                    >
                        <input
                        name='password'
                        maxLength={20}
                        type='password'
                        autoComplete='off'
                        placeholder='*******'
                        value={user.userObj.password}
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
        </Modal>
    )
}
export default ForgotPassword_V;