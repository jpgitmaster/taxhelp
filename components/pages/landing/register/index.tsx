import { Modal } from 'antd';
import Image from 'next/image';
import scss from './styles/Register.module.scss';
import Register_C from '@/controllers/users/Register_C';
import Loader from '@/components/reusables/RotatingLoader';
import CustomContainer from '@/components/reusables/CustomContainer';

interface PropsDefinition {
    isModalOpen: boolean
    handleCancel(): void
}
const Register_V = (props: PropsDefinition) => {
    const {
        isModalOpen,
        handleCancel
    } = props
    const {
        user,
        roles,
        status,
        checkedRoles,

        handleBlur,
        handleChange,
        handleRegisterUser,
        handleCheckedRoles,
    } = Register_C()
    const { loader } = status
    return (
        <Modal
            footer={null}
            open={isModalOpen}
            onCancel={handleCancel}
        >
            <div className={scss.modelTitle}>
            <strong>
                Tell us who you are
            </strong>
            <p>
                Choose your role to get the right tools and experience.
            </p>
            </div>
            <ul className={scss.userTypes}>
                {
                    roles.map((role, index) => (
                        <li key={index}>
                            <label className={scss.userType + (checkedRoles.includes(role.value) ? ' '+scss.checked : '')}>
                                <Image src={'/svgs/'+role.icon} alt="Business Owner" width={20} height={20} unoptimized={true} />
                                <div>
                                    <strong>
                                    {role.label}
                                    </strong>
                                    <p>
                                    {role.description}
                                    </p>
                                </div>
                                <input type='checkbox'
                                    name='user_account'
                                    onKeyUp={handleBlur}
                                    value={role.value}
                                    checked={checkedRoles.includes(role.value)}
                                    onChange={handleCheckedRoles}
                                />
                                <span className={scss.checkmark}></span>
                            </label>
                        </li>
                    ))
                }
                {/* <li>
                    <div className={scss.userType}>
                        <Image src="/svgs/business_owner.svg" alt="Business Owner" width={20} height={20} unoptimized={true} />
                        <div>
                            <strong>
                            Business Owner
                            </strong>
                            <p>
                            Manage your business taxes and track your filings.
                            </p>
                        </div>
                    </div>
                </li>
                <li>
                    <div className={scss.userType}>
                    <Image src="/svgs/bookkeeper.svg" alt="Bookkeeper" width={20} height={20} unoptimized={true} />
                    <div>
                        <strong>
                        Bookkeeper
                        </strong>
                        <p>
                        Manage financial records and prepare tax-ready reports.
                        </p>
                    </div>
                    </div>
                </li> */}
            </ul>
            <form className={scss.registerUser} onSubmit={handleRegisterUser}>
            { loader && <Loader scss={scss} position='absolute' />}
            <div className={scss.cards}>
                <CustomContainer
                    width={100}
                    scss={scss}
                    required={true}
                    label='Email'
                    labelFor='email'
                    disabled={!checkedRoles?.length}
                    err={user.userErr.email as string}
                >
                    <input
                        type='text'
                        name='email'
                        maxLength={20}
                        autoComplete='off'
                        value={user.userObj.email}
                        placeholder='johndoe@gmail.com'
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                    />
                </CustomContainer>
                <CustomContainer
                    width={50}
                    scss={scss}
                    required={true}
                    label='Password'
                    labelFor='password'
                    disabled={!checkedRoles?.length}
                    err={user.userErr.password as string}
                >
                    <input
                        name='password'
                        maxLength={20}
                        type='password'
                        autoComplete='off'
                        placeholder='*******'
                        value={user.userObj.password}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                    />
                </CustomContainer>
                <CustomContainer
                    width={50}
                    scss={scss}
                    required={true}
                    labelFor='password'
                    label='Confirm Password'
                    disabled={!checkedRoles?.length}
                    err={user.userErr.confirmPassword as string}
                >
                    <input
                        name='confirmPassword'
                        maxLength={20}
                        type='password'
                        autoComplete='off'
                        placeholder='*******'
                        value={user.userObj.confirmPassword}
                        onKeyUp={handleBlur}
                        onChange={handleChange}
                    />
                </CustomContainer>
                <div className={scss.card+' '+scss.w100}>
                    <button type='submit' className={`${scss.button} ${scss.btnblue}`} disabled={!checkedRoles?.length}>
                        Sign up
                    </button>
                </div>
            </div>
            </form>
            {/* <ul className={scss.userTypes} style={{marginTop: 0, marginBottom: '20px'}}>
            <li>
                <div className={scss.userType}>
                <div>
                    <strong>
                    Free Plan
                    </strong>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
                </div>
            </li>
            <li>
                <div className={scss.userType}>
                <div>
                    <strong>
                    Premium Plan
                    </strong>
                    <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </p>
                </div>
                </div>
            </li>
            </ul> */}
        </Modal>
    )
}
export default Register_V;