
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import scss from '@/styles/Landing.module.scss';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const TermsOfService = () => {
  return (
    <>
      <Head>
        <title>Terms of Service | TaxHelp</title>
        <meta
          name="description"
          content="Read TaxHelp's Terms of Service covering account registration, service usage, payments, responsibilities, and limitations."
        />
      </Head>

      <div className={scss.app}>

        {/* HEADER */}
        <header>
          <div className={scss.topbar}>
            <Link href="/" className={scss.logo}>
              <Image
                src="/images/logo.png"
                alt="TaxHelp Logo"
                priority
                width={20}
                height={20}
                unoptimized={true}
                style={{ width: '100%' }}
              />
            </Link>
          </div>
        </header>

        {/* TERMS OF SERVICE */}
        <main className={scss.terms_policy}>
          <div className={scss.policy_container}>

            {/* PAGE INTRO */}
            <div className={scss.policy_header}>
              <span className={scss.policy_badge}>
                LEGAL INFORMATION
              </span>

              <h1>Terms of Service</h1>

              <p>
                Welcome to TaxHelp. These Terms of Service govern
                your access to and use of the TaxHelp platform,
                services, and related features. By accessing or
                using our platform, you agree to comply with
                these terms.
              </p>

              <span className={scss.policy_date}>
                Last Updated: November 10, 2026
              </span>
            </div>

            {/* TERMS CONTENT */}
            <div className={scss.policy_content}>

              <section>
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing, registering, or using TaxHelp,
                  you acknowledge that you have read, understood,
                  and agreed to these Terms of Service.
                </p>
                <p>
                  If you do not agree with these terms, you should
                  discontinue using the platform and its services.
                </p>
              </section>

              <section>
                <h2>2. About TaxHelp</h2>
                <p>
                  TaxHelp is a digital solution by Pintek designed
                  to help businesses, entrepreneurs, and individuals
                  manage their accounting, bookkeeping, tax compliance,
                  and related business requirements.
                </p>
                <p>
                  Our platform provides digital tools, resources,
                  and services intended to simplify financial
                  administration and compliance-related activities.
                </p>
              </section>

              <section>
                <h2>3. Account Registration</h2>
                <p>
                  To access certain features of TaxHelp, you may
                  be required to create an account and provide
                  accurate and complete information.
                </p>

                <p>As a registered user, you agree to:</p>

                <ul>
                  <li>
                    Provide accurate, current, and complete
                    registration information.
                  </li>
                  <li>
                    Maintain the confidentiality of your
                    login credentials.
                  </li>
                  <li>
                    Notify TaxHelp immediately if you suspect
                    unauthorized access to your account.
                  </li>
                  <li>
                    Accept responsibility for activities
                    performed through your account, subject
                    to applicable law.
                  </li>
                  <li>
                    Keep your account information updated.
                  </li>
                </ul>
              </section>

              <section>
                <h2>4. Use of Services</h2>
                <p>
                  Users agree to use TaxHelp only for lawful
                  purposes and in accordance with these terms.
                </p>

                <p>You agree not to:</p>

                <ul>
                  <li>
                    Use the platform for fraudulent, illegal,
                    or unauthorized activities.
                  </li>
                  <li>
                    Submit false, misleading, or inaccurate
                    financial or business information.
                  </li>
                  <li>
                    Attempt to gain unauthorized access to
                    the platform or another user's account.
                  </li>
                  <li>
                    Interfere with the platform's security,
                    functionality, or availability.
                  </li>
                  <li>
                    Copy, distribute, or exploit platform
                    content without proper authorization.
                  </li>
                </ul>
              </section>

              <section>
                <h2>5. Accounting and Tax Services</h2>
                <p>
                  TaxHelp provides tools and services intended
                  to assist users with accounting, bookkeeping,
                  tax preparation, and compliance-related activities.
                </p>
                <p>
                  Users acknowledge that the accuracy of services
                  may depend on the completeness and correctness
                  of the information and documents they provide.
                </p>
                <p>
                  Users remain responsible for reviewing their
                  financial records, submitted information, and
                  applicable tax obligations. TaxHelp does not
                  guarantee any particular tax outcome, savings,
                  refund, or government approval.
                </p>
              </section>

              <section>
                <h2>6. Payments and Fees</h2>
                <p>
                  Certain TaxHelp services may require payment.
                  Applicable service fees, payment conditions,
                  and billing arrangements will be communicated
                  to users before a transaction is completed.
                </p>
                <ul>
                  <li>
                    Users agree to pay applicable fees for
                    services they purchase.
                  </li>
                  <li>
                    Payments must be made through accepted
                    payment channels.
                  </li>
                  <li>
                    Additional government or third-party fees
                    may apply where relevant.
                  </li>
                  <li>
                    Refund requests are governed by our
                    Refund Policy.
                  </li>
                </ul>
              </section>

              <section>
                <h2>7. User Responsibilities</h2>
                <p>
                  Users are responsible for ensuring that all
                  information, records, and documents submitted
                  through TaxHelp are accurate and legally obtained.
                </p>
                <p>
                  Users must also comply with applicable laws,
                  regulations, and government requirements
                  relating to their business and tax obligations.
                </p>
              </section>

              <section>
                <h2>8. Intellectual Property</h2>
                <p>
                  All platform content, designs, branding,
                  graphics, software, text, and other materials
                  associated with TaxHelp are owned by or
                  licensed to their respective owners.
                </p>
                <p>
                  Users may not reproduce, modify, distribute,
                  or commercially exploit these materials
                  without prior written authorization.
                </p>
              </section>

              <section>
                <h2>9. Privacy and Data Protection</h2>
                <p>
                  TaxHelp respects the privacy of its users
                  and handles personal information in accordance
                  with applicable data protection laws.
                </p>
                <p>
                  By using our platform, you acknowledge that
                  your personal information may be collected
                  and processed as described in our Privacy Policy.
                </p>
                <p>
                  For more information, please review our
                  Privacy Policy.
                </p>

                <Link
                  href="/privacy-policy"
                  className={scss.policy_inline_link}
                >
                  View Privacy Policy →
                </Link>
              </section>

              <section>
                <h2>10. Service Availability</h2>
                <p>
                  TaxHelp strives to maintain reliable access
                  to its platform and services. However, we
                  do not guarantee uninterrupted or error-free
                  availability.
                </p>
                <p>
                  Maintenance, technical issues, security
                  updates, or circumstances beyond our
                  reasonable control may temporarily affect
                  service availability.
                </p>
              </section>

              <section>
                <h2>11. Limitation of Liability</h2>
                <p>
                  To the extent permitted by applicable law,
                  TaxHelp and its operators shall not be liable
                  for indirect, incidental, or consequential
                  losses arising from the use or inability
                  to use the platform.
                </p>
                <p>
                  Nothing in these terms excludes or limits
                  liability that cannot legally be excluded
                  or limited under applicable law.
                </p>
              </section>

              <section>
                <h2>12. Suspension and Termination</h2>
                <p>
                  TaxHelp reserves the right to restrict,
                  suspend, or terminate access to accounts
                  where there is a reasonable basis to believe
                  that a user has violated these terms,
                  engaged in fraudulent activity, or
                  compromised platform security.
                </p>
                <p>
                  Where appropriate and legally permitted,
                  users may be notified before or after
                  such action is taken.
                </p>
              </section>

              <section>
                <h2>13. Changes to These Terms</h2>
                <p>
                  TaxHelp may update or revise these Terms
                  of Service from time to time to reflect
                  changes in our platform, services, or
                  applicable legal requirements.
                </p>
                <p>
                  Updated terms will be published on this
                  page with a revised effective date.
                </p>
                <p>
                  Continued use of the platform after
                  changes take effect will be subject
                  to applicable notice and consent
                  requirements.
                </p>
              </section>

              <section>
                <h2>14. Governing Law</h2>
                <p>
                  These Terms of Service shall be interpreted
                  in accordance with the laws of the
                  Republic of the Philippines, subject
                  to applicable consumer protection and
                  other mandatory legal requirements.
                </p>
              </section>

              <section>
                <h2>15. Contact Us</h2>
                <p>
                  If you have questions, concerns, or
                  clarifications regarding these Terms
                  of Service, please contact our team
                  through our Contact Us page.
                </p>

                <Link
                  href="/#contactus"
                  className={scss.policy_contact_button}
                >
                  Contact TaxHelp →
                </Link>
              </section>

            </div>

            {/* BOTTOM NAVIGATION */}
            <div className={scss.policy_bottom}>
              <p>
                Thank you for choosing TaxHelp for your
                accounting and compliance needs.
              </p>

              <Link href="/">
                ← Return to Homepage
              </Link>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <footer className={scss.footer}>
          <p>
            &copy; {new Date().getFullYear()} TaxHelp Accounting Firm.
            All rights reserved.
          </p>

          <div className={scss.footer_links}>
            <Link href="/refund-policy">
              Refund Policies
            </Link>

            <Link href="/terms-of-service">
              Terms of Service
            </Link>

            <Link href="/privacy-policy">
              Privacy Policies
            </Link>
          </div>
        </footer>

      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> =
  async (context: GetServerSidePropsContext) => {
    const session = await getSession(context) as Session;

    if (session?.user) {
      return {
        redirect: {
          destination: '/bookkeeper/dashboard',
          permanent: false,
        },
      };
    }

    return {
      props: { session },
    };
  };

export default TermsOfService;