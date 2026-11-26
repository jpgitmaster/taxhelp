import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { token } = context.query
  const tokenValue = Array.isArray(token) ? token[0] : token
  return {
    redirect: {
      destination: `/${tokenValue ? `?verify_token=${encodeURIComponent(tokenValue)}` : ''}`,
      permanent: false,
    },
  }
}

const EmailVerificationRedirect = () => null
export default EmailVerificationRedirect;
