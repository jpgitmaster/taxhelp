import Link from 'next/link'
import Head from 'next/head';
import Image from 'next/image';


export default function LandingPage() {
  return (
    <>
      <Head>
        <title>TaxHelp Accounting Firm</title>
        <meta name="description" content="Professional accounting and tax services for small businesses and families." />
      </Head>
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-200 flex flex-col">
        {/* Logo */}
        <Link href='/' style={{width: '220px', margin: '15px 30px'}}>
          <Image src='/images/logo.png' alt='TaxHelp Logo' priority width={20} height={20} unoptimized={true} style={{width: '100%'}} />
        </Link>
        {/* Top Navigation */}
        <nav className="w-full flex justify-end items-center px-6 md:px-20 py-4 gap-4 absolute top-0 left-0 z-30">
          <a href="/bookkeeper" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-5 py-2 rounded-lg shadow transition border border-blue-300">Bookkeeper Portal</a>
          <a href="/customer" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold px-5 py-2 rounded-lg shadow transition border border-blue-300">Customer Portal</a>
        </nav>
        {/* Hero Section */}
        <section className="relative flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 md:py-28 bg-white bg-opacity-80">
          <div className="flex-1 z-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">
              Trusted Accounting & Tax Solutions
            </h1>
            <p className="text-lg md:text-2xl text-blue-700 mb-8 max-w-xl">
              Empowering your business and family with expert financial guidance, tax compliance, and peace of mind.
            </p>
            <a href="#contact" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow transition mb-4">Get a Free Consultation</a>
            {/* Removed Bookkeeper/Customer portal links from here */}
          </div>
          <div className="flex-1 flex justify-center mt-10 md:mt-0 z-10">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80" alt="Accounting Team" className="rounded-2xl shadow-xl w-full max-w-md object-cover" />
          </div>
          <div className="absolute inset-0 bg-linear-to-br from-blue-100/60 to-blue-300/40 pointer-events-none" />
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 px-6 md:px-20 bg-blue-50">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-10 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <img src="https://img.icons8.com/ios-filled/100/4f8ef7/accounting.png" alt="Bookkeeping" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-lg text-blue-700 mb-2">Bookkeeping</h3>
              <p className="text-gray-600">Accurate, timely, and secure record-keeping for your business.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <img src="https://img.icons8.com/ios-filled/100/4f8ef7/tax.png" alt="Tax Preparation" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-lg text-blue-700 mb-2">Tax Preparation</h3>
              <p className="text-gray-600">Expert tax filing and compliance for individuals and businesses.</p>
            </div>
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center">
              <img src="https://img.icons8.com/ios-filled/100/4f8ef7/financial-growth-analysis.png" alt="Advisory" className="w-16 h-16 mb-4" />
              <h3 className="font-semibold text-lg text-blue-700 mb-2">Financial Advisory</h3>
              <p className="text-gray-600">Strategic planning and advice to help you grow and protect your assets.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24 px-6 md:px-20 bg-white">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80" alt="About Us" className="rounded-xl shadow-lg w-full max-w-xs object-cover" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-4">About TaxHelp</h2>
              <p className="text-gray-700 text-lg mb-4">
                With over 20 years of experience, TaxHelp is dedicated to providing personalized accounting and tax services to small businesses and families. Our team of certified professionals ensures your finances are in safe hands.
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Certified Public Accountants</li>
                <li>Family-owned and operated</li>
                <li>Client-focused, transparent, and reliable</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 px-6 md:px-20 bg-blue-50">
          <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-10 text-center">What Our Clients Say</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-700 mb-4">“TaxHelp made tax season stress-free. Their team is knowledgeable and always available to answer my questions.”</p>
              <div className="font-semibold text-blue-700">— Maria S., Small Business Owner</div>
            </div>
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-700 mb-4">“Professional, reliable, and friendly service. I highly recommend TaxHelp for all your accounting needs.”</p>
              <div className="font-semibold text-blue-700">— John D., Freelancer</div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 px-6 md:px-20 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-blue-800 mb-6">Contact Us</h2>
            <p className="text-gray-700 mb-8">Ready to get started? Reach out for a free consultation or to learn more about our services.</p>
            <form className="grid grid-cols-1 gap-6">
              <input type="text" placeholder="Your Name" className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-gray-800" required />
              <input type="email" placeholder="Your Email" className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-gray-800" required />
              <textarea placeholder="How can we help you?" className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-gray-800" rows={4} required />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg shadow transition">Send Message</button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 text-center text-gray-500 bg-blue-50 border-t border-blue-100 text-sm">
          &copy; {new Date().getFullYear()} TaxHelp Accounting Firm. All rights reserved.
        </footer>
      </div>
    </>
  );
}
