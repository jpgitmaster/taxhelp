import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import scss from '@/styles/Landing.module.scss';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy | TaxHelp</title>
        <meta
          name="description"
          content="Learn how TaxHelp collects, uses, processes, stores, and protects your personal, business, and financial information."
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
                unoptimized
                style={{ width: '100%' }}
              />
            </Link>
          </div>
        </header>

        {/* PRIVACY POLICY */}
        <main className={scss.privacy_policy}>
          <div className={scss.policy_container}>

            <div className={scss.policy_header}>
              <span className={scss.policy_badge}>
                DATA PRIVACY INFORMATION
              </span>

              <h1>Privacy Policy</h1>

              <p>
                At TaxHelp, we respect your privacy and are
                committed to protecting your personal information.
                This Privacy Policy explains how we collect,
                use, process, store, and protect your information
                when you access our platform and use our accounting,
                bookkeeping, and tax-related services.
              </p>

              <span className={scss.policy_date}>
                Last Updated: November 10, 2026
              </span>
            </div>

            <div className={scss.policy_content}>

              {/* 1. INTRODUCTION */}
              <section>
                <h2>1. Introduction</h2>

                <p>
                  TaxHelp is a digital solution by Pintek designed
                  to help businesses, entrepreneurs, and individuals
                  manage their accounting, bookkeeping, tax compliance,
                  and related business requirements.
                </p>

                <p>
                  We recognize the importance of protecting personal
                  and financial information entrusted to us. We handle
                  personal information in accordance with applicable
                  Philippine data protection laws, including Republic
                  Act No. 10173, otherwise known as the Data Privacy
                  Act of 2012, and its Implementing Rules and Regulations.
                </p>

                <p>
                  This Privacy Policy applies to individuals who
                  access, register, or use TaxHelp and its associated
                  services.
                </p>
              </section>

              {/* 2. INFORMATION COLLECTED */}
              <section>
                <h2>2. Information We Collect</h2>

                <p>
                  Depending on the services and features you use,
                  TaxHelp may collect the following categories
                  of information:
                </p>

                <h3>2.1 Personal Information</h3>

                <ul>
                  <li>Full name and contact information.</li>
                  <li>Email address and mobile number.</li>
                  <li>Business name and business address.</li>
                  <li>Account registration and profile information.</li>
                  <li>Identification details when necessary for service delivery.</li>
                </ul>

                <h3>2.2 Financial and Tax-Related Information</h3>

                <ul>
                  <li>Tax Identification Number (TIN), where required.</li>
                  <li>Business registration and tax registration details.</li>
                  <li>Accounting and bookkeeping records.</li>
                  <li>Income, expenses, and financial transactions.</li>
                  <li>Tax returns, declarations, and supporting documents.</li>
                  <li>Invoices, receipts, and payment information.</li>
                </ul>

                <h3>2.3 Technical and Usage Information</h3>

                <ul>
                  <li>IP address and device information.</li>
                  <li>Browser type and operating system.</li>
                  <li>Login activity and access timestamps.</li>
                  <li>Platform usage and interaction information.</li>
                  <li>Cookies and similar technologies, where applicable.</li>
                </ul>

                <p>
                  We collect only information that is relevant
                  and reasonably necessary for the purposes
                  for which it is processed.
                </p>
              </section>

              {/* 3. COLLECTION METHODS */}
              <section>
                <h2>3. How We Collect Information</h2>

                <p>
                  TaxHelp may collect information through
                  the following methods:
                </p>

                <ul>
                  <li>
                    <strong>Directly from users:</strong> When
                    registering an account, completing forms,
                    submitting documents, or communicating
                    with our team.
                  </li>

                  <li>
                    <strong>Through platform usage:</strong>
                    When users access and interact with
                    TaxHelp's features and services.
                  </li>

                  <li>
                    <strong>Through transactions:</strong>
                    When users purchase services, submit
                    payment information, or request assistance.
                  </li>

                  <li>
                    <strong>From authorized third parties:</strong>
                    When information is lawfully provided by
                    service providers, representatives, or
                    other authorized sources.
                  </li>
                </ul>
              </section>

              {/* 4. PURPOSE OF PROCESSING */}
              <section>
                <h2>4. How We Use Your Information</h2>

                <p>
                  TaxHelp may use collected information
                  for the following purposes:
                </p>

                <ul>
                  <li>Creating and managing user accounts.</li>
                  <li>Providing accounting and bookkeeping services.</li>
                  <li>Assisting with tax preparation and compliance.</li>
                  <li>Managing business and financial records.</li>
                  <li>Processing service requests and transactions.</li>
                  <li>Sending account notifications and service updates.</li>
                  <li>Responding to customer inquiries and support requests.</li>
                  <li>Improving platform functionality and user experience.</li>
                  <li>Preventing fraud and unauthorized account access.</li>
                  <li>Complying with applicable laws and regulatory requirements.</li>
                </ul>
              </section>

              {/* 5. LEGAL BASIS */}
              <section>
                <h2>5. Legal Basis for Processing</h2>

                <p>
                  TaxHelp processes personal information only
                  when a valid legal basis exists under
                  applicable data protection laws.
                </p>

                <p>
                  Depending on the circumstances, these
                  legal bases may include:
                </p>

                <ul>
                  <li>
                    <strong>Consent:</strong> When you voluntarily
                    authorize the collection and processing
                    of your information for a specific purpose.
                  </li>

                  <li>
                    <strong>Contractual necessity:</strong>
                    When processing is necessary to provide
                    requested services or fulfill contractual
                    obligations.
                  </li>

                  <li>
                    <strong>Legal obligation:</strong> When
                    processing is required to comply with
                    applicable laws, regulations, or lawful
                    government requirements.
                  </li>

                  <li>
                    <strong>Legitimate interests:</strong>
                    When processing is necessary for legitimate
                    business purposes, provided your fundamental
                    rights and freedoms are not overridden.
                  </li>

                  <li>
                    <strong>Other lawful grounds:</strong>
                    Where permitted under the Data Privacy Act
                    and other applicable regulations.
                  </li>
                </ul>
              </section>

              {/* 6. SHARING INFORMATION */}
              <section>
                <h2>6. Disclosure and Sharing of Information</h2>

                <p>
                  TaxHelp does not disclose personal information
                  indiscriminately. However, information may be
                  shared when necessary and legally permitted
                  with the following parties:
                </p>

                <ul>
                  <li>
                    <strong>Authorized personnel:</strong>
                    Employees and representatives who require
                    access to perform their assigned duties.
                  </li>

                  <li>
                    <strong>Service providers:</strong>
                    Authorized third-party providers supporting
                    hosting, infrastructure, communications,
                    payment processing, and platform operations.
                  </li>

                  <li>
                    <strong>Government authorities:</strong>
                    Relevant agencies, including the Bureau
                    of Internal Revenue, when disclosure is
                    legally required or otherwise permitted.
                  </li>

                  <li>
                    <strong>Professional advisers:</strong>
                    Legal, accounting, and other professional
                    advisers when reasonably necessary.
                  </li>
                </ul>

                <p>
                  When third parties process personal information
                  on our behalf, appropriate contractual,
                  organizational, and security safeguards
                  will be implemented as required by law.
                </p>
              </section>

              {/* 7. DATA RETENTION */}
              <section>
                <h2>7. Data Retention</h2>

                <p>
                  TaxHelp retains personal information only
                  for as long as necessary to fulfill the
                  purposes for which it was collected,
                  comply with legal and regulatory requirements,
                  resolve disputes, and establish or defend
                  legal claims.
                </p>

                <p>Retention periods may depend on:</p>

                <ul>
                  <li>The type and nature of information collected.</li>
                  <li>The purpose for which information is processed.</li>
                  <li>Applicable tax and accounting recordkeeping requirements.</li>
                  <li>Outstanding transactions, disputes, or legal obligations.</li>
                </ul>

                <p>
                  When information is no longer necessary,
                  it will be securely deleted, destroyed,
                  anonymized, or otherwise disposed of
                  in accordance with applicable laws.
                </p>
              </section>

              {/* 8. DATA SECURITY */}
              <section>
                <h2>8. Data Security</h2>

                <p>
                  TaxHelp implements reasonable and appropriate
                  organizational, physical, and technical
                  safeguards designed to protect personal
                  information against unauthorized access,
                  disclosure, alteration, loss, misuse,
                  and destruction.
                </p>

                <p>Security measures may include:</p>

                <ul>
                  <li>Account authentication and access controls.</li>
                  <li>Restricted access to confidential information.</li>
                  <li>Secure information storage and transmission.</li>
                  <li>System monitoring and security assessments.</li>
                  <li>Internal privacy and information security procedures.</li>
                </ul>

                <p>
                  Although we take reasonable measures to
                  protect information, no electronic storage
                  or transmission system can be guaranteed
                  to be completely secure.
                </p>
              </section>

              {/* 9. DATA SUBJECT RIGHTS */}
              <section>
                <h2>9. Your Rights as a Data Subject</h2>

                <p>
                  Under the Philippine Data Privacy Act of 2012,
                  you have rights concerning your personal
                  information, subject to applicable legal
                  conditions and limitations.
                </p>

                <ul>
                  <li>
                    <strong>Right to be informed:</strong>
                    To know whether your personal information
                    is being collected, stored, or processed.
                  </li>

                  <li>
                    <strong>Right to access:</strong>
                    To request access to your personal
                    information and relevant details
                    about its processing.
                  </li>

                  <li>
                    <strong>Right to object:</strong>
                    To object to certain forms of processing,
                    subject to lawful exceptions.
                  </li>

                  <li>
                    <strong>Right to rectification:</strong>
                    To request correction of inaccurate
                    or incomplete personal information.
                  </li>

                  <li>
                    <strong>Right to erasure or blocking:</strong>
                    To request suspension, withdrawal,
                    removal, or blocking of personal
                    information when legally justified.
                  </li>

                  <li>
                    <strong>Right to data portability:</strong>
                    To obtain a copy of qualifying personal
                    information in a structured and commonly
                    used electronic format.
                  </li>

                  <li>
                    <strong>Right to damages:</strong>
                    To seek compensation where entitled
                    under applicable laws for any damages suffered
                    due to unlawful processing of personal information.
                  </li>
                </ul>

                <p>
                  To exercise your rights, please contact
                  our Data Protection Officer (DPO) or
                  designated privacy representative.
                </p>
              </section>

              {/* 10. CONTACT US */}
              <section>
                <h2>10. Contact Us</h2>

                <p>
                  If you have questions about this Privacy Policy,
                  wish to exercise your data subject rights, or
                  have concerns regarding the processing of your
                  personal information, please contact our team
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
                Thank you for trusting TaxHelp with your accounting and compliance needs.
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

export default PrivacyPolicy;