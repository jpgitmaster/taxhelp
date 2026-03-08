
import scss from './styles/Login.module.scss'
import Login_C from '@/controllers/users/Login_C'
import { signOut, getSession } from 'next-auth/react'
import Loader from '@/components/reusables/RotatingLoader'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'
const Login_V = () => {
  const {
    err,
    user,
    status,
    handleBlur,
    handleChange,
    handleResubmit,
    handleCredentialLogin,
  } = Login_C()
  const { loader } = status
  return (
    <form className={scss.loginForm} onSubmit={handleCredentialLogin}>
      <h3 className={scss.formTitle}>Admin Login</h3>
      { loader && <Loader scss={scss} position='absolute' />}
      <div className={scss.cards}>
        <CustomContainer
          scss={scss}
          width={100}
          required={true}
          label='Email Address'
          err={err.email as string}
        >
          <input type='text' name='email' maxLength={50} value={user.email} autoComplete='email' onKeyUp={handleBlur} onChange={handleChange} />
        </CustomContainer>
        <CustomContainer
          scss={scss}
          width={100}
          required={true}
          label='Password'
          err={err.password as string}
        >
          <input type='password' name='password' maxLength={50} value={user.password} autoComplete='password' onChange={handleChange} onKeyUp={handleBlur} />
        </CustomContainer>
      </div>
      <button type='submit' className={`${scss.button} ${scss.btnblue}`} onKeyDown={handleResubmit}>
        Login
      </button>
    </form>
  )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/bookkeeper/dashboard',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default Login_V;