import Link from 'next/link'
import Image from 'next/image'

interface PropsDefinition {
    scss: { [key: string]: string }
    hideCompany?: boolean
}

const Footer_V = ({ scss, hideCompany }: PropsDefinition) => {
    return (
        <footer className={scss.footer}>
            <div className={scss.footer_top}>
                <div className={scss.footer_brand}>
                    <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.footer_logo} />
                    <p>
                        Practical tax and compliance tools built to help businesses stay BIR compliant with greater ease.
                    </p>
                    <p className={scss.footer_copyright}>
                        &copy; {new Date().getFullYear()} TaxHelp Accounting Firm. All rights reserved.
                    </p>
                </div>

                {!hideCompany && (
                    <div className={scss.footer_col}>
                        <h4>Company</h4>
                        <Link href="#about">About</Link>
                        <Link href="#services">Services</Link>
                        <Link href="#pricing">Pricing</Link>
                        <Link href="#contactus">Contact Us</Link>
                    </div>
                )}

                <div className={scss.footer_col + (hideCompany ? ' ' + scss.footer_colPolicies : '')}>
                    <h4>Policies</h4>
                    <Link href="/refund-policy">Refund Policies</Link>
                    <Link href="/terms-of-service">Terms of Service</Link>
                    <Link href="/privacy-policy">Privacy Policies</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer_V
