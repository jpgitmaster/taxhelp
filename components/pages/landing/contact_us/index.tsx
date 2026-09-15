import cs from './styles/ContactUs.module.scss';
import useContactUs from '@/controllers/contact_us/useContactUs';
import Loader from '@/components/reusables/RotatingLoader';

interface PropsDefinition {
    scss: { [key: string]: string }
}
const ContactUs_V = ({ scss }: PropsDefinition) => {
    const {
        contactUs,
        status,

        handleBlur,
        handleChange,
        handleSubmit,
        handleReset
    } = useContactUs()
    const { loader, message, submessage } = status
    return (
        <section id="contactus" className={scss.contact_us}>
            <div className={scss.contact_us_box}>
                <h2>Contact Us</h2>
                {
                    message ?
                    <div className={cs.success}>
                        <div className={cs.successCheck}>
                            <svg version='1.1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 130.2 130.2'>
                                <circle className={`${cs.path} ${cs.circle}`} fill='none' stroke='#14b11c' strokeWidth='6' strokeMiterlimit='10' cx='65.1' cy='65.1' r='62.1' />
                                <polyline className={`${cs.path} ${cs.check}`} fill='none' stroke='#14b11c' strokeWidth='6' strokeLinecap='round' strokeMiterlimit='10' points='100.2,40.2 51.5,88.8 29.8,67.5 ' />
                            </svg>
                        </div>
                        <div className={cs.successMessage}>
                            <h4>{message}</h4>
                            <p>{submessage}</p>
                            <button type='button' onClick={handleReset}>
                                Send Another Message
                            </button>
                        </div>
                    </div>
                    :
                    <>
                        <p>Ready to get started? Reach out for a free consultation or to learn more about our services.</p>
                        <form className={cs.form} onSubmit={handleSubmit}>
                            { loader && <Loader scss={scss} position='absolute' /> }
                            <div className={cs.field + (contactUs.contactErr.fullName ? ' '+cs.err : '')}>
                                <input
                                    name='fullName'
                                    type='text'
                                    maxLength={255}
                                    placeholder='Your Name'
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    value={contactUs.contactObj.fullName}
                                />
                                {
                                    contactUs.contactErr.fullName &&
                                    <small className={cs.errmsg}>{contactUs.contactErr.fullName as string}</small>
                                }
                            </div>
                            <div className={cs.field + (contactUs.contactErr.email ? ' '+cs.err : '')}>
                                <input
                                    name='email'
                                    type='email'
                                    maxLength={255}
                                    placeholder='Your Email'
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    value={contactUs.contactObj.email}
                                />
                                {
                                    contactUs.contactErr.email &&
                                    <small className={cs.errmsg}>{contactUs.contactErr.email as string}</small>
                                }
                            </div>
                            <div className={cs.field + (contactUs.contactErr.message ? ' '+cs.err : '')}>
                                <textarea
                                    name='message'
                                    rows={5}
                                    placeholder='How can we help you?'
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    value={contactUs.contactObj.message}
                                ></textarea>
                                {
                                    contactUs.contactErr.message &&
                                    <small className={cs.errmsg}>{contactUs.contactErr.message as string}</small>
                                }
                            </div>
                            <button type='submit'>Send Message</button>
                        </form>
                    </>
                }
            </div>
        </section>
    )
}
export default ContactUs_V;