interface PropsDefinition {
    scss: { [key: string]: string }
    onClick: () => void
}

const SidebarHamburger = ({ scss, onClick }: PropsDefinition) => {
    return (
        <button type='button' className={scss.hamburger} onClick={onClick} aria-label='Toggle sidebar'>
            <span />
            <span />
            <span />
        </button>
    )
}

export default SidebarHamburger
