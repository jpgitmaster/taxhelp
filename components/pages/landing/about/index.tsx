import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const About_V = ({ scss }: PropsDefinition) => {
    const [isMuted, setIsMuted] = useState(true)
    const videoRef = useRef<HTMLVideoElement>(null)

    const toggleMute = () => {
        const video = videoRef.current
        if (!video) return

        video.muted = !video.muted
        setIsMuted(video.muted)

        if (video.paused) {
            video.play().catch(() => {})
        }
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    video.play().catch(() => {})
                } else {
                    video.pause()
                }
            },
            { threshold: 0.5 }
        )

        observer.observe(video)

        return () => observer.disconnect()
    }, [])

    return (
        <section id="about" className={scss.about}>
            <div className={scss.about_box}>
                <div className={scss.video_wrapper}>
                    <video
                        ref={videoRef}
                        src="/images/taxhelp_vid.mp4"
                        muted
                        playsInline
                        preload="metadata"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                    <button
                        type="button"
                        onClick={toggleMute}
                        className={scss.mute_button}
                        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    >
                        {isMuted ? 'Unmute' : 'Mute'}
                    </button>
                </div>
                <div style={{flex: 1}}>
                    <h2>About <span className={scss.highlight}>TaxHelp</span></h2>
                    <p style={{fontSize: '16px'}}>
                        <strong>TaxHelp</strong> is a digital solution by <strong>Pintek</strong> that helps businesses and entrepreneurs navigate their tax and compliance needs with greater ease.
                        <br /><br />
                        Designed with businesses in mind, TaxHelp provides practical digital tools and resources that simplify essential tax requirements, helping users manage their obligations more efficiently while staying focused on running and growing their businesses.
                        <br /><br />
                        TaxHelp is registered with the Bureau of Internal Revenue (BIR), with Registration Seal Number <strong>RSN 024RC20260000003722</strong>. Our BIR Registration Seal Badge is displayed for public verification and transparency.
                    </p>
                    <br />
                    <Image src='/images/bir_registered_seal.png' alt="Registered Seal Badge" width={450} height={200} />
                </div>
            </div>
        </section>
    )
}

export default About_V
