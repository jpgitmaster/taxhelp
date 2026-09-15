// import Link from 'next/link';
import Image from 'next/image';
import scss from './styles/ResetPassword.module.scss';
import Loader from '@/components/reusables/RotatingLoader';
import useResetPassword from '@/controllers/users/useResetPassword';
import CustomContainer from '@/components/reusables/CustomContainer';
import PasswordCheckList from '@/components/pages/landing/register/PasswordCheckList';
const ResetPassword_V = () => {
    const {
        user,
        passwordChecker,
        displayPassword,
        status: { loader },

        setPasswordChecker,
        setDisplayPassword,

        handleBlur,
        handleChange,
        handleResubmit,
        handleResetPassword
    } = useResetPassword()
    return (
        <div className={scss.container}>
            <div className={scss.formWrapper}>
                <div className={scss.logo}>
                <Image src='/images/logo_tagline.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} style={{width: '100%'}} />
                </div>
                <br />
                <form className={scss.passwordReset} onSubmit={handleResetPassword}>
                    { loader && <Loader scss={scss} position='absolute' />}
                    <div className={scss.cards}>
                        <CustomContainer
                            width={100}
                            scss={scss}
                            required={true}
                            label='New Password'
                            labelFor='registerNewPassword'
                            err={user.userErr.newPassword as string}
                        >
                            <input
                                maxLength={50}
                                autoComplete='off'
                                name='newPassword'
                                id="registerNewPassword"
                                value={user.userObj.newPassword}
                                type={displayPassword ? 'text' : 'password'}
                                placeholder='******'
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
                                    value={String(user.userObj.newPassword)}
                                />
                            }
                        </CustomContainer>
                        <CustomContainer
                            width={100}
                            scss={scss}
                            required={true}
                            label='Confirm New Password'
                            labelFor='registerConfirmNewPassword'
                            err={user.userErr.confirmNewPassword as string}
                        >
                            <input
                                type='password'
                                maxLength={50}
                                autoComplete='off'
                                name='confirmNewPassword'
                                id="registerConfirmNewPassword"
                                value={user.userObj.confirmNewPassword}
                                placeholder='******'
                                onKeyUp={handleBlur}
                                onChange={handleChange}
                            />
                        </CustomContainer>
                        <div className={scss.card+' '+scss.w100}>
                            <button type='submit' className={`${scss.button} ${scss.btnblue}`} onKeyDown={handleResubmit}>
                                Change Password
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default ResetPassword_V;