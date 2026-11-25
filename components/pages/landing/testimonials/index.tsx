interface PropsDefinition {
    scss: { [key: string]: string }
}

const TESTIMONIALS = [
    {
        quote: 'TaxHelp made tax season stress-free. Their team is knowledgeable and always available to answer my questions.',
        author: '— Maria S., Small Business Owner',
    },
    {
        quote: 'Professional, reliable, and friendly service. I highly recommend TaxHelp for all your accounting needs.',
        author: '— John D., Freelancer',
    },
]

const Testimonials_V = ({ scss }: PropsDefinition) => {
    return (
        <section className={scss.testimonials}>
            <h2>What Our Clients Say</h2>
            <div className={scss.testimonial_boxes}>
                {TESTIMONIALS.map((testimonial) => (
                    <div key={testimonial.author} className={scss.testimonial_box}>
                        <p>&ldquo;{testimonial.quote}&rdquo;</p>
                        <strong>{testimonial.author}</strong>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Testimonials_V
