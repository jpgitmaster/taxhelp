import Link from 'next/link'
import Image from 'next/image'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const AppFooter = ({ scss }: PropsDefinition) => {
    return (
        <footer className={scss.appFooter}>
            <div className={scss.appFooterTop}>
                <div className={scss.appFooterBrand}>
                    <Image src='/images/logo.png' alt='TaxHelp Logo' width={20} height={20} unoptimized={true} className={scss.appFooterLogo} />
                    <p>
                        Practical tax and compliance tools built to help businesses stay BIR compliant with greater ease.
                    </p>
                    <p className={scss.appFooterCopyright}>
                        &copy; {new Date().getFullYear()} TaxHelp Accounting Firm. All rights reserved.
                    </p>
                </div>

                <div className={scss.appFooterCol}>
                    <h4>Policies</h4>
                    <Link href="/refund-policy">Refund Policies</Link>
                    <Link href="/terms-of-service">Terms of Service</Link>
                    <Link href="/privacy-policy">Privacy Policies</Link>
                </div>
            </div>
        </footer>
    )
}

export default AppFooter
