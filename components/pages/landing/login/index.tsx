import Image from 'next/image';
import LoginForm from './LoginForm';
import scss from './styles/Login.module.scss';
import LandingModal from '@/components/pages/landing/landing_modal';

interface PropsDefinition {
    displayModal: {
        login: boolean
        registration: boolean
        forgot_password: boolean
    }
    toggleModal(modal: boolean, form: string): void
}

const LandingLoginModal = ({
    toggleModal,
    displayModal,
}: PropsDefinition) => {
    return (
        <LandingModal
            open={displayModal.login}
            width={460}
            onCancel={() => toggleModal(false, 'login')}
        >
            <div className={scss.loginModal}>
                <div className={scss.loginModalTitle}>
                    <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.loginModalLogo} />
                    <strong>Login</strong>
                </div>

                <LoginForm scss={scss} toggleModal={toggleModal} />
            </div>
        </LandingModal>
    )
}

export default LandingLoginModal;
