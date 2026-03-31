import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import { useState, useRef } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import scss from '@/styles/Landing.module.scss';
import Login_V from '@/components/pages/landing/login';
import Register_V from '@/components/pages/landing/register';
import ForgotPassword_V from '@/components/pages/landing/forgot_password';

export default function LandingPage() {
  const sliderRef = useRef<Slider | null>(null)
  const [displayModal, setDisplayModal] = useState({
    registration: false,
    forgot_password: false
  })
  
  const settings = {
      dots: true,
      speed: 800,
      fade: true,
      arrows: false,
      infinite: true,
      autoplay: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplaySpeed: 5000,
  };
  const toggleModal = (modal: boolean, form: string) => {
    setDisplayModal({
      ...displayModal,
      [form]: modal
    })
  };
  return (
    <>
      <Head>
        <title>TaxHelp Accounting Firm</title>
        <meta name="description" content="Professional accounting and tax services for small businesses and families." />
      </Head>
      
      <div className={scss.app}>
        <header>
          <div className={scss.topbar}>
            {/* Logo */}
            <Link href='/' className={scss.logo}>
              <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} style={{width: '100%'}} />
            </Link>
            
            <Login_V toggleModal={toggleModal} />
          </div>
        </header>
        {/* Hero Section */}
        <section className={scss.banners}>
          <Slider {...settings} ref={sliderRef}>
            <div className={scss.banner}>
              <div className={scss.bannerLeft}>
                <h1>
                  Trusted Accounting & Tax Solutions
                </h1>
                <p>
                  Empowering your business and family with expert financial guidance, tax compliance, and peace of mind.
                </p>
                <Link href="#contact">
                  Get a Free Consultation
                </Link>
              </div>
              <div className={scss.bannerRight}>
                <img src="https://plus.unsplash.com/premium_photo-1679923906285-386991e8d862?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Accounting Team" />
              </div>
            </div>
            <div className={scss.banner}>
              <div className={scss.bannerLeft}>
                <h1>
                  BIR Compliance Made Simple
                </h1>
                <p>
                  Stay fully compliant with BIR regulations. We handle filings, reports, and deadlines so you can focus on growing your business.
                </p>
                <Link href="#contact">
                  Get a Free Consultation
                </Link>
              </div>
              <div className={scss.bannerRight}>
                <img src="https://plus.unsplash.com/premium_photo-1679922389798-8b38c78b5670?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Accounting Team" />
              </div>
            </div>
            <div className={scss.banner}>
              <div className={scss.bannerLeft}>
                <h1>
                  Smart Tax Solutions for Every Business
                </h1>
                <p>
                  Minimize liabilities and maximize savings with expert tax planning, preparation, and compliance tailored to your needs.
                </p>
                <Link href="#contact">
                  Get a Free Consultation
                </Link>
              </div>
              <div className={scss.bannerRight}>
                <img src="https://plus.unsplash.com/premium_photo-1679923813998-6603ee2466c5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Accounting Team" />
              </div>
            </div>
            <div className={scss.banner}>
              <div className={scss.bannerLeft}>
                <h1>
                  Accurate Bookkeeping for Your Business
                </h1>
                <p>
                  Let us handle the numbers so you can focus on growing your business.
                </p>
                <Link href="#contact">
                  Get a Free Consultation
                </Link>
              </div>
              <div className={scss.bannerRight}>
                <img src="https://images.unsplash.com/photo-1707902665498-a202981fb5ac?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Accounting Team" />
              </div>
            </div>
          </Slider>
        </section>
        {/* Services Section */}
        <section className={scss.services}>
          <h2 className={scss.serviceTitle}>Our Services</h2>
          <div className={scss.serviceBox}>
            <div className={scss.service}>
              <Image src="https://img.icons8.com/ios-filled/100/4f8ef7/accounting.png" alt="Bookkeeping" width={20} height={20} unoptimized={true} />
              <h3>Bookkeeping</h3>
              <p>Accurate, timely, and secure record-keeping for your business.</p>
            </div>
            <div className={scss.service}>
              <Image src="https://img.icons8.com/ios-filled/100/4f8ef7/tax.png" alt="Tax Preparation" width={20} height={20} unoptimized={true} />
              <h3>Tax Preparation</h3>
              <p>Expert tax filing and compliance for individuals and businesses.</p>
            </div>
            <div className={scss.service}>
              <Image src="https://img.icons8.com/ios-filled/100/4f8ef7/financial-growth-analysis.png" alt="Advisory" width={20} height={20} unoptimized={true} />
              <h3>Financial Advisory</h3>
              <p>Strategic planning and advice to help you grow and protect your assets.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className={scss.about}>
            <div className={scss.about_box}>
                <Image src="https://images.unsplash.com/photo-1642043175009-5997b3a078d8?q=80&w=1035&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="About Us" className={scss.about_img} width={20} height={20} unoptimized={true} />
                <div>
                    <h2>About TaxHelp</h2>
                    <p>
                        With over 20 years of experience, TaxHelp is dedicated to providing personalized accounting and tax services to small businesses and families. Our team of certified professionals ensures your finances are in safe hands.
                    </p>
                    <ul>
                        <li>Certified Public Accountants</li>
                        <li>Family-owned and operated</li>
                        <li>Client-focused, transparent, and reliable</li>
                    </ul>
                </div>
            </div>
        </section>
        {/* Promotions Section */}
        <section className={scss.promos}>
          <h2 className={scss.promoTitle}>Special Offers</h2>

          <div className={scss.promoBox}>
            <div className={scss.promo}>
              <h3>Free Initial Consultation</h3>
              <p>Get a 30-minute free consultation for new clients. Let’s discuss your accounting needs.</p>
              <span>Limited Time Offer</span>
            </div>

            <div className={scss.promo}>
              <h3>20% Off Tax Filing</h3>
              <p>Enjoy 20% off on individual tax preparation services this season.</p>
              <span>Until April 30</span>
            </div>

            <div className={scss.promo}>
              <h3>Startup Package</h3>
              <p>Special discounted bundle for new businesses: bookkeeping + tax + advisory.</p>
              <span>Best for Entrepreneurs</span>
            </div>
          </div>
        </section>
        {/* Testimonials Section */}
        <section className={scss.testimonials}>
            <h2>What Our Clients Say</h2>
            <div className={scss.testimonial_boxes}>
                <div className={scss.testimonial_box}>
                    <p>“TaxHelp made tax season stress-free. Their team is knowledgeable and always available to answer my questions.”</p>
                    <strong>— Maria S., Small Business Owner</strong>
                </div>
                <div className={scss.testimonial_box}>
                    <p>“Professional, reliable, and friendly service. I highly recommend TaxHelp for all your accounting needs.”</p>
                    <strong>— John D., Freelancer</strong>
                </div>
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className={scss.contact_us}>
          <div className={scss.contact_us_box}>
              <h2>Contact Us</h2>
              <p>Ready to get started? Reach out for a free consultation or to learn more about our services.</p>
              <form>
                  <input type="text" placeholder="Your Name" required />
                  <input type="email" placeholder="Your Email" required />
                  <textarea placeholder="How can we help you?" required></textarea>
                  <button type="submit">Send Message</button>
              </form>
          </div>
        </section>

        {/* Footer */}
        <footer className={scss.footer}>
          &copy; {new Date().getFullYear()} TaxHelp Accounting Firm. All rights reserved.
        </footer>
      </div>
      <Register_V
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
      <ForgotPassword_V
        displayModal={displayModal}
        toggleModal={toggleModal}
      />
    </>
  );
}
