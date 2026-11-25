import Image from 'next/image'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const SERVICES = [
    {
        icon: 'accounting',
        alt: 'Bookkeeping',
        title: 'Bookkeeping',
        description: 'Accurate, timely, and secure record-keeping for your business.',
        features: [
            'Complete books of accounts',
            'Client & supplier records',
            'Full audit trail',
        ],
    },
    {
        icon: 'tax',
        alt: 'Tax Preparation',
        title: 'Tax Preparation',
        description: 'Expert tax filing and compliance for individuals and businesses.',
        features: [
            'Simplified tax compliance',
            'Stress-free deadlines',
            'Less manual paperwork',
        ],
    },
    {
        icon: 'financial-growth-analysis',
        alt: 'Advisory',
        title: 'Financial Advisory',
        description: 'Strategic planning and advice to help you grow and protect your assets.',
        features: [
            'Tax planning guidance',
            'Business growth advice',
            'Free initial consultation',
        ],
    },
]

const Services_V = ({ scss }: PropsDefinition) => {
    return (
        <section id="services" className={scss.services}>
            <h2 className={scss.serviceTitle}>Our Services</h2>
            <div className={scss.serviceBox}>
                {SERVICES.map((service) => (
                    <div key={service.title} className={scss.service}>
                        <div className={scss.serviceHeader}>
                            <div className={scss.serviceIcon}>
                                <Image src={`https://img.icons8.com/ios-filled/100/1268f3/${service.icon}.png`} alt={service.alt} width={22} height={22} unoptimized={true} />
                            </div>
                            <h3>{service.title}</h3>
                        </div>
                        <p>{service.description}</p>
                        <ul className={scss.serviceList}>
                            {service.features.map((feature) => (
                                <li key={feature}>{feature}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Services_V
