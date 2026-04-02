import { Modal } from 'antd';
import Image from 'next/image';
import scss from './styles/Register.module.scss';
import PasswordCheckList from './PasswordCheckList';
import { initStatus } from '@/controllers/global/states';
import useRegister from '@/controllers/users/useRegister';
import Loader from '@/components/reusables/RotatingLoader';
import CustomContainer from '@/components/reusables/CustomContainer';
interface PropsDefinition {
    displayModal: {
        registration: boolean
        forgot_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}
const Register_V = ({
    toggleModal,
    displayModal,
}: PropsDefinition) => {
    const {
        user,
        roles,
        status,
        initUser,
        checkedRoles,
        displayPassword,
        passwordChecker,

        setUser,
        setStatus,
        setCheckedRoles,
        setDisplayPassword,
        setPasswordChecker,

        handleBlur,
        handleChange,
        handleRegisterUser,
        handleCheckedRoles,
    } = useRegister()
    const { loader, message, submessage } = status
    return (
        <Modal
            footer={null}
            open={displayModal.registration}
            onCancel={() => {
                setUser(initUser)
                setCheckedRoles([])
                toggleModal(false, 'registration')
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
                            setCheckedRoles([])
                            setStatus(initStatus)
                            toggleModal(false, 'registration')
                        }}>
                        Ok
                        </button>
                    </div>
                </div>
                :
                <>
                    <div className={scss.modelTitle}>
                        <strong>
                            Tell us who you are
                        </strong>
                        <p>
                            Choose your role to get the right tools and experience.
                        </p>
                    </div>
                    <ul className={scss.userTypes}>
                        {
                            roles.map((role, index) => (
                                <li key={index}>
                                    <label className={scss.userType + (checkedRoles.includes(role.value) ? ' '+scss.checked : '')}>
                                        <Image src={'/svgs/'+role.icon} alt="Business Owner" width={20} height={20} unoptimized={true} />
                                        <div>
                                            <strong>
                                            {role.label}
                                            </strong>
                                            <p>
                                            {role.description}
                                            </p>
                                        </div>
                                        <input type='checkbox'
                                            name='user_account'
                                            onKeyUp={handleBlur}
                                            value={role.value}
                                            checked={checkedRoles.includes(role.value)}
                                            onChange={handleCheckedRoles}
                                        />
                                        <span className={scss.checkmark}></span>
                                    </label>
                                </li>
                            ))
                        }
                    </ul>
                    <form className={scss.registerUser} onSubmit={handleRegisterUser}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.cards}>
                            <CustomContainer
                                width={100}
                                scss={scss}
                                required={true}
                                label='Email'
                                labelFor='email'
                                disabled={!checkedRoles?.length}
                                err={user.userErr.email as string}
                            >
                                <input
                                    type='text'
                                    name='email'
                                    maxLength={100}
                                    autoComplete='off'
                                    value={user.userObj.email}
                                    placeholder='johndoe@gmail.com'
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                            </CustomContainer>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                required={true}
                                label='Password'
                                labelFor='password'
                                disabled={!checkedRoles?.length}
                                err={user.userErr.password as string}
                                className={
                                    typeof user.userErr.password === 'string' && user.userErr.password.length > 50
                                        ? scss.longErr
                                        : ''
                                    }>
                                <input
                                    name='password'
                                    maxLength={20}
                                    autoComplete='off'
                                    placeholder='*******'
                                    value={user.userObj.password}
                                    type={displayPassword ? 'text' : 'password'}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    onFocus={() => setPasswordChecker(true)}
                                    onBlur={() => setPasswordChecker(false)}
                                />
                                <button type='button' className={scss.eyecon + (displayPassword ? ' '+scss.show : '')} onClick={() => setDisplayPassword(prevState => !prevState)}>
                                    <Image src={'/svgs/'+(displayPassword ? 'eyecon_check.svg' : 'eyecon.svg')} alt='Show Password' priority width={250} height={160} />
                                </button>
                                {
                                passwordChecker &&
                                    <PasswordCheckList
                                        scss={scss}
                                        value={String(user.userObj.password)}
                                    />
                                }
                            </CustomContainer>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                required={true}
                                labelFor='password'
                                label='Confirm Password'
                                disabled={!checkedRoles?.length}
                                err={user.userErr.confirmPassword as string}
                            >
                                <input
                                    name='confirmPassword'
                                    maxLength={20}
                                    type='password'
                                    autoComplete='off'
                                    placeholder='*******'
                                    value={user.userObj.confirmPassword}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                            </CustomContainer>
                            <div className={scss.card+' '+scss.w100}>
                                <button type='submit' className={`${scss.button} ${scss.btnblue}`} disabled={!checkedRoles?.length}>
                                    Sign up
                                </button>
                            </div>
                        </div>
                    </form>
                </>
            }
            
            {/* <ul className={scss.userTypes} style={{marginTop: 0, marginBottom: '20px'}}>
            <li>
                <div className={scss.userType}>
                <div>
                    <strong>
                    Free Plan
                    </strong>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
                </div>
            </li>
            <li>
                <div className={scss.userType}>
                <div>
                    <strong>
                    Premium Plan
                    </strong>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
                </div>
            </li>
            </ul> */}
        </Modal>
    )
}
export default Register_V;