interface PropsDefinition {
    scss: { [key: string]: string }
}

const NeedCustomSolution = ({ scss }: PropsDefinition) => {
    return (
        <div className={scss.needCustomBox}>
            <h3>Need Something Beyond Enterprise?</h3>

            <p>
                If your business requires custom workflows, specialized reports, unique document formats, or third-party integrations, we can build a solution tailored to your operations.
            </p>

            <ul className={scss.needCustomHighlight}>
                <li>Custom invoice & receipt printing (logo, layout, VAT/BIR-ready formats)</li>
            </ul>

            <div className={scss.needCustomFeatures}>
                <ul>
                    <li>Tailored workflows based on your operations</li>
                    <li>Scalable architecture</li>
                    <li>API / system integrations</li>
                </ul>
                <ul>
                    <li>Priority feature development</li>
                    <li>Dedicated onboarding & support</li>
                    <li>Custom reports & document formats</li>
                </ul>
            </div>

            <div className={scss.needCustomFooter}>
                <p className={scss.note}>
                    We&rsquo;ll discuss your requirements and build a solution that fits your business.
                </p>
            </div>
        </div>
    )
}

export default NeedCustomSolution
