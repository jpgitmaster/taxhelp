import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { token } = context.query
  const tokenValue = Array.isArray(token) ? token[0] : token
  return {
    redirect: {
      destination: `/${tokenValue ? `?token=${encodeURIComponent(tokenValue)}` : ''}`,
      permanent: false,
    },
  }
}

const ResetPasswordRedirect = () => null
export default ResetPasswordRedirect;
