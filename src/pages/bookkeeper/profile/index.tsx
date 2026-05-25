import dayjs from 'dayjs';
import Link from 'next/link'
import Image from 'next/image'
import { getSession } from 'next-auth/react';
import scss from './styles/Profile.module.scss';
import useProfile from '@/controllers/users/useProfile';
import Loader from '@/components/reusables/RotatingLoader';
import Avatar from '@/components/reusables/AvatarPlaceholder';
import SuccessMessage from '@/components/reusables/SuccessMessage';
import CustomContainer from '@/components/reusables/CustomContainer';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const Profile_V = () => {
    const {
        user,
        status,
        handleBlur,
        handleChange,
    } = useProfile()
    const profile = user.userObj
    const dateFormat = 'MM/DD/YYYY'
    const { message, loader } = status
    return (
        <>
            {
            message &&
                <SuccessMessage message={message} />
            }
            <div className={scss.profileWrapper}>
                <Link href={`/bookkeeper/profile/edit`} className={scss.editLink}>
                    <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                    Edit Details
                </Link>
                <div className={scss.editProfile}>
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
                                >
                                    <input
                                        readOnly
                                        type='text'
                                        id='firstName'
                                        name='firstName'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        className={scss.lblContent}
                                        value={user.userObj.firstName}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={33}
                                    scss={scss}
                                    label='Middle Name'
                                    labelFor='middleName'
                                >
                                    <input
                                        readOnly
                                        type='text'
                                        id='middleName'
                                        name='middleName'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        className={scss.lblContent}
                                        value={user.userObj.middleName}
                                    />
                                </CustomContainer>
                                <CustomContainer
                                    width={33}
                                    scss={scss}
                                    required={true}
                                    label='Last Name'
                                    labelFor='lastName'
                                >
                                    <input
                                        readOnly
                                        type='text'
                                        id='lastName'
                                        name='lastName'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        className={scss.lblContent}
                                        value={user.userObj.lastName}
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
                                >
                                    <input
                                        readOnly
                                        type='text'
                                        id='birthdate'
                                        name='birthdate'
                                        onKeyUp={handleBlur}
                                        onChange={handleChange}
                                        className={scss.lblContent}
                                        value={profile.birthdate ? dayjs(profile.birthdate).format(dateFormat) : ''}
                                    />
                                </CustomContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
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
export default Profile_V;