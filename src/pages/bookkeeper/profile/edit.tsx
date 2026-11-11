import dayjs from 'dayjs';
import Link from 'next/link'
import Image from 'next/image'
import { Modal, DatePicker } from 'antd';
import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import scss from './styles/Profile.module.scss';
import useProfile from '@/controllers/users/useProfile';
import Loader from '@/components/reusables/RotatingLoader';
import Avatar from '@/components/reusables/AvatarPlaceholder';
import CustomContainer from '@/components/reusables/CustomContainer';
import SubscriptionPlans from '@/components/reusables/SubscriptionPlans';
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
    const { loader } = status
    const profile = user.userObj
    const dateFormat = 'MM/DD/YYYY'
    const [openPlanModal, setOpenPlanModal] = useState(false);
    useEffect(() => {
        const shouldShow = localStorage.getItem('showPlanModal');

        if (shouldShow === 'true') {
            setOpenPlanModal(true);
        }
    }, []);
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
                <br />
                <div className={scss.editProfile+' '+scss.box}>
                    <div className={scss.boxTitle}>
                        Contact Details
                    </div>
                </div>
                <br />
                <div className={scss.editProfile+' '+scss.box}>
                    <div className={scss.boxTitle}>
                        Employment Details
                    </div>
                </div>
                <button type='submit' className={scss.button+' '+scss.btnblue} style={{display: 'block', maxWidth: '300px', margin: '30px auto'}}>
                    Save Profile
                </button>
            </form>
            <Modal
                width={'70%'}
                footer={null}
                // open={openPlanModal}
                open={true}
                onCancel={() => {
                    setOpenPlanModal(false);

                    // remove forever after closing
                    localStorage.removeItem('showPlanModal');
                }}
                style={{ top: 50 }}
            >
                <div className={scss.planBox}>
                    <div className={scss.banner}>
                        <Image
                            src='https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1600&auto=format&fit=crop'
                            alt='Subscription Plans'
                            fill
                            priority
                            className={scss.bannerImage}
                        />

                        <div className={scss.bannerOverlay}>
                            <h1>Scale Your Business With Confidence</h1>
                            <p>
                                Choose the perfect accounting and compliance solution for your business.
                            </p>
                        </div>
                    </div>
                    <SubscriptionPlans
                        scss={scss}
                        title='Choose the Right Plan for Your Business'
                        caption='Flexible and affordable pricing designed for freelancers, bookkeepers, and growing businesses.'
                    />
                </div>
            </Modal>
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