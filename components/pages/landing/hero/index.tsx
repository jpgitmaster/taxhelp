import Link from 'next/link'
import Image from 'next/image'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { useEffect, useRef, useState } from 'react'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const SLIDES = [
    {
        eyebrow: 'Accounting & Tax Solutions',
        title: 'Trusted Accounting.',
        highlight: 'Simplified Taxes.',
        description: 'Empowering your business and family with expert financial guidance, tax compliance, and peace of mind.',
        image: '/images/taxhelp_image4_.JPG',
    },
    {
        eyebrow: 'BIR Compliance',
        title: 'BIR Compliance,',
        highlight: 'Made Simple.',
        description: 'Stay fully compliant with BIR regulations. We handle filings, reports, and deadlines so you can focus on growing your business.',
        image: '/images/taxhelp_image_.JPG',
    },
    {
        eyebrow: 'Tax Planning',
        title: 'Smart Tax Solutions',
        highlight: 'for Every Business.',
        description: 'Minimize liabilities and maximize savings with expert tax planning, preparation, and compliance tailored to your needs.',
        image: '/images/taxhelp_image2_.JPG',
    },
    {
        eyebrow: 'Bookkeeping',
        title: 'Accurate Bookkeeping',
        highlight: 'for Your Business.',
        description: 'Let us handle the numbers so you can focus on growing your business.',
        image: '/images/taxhelp_image3_.JPG',
    },
]

const Hero_V = ({ scss }: PropsDefinition) => {
    const sliderRef = useRef<Slider | null>(null)
    const [mounted, setMounted] = useState(false)
    const [fadeTransition, setFadeTransition] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            setFadeTransition(window.innerWidth > 800)
        }

        handleResize()
        setMounted(true)
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const settings = {
        dots: true,
        speed: 800,
        arrows: false,
        infinite: true,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplaySpeed: 5000,
        fade: fadeTransition,
    }

    return (
        <section className={scss.banners}>
            {
                mounted && (
                <Slider {...settings} ref={sliderRef}>
                    {SLIDES.map((slide) => (
                        <div key={slide.title} className={scss.banner}>
                            <div className={scss.bannerLeft}>
                                <span className={scss.eyebrow}>{slide.eyebrow}</span>
                                <h1>
                                    {slide.title}
                                    <br />
                                    <span className={scss.highlight}>{slide.highlight}</span>
                                </h1>
                                <p>
                                    {slide.description}
                                </p>
                                <Link href="#contactus">
                                    Get a Free Consultation
                                    <span className={scss.ctaArrow}>&rarr;</span>
                                </Link>
                            </div>
                            <div className={scss.bannerRight}>
                                <Image src={slide.image} alt={slide.title+' '+slide.highlight} width={450} height={300} />
                            </div>
                        </div>
                    ))}
                </Slider>
                )
            }
        </section>
    )
}

export default Hero_V
