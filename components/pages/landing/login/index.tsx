import Link from 'next/link';
import scss from './styles/Login.module.scss';
import Login_C from '@/controllers/users/Login_C';
import Loader from '@/components/reusables/RotatingLoader';
import CustomContainer from '@/components/reusables/CustomContainer';

interface PropsDefinition {
    showModal(): void
}
const Login_V = ({ showModal }: PropsDefinition) => {
    const {
        user,
        status,

        handleBlur,
        handleChange,
        handleUserLogin
    } = Login_C()
    const { loader } = status
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
                maxLength={20}
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
            <div className={scss.card+' '+scss.w20}>
                <button type='submit' className={`${scss.button} ${scss.btnblue}`}>
                Login
                </button>
            </div>
            </div>
            <div className={scss.loginSpiels}>
                {
                    !user.userErr.email ?
                    <p>
                        Don't have an account? <button type='button' className={scss.btnSignup} onClick={showModal}>Signup</button>
                    </p>
                    :
                    <p style={{minWidth: '170px'}}>
                        &nbsp;
                    </p>
                }
                {
                    !user.userErr.password ?
                    <Link href={''}>Forgot Password?</Link>
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