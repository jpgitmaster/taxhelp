const SITE_KEY = process.env?.NEXT_PUBLIC_GOOGLE_CAPTCHA_SITE_KEY

declare global {
    interface Window {
        grecaptcha?: {
            ready: (callback: () => void) => void
            execute: (siteKey: string, options: { action: string }) => Promise<unknown>
        }
    }
}

let scriptPromise: Promise<void> | null = null

const loadReCaptchaScript = (): Promise<void> => {
    if (!SITE_KEY || typeof window === 'undefined') return Promise.resolve()
    if (window.grecaptcha || document.getElementById('recaptcha-script')) return Promise.resolve()
    if (scriptPromise) return scriptPromise

    scriptPromise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.id = 'recaptcha-script'
        script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load reCAPTCHA'))
        document.head.appendChild(script)
    })
    return scriptPromise
}

export const getRecaptchaToken = async (): Promise<string> => {
    if (!SITE_KEY || typeof window === 'undefined') return ''
    await loadReCaptchaScript()

    const grecaptcha = window.grecaptcha
    if (!grecaptcha) return ''

    return new Promise<string>((resolve, reject) => {
        grecaptcha.ready(async () => {
            try {
                const token = grecaptcha.execute(SITE_KEY, { action: 'submit' })
                resolve((await token) as string)
            } catch (error) {
                reject(error)
            }
        })
    })
}