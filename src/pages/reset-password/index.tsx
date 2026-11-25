import type { GetServerSideProps, GetServerSidePropsContext } from 'next';

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const { token } = context.query
  return {
    redirect: {
      destination: `/${token ? `?token=${token}` : ''}`,
      permanent: false,
    },
  }
}

const ResetPasswordRedirect = () => null
export default ResetPasswordRedirect;
