import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import scss from '@/styles/Landing.module.scss';
import Register_V from '@/components/pages/landing/register';
import CustomContainer from '@/components/reusables/CustomContainer';
import { useState, useRef, ChangeEvent, KeyboardEvent, SyntheticEvent } from 'react';

export default function LandingPage() {
  const [loader, setLoader] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const textSliderRef = useRef<Slider | null>(null)
  const imageSliderRef = useRef<Slider | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const goToSlide = (currentSlide: number) => {
      if (textSliderRef.current) {
      setActiveSlide(currentSlide)
      textSliderRef.current.slickGoTo(currentSlide);  // Go to the specified slide index
      }
  };
  const fadeSettings = {
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
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [user, setUser] = useState({
    userObj: {
      email: '',
      password: ''
    },
    userErr: {
      email: '',
      password: ''
    },
  })
  const handleBlur = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => {
      if ((e as KeyboardEvent).key === 'Enter') {
          e.preventDefault();
          (e.target as HTMLInputElement).blur()
      }
  }
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = event.target
      setUser({
          ...user,
          userObj: {
              ...user.userObj,
              [name]: value
          }
      })
  }
  const handleLoginUser = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoader(true)
  }
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
            
            <form className={scss.loginUser} onSubmit={handleLoginUser}>
              <div className={scss.cards}>
                <CustomContainer
                  scss={scss}
                  width={40}
                  required={true}
                  label='Email'
                  labelFor='email'
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
                  scss={scss}
                  width={40}
                  required={true}
                  label='Password'
                  labelFor='password'
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
                <div className={scss.card+' '+scss.w20}>
                  <button type='submit' className={`${scss.button} ${scss.btnblue}`}>
                    Login
                  </button>
                </div>
              </div>
              <div className={scss.loginSpiels}>
                <p>
                  Don't have an account? <button type='button' className={scss.btnSignup} onClick={showModal}>Signup</button>
                </p>
                <Link href={''}>Forgot Password?</Link>
              </div>
            </form>
          </div>
        </header>
        {/* Hero Section */}
        <section className={scss.banners}>
          <Slider {...fadeSettings} ref={textSliderRef}>
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
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" alt="Accounting Team" />
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
                <img src="https://plus.unsplash.com/premium_photo-1661761077411-d50cba031848?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Accounting Team" />
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
                <Image src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" alt="About Us" className={scss.about_img} width={20} height={20} unoptimized={true} />
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
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
      />
    </>
  );
}
