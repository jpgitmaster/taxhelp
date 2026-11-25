import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { token } = context.query
  return {
    redirect: {
      destination: `/${token ? `?verify_token=${token}` : ''}`,
      permanent: false,
    },
  }
}

const EmailVerificationRedirect = () => null
export default EmailVerificationRedirect;
