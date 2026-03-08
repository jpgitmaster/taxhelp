interface PropsDefinition {
    position: string
    scss: { [key: string]: string }
}
const Loader = (props: PropsDefinition) => {
    const { position, scss } = props
    return (
        <div className={scss.loader+' '+scss[position]}>
            <div className={scss.bg}></div>
            <div className={scss.spinner}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>   
    )
}
export default Loader;