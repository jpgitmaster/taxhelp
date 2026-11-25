import Link from 'next/link'
import Image from 'next/image'
import SuccessMessage from '@/components/reusables/SuccessMessage'

interface PropsDefinition {
    scss: { [key: string]: string }
    message: string
    toggleModal: (modal: boolean, form: string) => void
}

const Header_V = ({ scss, message, toggleModal }: PropsDefinition) => {
    return (
        <header>
            <div className={scss.topbar}>
                <Link href='/' className={scss.logo}>
                    <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} style={{width: '100%'}} />
                </Link>

                <div className={scss.headerAuth}>
                    <button type='button' className={scss.headerLoginLink} onClick={() => toggleModal(true, 'login')}>
                        Login
                    </button>
                    <button type='button' className={scss.loginTrigger} onClick={() => toggleModal(true, 'registration')}>
                        Sign Up
                    </button>
                </div>
                {
                    message &&
                    <SuccessMessage message={message} />
                }
            </div>
        </header>
    )
}

export default Header_V
