import Image from 'next/image'
import useLogin from '@/controllers/users/useLogin'

interface PropsDefinition {
    scss: { [key: string]: string }
    toggleModal: (modal: boolean, form: string) => void
}

const LoginForm = ({ scss, toggleModal }: PropsDefinition) => {
    const {
        user,
        status,
        displayPassword,

        setDisplayPassword,

        handleBlur,
        handleChange,
        handleResubmit,
        handleUserLogin
    } = useLogin()
    const { loader } = status

    return (
        <form className={scss.mobileLoginForm} onSubmit={handleUserLogin}>
            <div className={scss.field + (user.userErr.email ? ' '+scss.err : '')}>
                <label htmlFor='mobileLoginEmail'>Email</label>
                <input
                    id="mobileLoginEmail"
                    type='text'
                    name='email'
                    maxLength={100}
                    autoComplete='off'
                    value={user.userObj.email}
                    placeholder='Enter Email'
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                />
                {
                    user.userErr.email &&
                    user.userErr.email !== user.userErr.password &&
                    <small>{user.userErr.email as string}</small>
                }
            </div>

            <div className={scss.field + (user.userErr.password ? ' '+scss.err : '')}>
                <label htmlFor='mobileLoginPassword'>Password</label>
                <input
                    maxLength={20}
                    id="mobileLoginPassword"
                    name='password'
                    autoComplete='off'
                    placeholder='Enter Password'
                    type={displayPassword ? 'text' : 'password'}
                    value={user.userObj.password}
                    onKeyUp={handleBlur}
                    onChange={handleChange}
                />
                <button type='button' className={scss.eyecon} aria-label={displayPassword ? 'Hide password' : 'Show password'} onClick={() => setDisplayPassword(prevState => !prevState)}>
                    <Image src={'/svgs/'+(displayPassword ? 'eyecon_check.svg' : 'eyecon.svg')} alt='Show Password' width={20} height={20} />
                </button>
                {
                    user.userErr.password &&
                    <small>{user.userErr.password as string}</small>
                }
            </div>

            <button type='submit' disabled={loader} className={scss.loginSubmit} onKeyDown={handleResubmit}>
                {loader ? 'Logging in...' : 'Login'}
            </button>

            <div className={scss.mobileLoginLinks}>
                <button type='button' onClick={() => toggleModal(true, 'registration')}>
                    Don&rsquo;t have an account? <span>Signup</span>
                </button>
                <button type='button' className={scss.forgotPassword} onClick={() => toggleModal(true, 'forgot_password')}>
                    Forgot Password?
                </button>
            </div>
        </form>
    )
}

export default LoginForm
