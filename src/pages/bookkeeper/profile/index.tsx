import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import scss from './styles/Profile.module.scss';
import { signOut, getSession } from 'next-auth/react';
import useProfile from '@/controllers/users/useProfile';
import Loader from '@/components/reusables/RotatingLoader';
import Avatar from '@/components/reusables/AvatarPlaceholder';
import CustomContainer from '@/components/reusables/CustomContainer';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const Profile_V = () => {
    const {
        user,
        status,
        handleDate,
        handleBlur,
        handleChange,
        handleEditProfile
    } = useProfile()
    const profile = user.userObj
    const dateFormat = 'MM/DD/YYYY'
    const { message, submessage, loader } = status
    return (
        <div className={scss.profileWrapper}>
            <form className={scss.editProfile+' '+scss.form} onSubmit={handleEditProfile}>
                {
                message &&
                <div className={scss.success}>
                    <div className={scss.successCheck}>
                        <svg
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 130.2 130.2"
                        >
                        <circle
                            className={scss.path+' '+scss.circle}
                            fill="none"
                            stroke="#000"
                            strokeWidth="8"
                            strokeMiterlimit="12"
                            cx="65.1"
                            cy="65.1"
                            r="60.1"
                        />
                        <polyline
                            className={`${scss.path} ${scss.check}`}
                            fill="none"
                            stroke="#000"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeMiterlimit="12"
                            points="100.2,40.2 51.5,88.8 29.8,67.5 "
                        />
                        </svg>
                    </div>
                    <div className={scss.successMessage}>
                        {message}
                    </div>
                </div>
                }
                <div className={scss.top}>
                    <div className={scss.avatar}>
                        <Avatar color={''} />
                    </div>
                    <div className={scss.avatarDetails}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.cards}>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                required={true}
                                label='First Name'
                                labelFor='firstName'
                                err={user.userErr.firstName as string}
                            >
                                <input
                                    type='text'
                                    maxLength={50}
                                    id='firstName'
                                    name='firstName'
                                    autoComplete='off'
                                    value={user.userObj.firstName}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                            </CustomContainer>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                required={true}
                                label='Last Name'
                                labelFor='lastName'
                                err={user.userErr.lastName as string}
                            >
                                <input
                                    type='text'
                                    id='lastName'
                                    name='lastName'
                                    maxLength={50}
                                    autoComplete='off'
                                    value={user.userObj.lastName}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                />
                            </CustomContainer>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                required={true}
                                label='Email'
                                labelFor='email'
                                err={user.userErr.email as string}
                            >
                                <div className={scss.lblContent}>
                                    {user.userObj.email}
                                </div>
                            </CustomContainer>
                            <CustomContainer
                                width={50}
                                scss={scss}
                                label='Birthdate'
                                labelFor='birthdate'
                                err={user.userErr.birthdate as string}
                            >
                                <DatePicker
                                    id='birthdate'
                                    name='birthdate'
                                    format={dateFormat}
                                    style={{ border: user.userErr.birthdate ? '1px solid #DC2626' : '1px solid rgba(125, 122, 122, 0.6)' }}
                                    onChange={(date) => handleDate(date, 'birthdate')}
                                    value={
                                        profile.birthdate
                                        ? dayjs(profile.birthdate, dateFormat)
                                        : null
                                    }
                                />
                            </CustomContainer>
                        </div>
                        <button type='submit' className={scss.button+' '+scss.btnblue}>
                            Save Profile
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default Profile_V;