import Image from 'next/image';
import scss from './styles/Register.module.scss';
import PasswordCheckList from './PasswordCheckList';
import LandingModal from '@/components/pages/landing/landing_modal';
import { initStatus } from '@/controllers/global/states';
import useRegister from '@/controllers/users/useRegister';
import Loader from '@/components/reusables/RotatingLoader';
interface PropsDefinition {
    displayModal: {
        registration: boolean
        forgot_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}
const LandingSignupModal = ({
    toggleModal,
    displayModal,
}: PropsDefinition) => {
    const {
        user,
        status,
        features,
        initUser,
        checkedFeatures,
        displayPassword,
        passwordChecker,

        setUser,
        setStatus,
        setCheckedFeatures,
        setDisplayPassword,
        setPasswordChecker,

        handleBlur,
        handleChange,
        handleResubmit,
        handleRegisterUser,
        handleCheckedFeatures,
    } = useRegister()
    const { loader, message, submessage } = status
    return (
        <LandingModal
            open={displayModal.registration}
            width={460}
            onCancel={() => {
                setUser(initUser)
                setCheckedFeatures([])
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
                        <button className={scss.successClose} type='button' onClick={() => {
                            setUser(initUser)
                            setCheckedFeatures([])
                            setStatus(initStatus)
                            toggleModal(false, 'registration')
                        }}>
                        Close
                        </button>
                    </div>
                </div>
                :
                <>
                    <div className={scss.modelTitle}>
                        <div className={scss.modelTitleHeading}>
                            <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.modelTitleLogo} />
                            <strong>
                                Select what you'll work on
                            </strong>
                        </div>
                        <p>
                            Select the records you'll be handling for your clients.
                        </p>
                    </div>
                    <ul className={scss.features}>
                        {features.map((feature, index) => (
                            <li key={index}>
                                {feature.disabled && (
                                    <span className={scss.comingSoon}>
                                        Coming Soon
                                    </span>
                                )}
                                <label
                                    className={
                                        scss.feature
                                        + (checkedFeatures.includes(feature.value) ? ' ' + scss.checked : '')
                                        + (feature.disabled ? ' ' + scss.disabled : '')
                                    }
                                >
                                    <div className={scss.featureHeader}>
                                        <Image
                                            src={'/svgs/' + feature.icon}
                                            alt={feature.label}
                                            width={20}
                                            height={20}
                                            unoptimized={true}
                                        />
                                        <strong>{feature.label}</strong>
                                    </div>
                                    <p>{feature.description}</p>

                                    <input
                                        type="checkbox"
                                        name="user_account"
                                        value={feature.value}
                                        checked={checkedFeatures.includes(feature.value)}
                                        onChange={!feature.disabled ? handleCheckedFeatures : undefined}
                                        disabled={feature.disabled}
                                        onKeyUp={handleBlur}
                                    />

                                    {!feature.disabled && (
                                        <span className={scss.checkmark}></span>
                                    )}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <form className={scss.registerUser} onSubmit={handleRegisterUser}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.registerFields}>
                            <div className={scss.field + (user.userErr.email ? ' '+scss.err : '')}>
                                <label htmlFor="registerEmail">Email</label>
                                <input
                                    type='text'
                                    name='email'
                                    maxLength={100}
                                    id="registerEmail"
                                    autoComplete='off'
                                    value={user.userObj.email}
                                    placeholder='Enter Email'
                                    disabled={!checkedFeatures?.length}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                                {
                                    user.userErr.email &&
                                    <small>{user.userErr.email as string}</small>
                                }
                            </div>

                            <div className={scss.field + (user.userErr.password ? ' '+scss.err : '')}>
                                <label htmlFor="registerPassword">Password</label>
                                <input
                                    name='password'
                                    maxLength={20}
                                    autoComplete='off'
                                    placeholder='Enter Password'
                                    id="registerPassword"
                                    value={user.userObj.password}
                                    type={displayPassword ? 'text' : 'password'}
                                    disabled={!checkedFeatures?.length}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    onFocus={() => setPasswordChecker(true)}
                                    onBlur={() => setPasswordChecker(false)}
                                />
                                <button type='button' className={scss.eyecon} onClick={() => setDisplayPassword(prevState => !prevState)}>
                                    <Image src={'/svgs/'+(displayPassword ? 'eyecon_check.svg' : 'eyecon.svg')} alt='Show Password' priority width={20} height={20} />
                                </button>
                                {
                                    user.userErr.password &&
                                    <small>{user.userErr.password as string}</small>
                                }
                                {
                                passwordChecker &&
                                    <PasswordCheckList
                                        scss={scss}
                                        value={String(user.userObj.password)}
                                    />
                                }
                            </div>

                            <div className={scss.field + (user.userErr.confirmPassword ? ' '+scss.err : '')}>
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    name='confirmPassword'
                                    maxLength={20}
                                    type='password'
                                    autoComplete='off'
                                    placeholder='Confirm Password'
                                    id="confirmPassword"
                                    value={user.userObj.confirmPassword}
                                    disabled={!checkedFeatures?.length}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                                {
                                    user.userErr.confirmPassword &&
                                    <small>{user.userErr.confirmPassword as string}</small>
                                }
                            </div>

                            <button type='submit' className={scss.btnblue} disabled={!checkedFeatures?.length} onKeyDown={handleResubmit}>
                                Sign up
                            </button>

                            <div className={scss.registerLinks}>
                                <button type='button' onClick={() => toggleModal(true, 'login')}>
                                    Already have an account? <span>Login</span>
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
        </LandingModal>
    )
}
export default LandingSignupModal;