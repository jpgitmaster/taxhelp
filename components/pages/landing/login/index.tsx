import Image from 'next/image';
import { useEffect, useState } from 'react';
import scss from './styles/Login.module.scss';
import useLogin from '@/controllers/users/useLogin';
import Loader from '@/components/reusables/RotatingLoader';
import CustomContainer from '@/components/reusables/CustomContainer';
interface PropsDefinition {
    toggleModal(modal: boolean, form: string): void
}
const Login_V = ({ toggleModal }: PropsDefinition) => {
    const {
        user,
        status,
        displayPassword,

        setDisplayPassword,

        handleBlur,
        handleChange,
        handleUserLogin
    } = useLogin()
    const { loader } = status
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth <= 800) {
            setMounted(false); // mobile
          } else {
            setMounted(true); // desktop
          }
        };
    
        handleResize(); // run on mount
        window.addEventListener('resize', handleResize);
    
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
        <form className={scss.loginUser} onSubmit={handleUserLogin}>
            { loader && <Loader scss={scss} position='absolute' />}
            <div className={scss.cards}>
            <CustomContainer
                scss={scss}
                width={40}
                required={true}
                label='Email'
                labelFor='email'
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
                scss={scss}
                width={40}
                required={true}
                label='Password'
                labelFor='password'
                err={user.userErr.password as string}
            >
                <input
                    maxLength={20}
                    name='password'
                    autoComplete='off'
                    placeholder='*******'
                    type={displayPassword ? 'text' : 'password'}
                    value={user.userObj.password}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                />
                <button type='button' className={scss.eyecon + (displayPassword ? ' '+scss.show : '')} onClick={() => setDisplayPassword(prevState => !prevState)}>
                    <Image src={'/svgs/'+(displayPassword ? 'eyecon_check.svg' : 'eyecon.svg')} alt='Show Password' priority width={250} height={160} />
                </button>
            </CustomContainer>
            <div className={scss.card+' '+scss.w20}>
                <button type='submit' className={`${scss.button} ${scss.btnblue}`}>
                Login
                </button>
            </div>
            </div>
            <div className={scss.loginSpiels}>
                {
                    (!mounted || !user.userErr.email) ?
                    <p>
                        Don't have an account? <button type='button' className={scss.btnSignup} onClick={() => toggleModal(true, 'registration')}>Signup</button>
                    </p>
                    :
                    <p style={{minWidth: '170px'}}>
                        &nbsp;
                    </p>
                }
                {
                    (!mounted || !user.userErr.password) ?
                    <button type='button' className={scss.btnForgotPassword} onClick={() => toggleModal(true, 'forgot_password')}>Forgot Password?</button>
                    :
                    <p>
                        &nbsp;
                    </p>
                }
            </div>
        </form>
    )
}
export default Login_V;