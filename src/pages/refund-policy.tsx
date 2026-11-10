
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from 'next-auth/react';
import scss from '@/styles/Landing.module.scss';
import type { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { Session, PageProps } from '@/controllers/layouts/types/cms_types';

const RefundPolicy = () => {
  return (
    <>
      <Head>
        <title>Refund Policy | TaxHelp</title>
        <meta
          name="description"
          content="Learn about TaxHelp's refund policy, cancellation terms, eligibility, and refund request process."
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

        {/* REFUND POLICY */}
        <main className={scss.refund_policy}>
          <div className={scss.policy_container}>

            {/* PAGE INTRO */}
            <div className={scss.policy_header}>
              <span className={scss.policy_badge}>
                CUSTOMER INFORMATION
              </span>

              <h1>Refund Policy</h1>

              <p>
                At TaxHelp, we value your trust and are committed
                to providing reliable accounting, bookkeeping, and
                tax compliance services. This Refund Policy explains
                the conditions and procedures for requesting a refund.
              </p>

              <span className={scss.policy_date}>
                Last Updated: November 10, 2026
              </span>
            </div>

            {/* POLICY CONTENT */}
            <div className={scss.policy_content}>

              <section>
                <h2>1. General Refund Policy</h2>
                <p>
                  TaxHelp aims to ensure customer satisfaction through
                  professional and reliable services. Refund requests
                  are reviewed on a case-by-case basis, taking into
                  consideration the nature of the service, work already
                  completed, and applicable agreements.
                </p>
              </section>

              <section>
                <h2>2. Eligibility for Refunds</h2>
                <p>
                  Customers may request a refund under circumstances
                  such as:
                </p>

                <ul>
                  <li>
                    Payment was successfully processed but the
                    requested service was not started or delivered.
                  </li>
                  <li>
                    Duplicate payments were made for the same service.
                  </li>
                  <li>
                    A billing error or incorrect charge occurred.
                  </li>
                  <li>
                    TaxHelp determines that a refund is appropriate
                    after reviewing the customer's concern.
                  </li>
                </ul>
              </section>

              <section>
                <h2>3. Non-Refundable Services</h2>
                <p>
                  Refunds may not be available for services that have
                  already been completed, delivered, or substantially
                  performed.
                </p>
                <p>
                  Expenses, government fees, filing fees, and other
                  third-party charges already incurred on behalf of
                  the customer may also be non-refundable, subject
                  to applicable law and the relevant agreement.
                </p>
              </section>

              <section>
                <h2>4. Refund Request Period</h2>
                <p>
                  Customers are encouraged to submit refund requests
                  within 30 calendar days from the date of payment
                  or service transaction.
                </p>
                <p>
                  Requests submitted beyond this period may still be
                  reviewed where required by applicable law or where
                  exceptional circumstances justify consideration.
                </p>
              </section>

              <section>
                <h2>5. How to Request a Refund</h2>
                <p>
                  To request a refund, please contact our support
                  team and provide the following information:
                </p>

                <ul>
                  <li>Full name or registered business name.</li>
                  <li>Registered email address.</li>
                  <li>Transaction reference or payment receipt.</li>
                  <li>Description of the refund request.</li>
                  <li>Supporting documents, if applicable.</li>
                </ul>

                <p>
                  Our team will review your request and may contact
                  you for additional information.
                </p>
              </section>

              <section>
                <h2>6. Refund Processing</h2>
                <p>
                  Once a refund is approved, it will be processed
                  through the original payment method whenever
                  reasonably possible.
                </p>
                <p>
                  The actual time for the refunded amount to appear
                  in your account may depend on your payment provider
                  or financial institution.
                </p>
              </section>

              <section>
                <h2>7. Cancellations</h2>
                <p>
                  Customers who wish to cancel a service request
                  should notify TaxHelp as soon as possible.
                  Cancellation and refund eligibility will depend
                  on the stage of service completion and any
                  applicable service agreement.
                </p>
              </section>

              <section>
                <h2>8. Policy Changes</h2>
                <p>
                  TaxHelp reserves the right to update or modify
                  this Refund Policy when necessary. Changes will
                  be reflected on this page with an updated
                  revision date.
                </p>
                <p>
                  Any changes will be subject to applicable laws
                  and regulations.
                </p>
              </section>

              <section>
                <h2>9. Contact Us</h2>
                <p>
                  If you have questions about this Refund Policy
                  or would like to request a refund, please contact
                  our team through our Contact Us page.
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
                Thank you for trusting TaxHelp with your accounting
                and compliance needs.
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

export default RefundPolicy;