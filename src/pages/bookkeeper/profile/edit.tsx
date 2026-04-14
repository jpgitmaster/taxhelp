import dayjs from 'dayjs';
import Link from 'next/link'
import Image from 'next/image'
import { DatePicker } from 'antd';
import { getSession } from 'next-auth/react';
import scss from './styles/Profile.module.scss';
import useProfile from '@/controllers/users/useProfile';
import Loader from '@/components/reusables/RotatingLoader';
import Avatar from '@/components/reusables/AvatarPlaceholder';
import CustomContainer from '@/components/reusables/CustomContainer';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const EdtProfile_V = () => {
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
    const { loader } = status
    return (
        <div className={scss.profileWrapper}>
            <Link href={`/bookkeeper/profile`} className={scss.editLink}>
                <Image src='/svgs/eyecon_check.svg' alt='View Details' priority width={20} height={20} unoptimized={true} />
                View Details
            </Link>
            <form onSubmit={handleEditProfile} className={scss.form}>
                <div className={scss.editProfile+' '+scss.box}>
                    <div className={scss.boxTitle}>
                        Profile Details
                    </div>
                    <div className={scss.profile}>
                        { loader && <Loader scss={scss} position='absolute' />}
                        <div className={scss.avatar}>
                            <Avatar color={''} />
                        </div>
                        <div className={scss.avatarDetails}>
                            <div className={scss.cards}>
                                <CustomContainer
                                    width={33}
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
                                    width={33}
                                    scss={scss}
                                    label='Middle Name'
                                    labelFor='middleName'
                                    err={user.userErr.middleName as string}
                                >
                                    <input
                                        type='text'
                                        id='middleName'
                                        name='middleName'
                                        maxLength={50}
                                        autoComplete='off'
                                        value={user.userObj.middleName}
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={33}
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
                                >
                                    <input
                                        readOnly
                                        id='email'
                                        name='email'
                                        type='text'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        value={user.userObj.email}
                                        className={scss.lblContent}
                                    />
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
                        </div>
                    </div>
                </div>
                <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}}>
                    Save Profile
                </button>
            </form>
        </div>
    )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user?.id || !session.user.email) {
    return { redirect: { destination: '/', permanent: false } };
  }

  return {
    props: { session }
  }
}
export default EdtProfile_V;