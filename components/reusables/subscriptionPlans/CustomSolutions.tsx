import { useState } from 'react'

interface PropsDefinition {
    scss: { [key: string]: string }
}

const CustomSolutions = ({ scss }: PropsDefinition) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <div className={scss.customSolutions}>
                <div className={scss.customSolution}>
                    <h3>
                        Need Something Beyond Enterprise?
                    </h3>

                    <p>
                        If your business requires custom workflows, specialized reports, unique document formats, or third-party integrations, we can build a solution tailored to your operations.
                    </p>

                    <div className={scss.customFeatures}>
                        <ul className="space-y-2">
                            <li>Tailored workflows based on your operations</li>
                            <li>Scalable architecture</li>
                            <li>API / system integrations</li>
                        </ul>
                        <ul className="space-y-2">
                            <li>Priority feature development</li>
                            <li>Dedicated onboarding & support</li>
                            <li>Custom reports & document formats</li>
                            <li>Custom invoice & receipt printing (logo, layout, VAT/BIR-ready formats)</li>
                        </ul>
                    </div>

                    <button
                        type='button'
                        onClick={() => setShowModal(true)}
                        className={scss.button+' '+scss.btnblue}
                    >
                        Let&rsquo;s Talk Business
                    </button>

                    <p className={scss.note}>
                        We&rsquo;ll discuss your requirements and build a solution that fits your business.
                    </p>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md space-y-4">
                        <h3 className="text-lg font-semibold">
                            Let&rsquo;s Build Something for Your Business
                        </h3>

                        <input type="text" placeholder="Business Name" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <input type="email" placeholder="Email" className="w-full border rounded-lg px-3 py-2 text-sm" />
                        <textarea
                            placeholder="What features or customizations do you need? (e.g., custom invoice printing, reports, integrations)"
                            className="w-full border rounded-lg px-3 py-2 text-sm"
                        />

                        <div className="flex justify-end gap-2">
                            <button type='button' onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-500">
                                Cancel
                            </button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default CustomSolutions
