import { Modal } from 'antd'
import { ReactNode } from 'react'
import scss from './styles/LandingModal.module.scss'

interface PropsDefinition {
    open: boolean
    width?: number
    closable?: boolean
    children: ReactNode
    onCancel: () => void
}

const LandingModal = ({ open, width, closable, children, onCancel }: PropsDefinition) => {
    return (
        <Modal
            footer={null}
            open={open}
            onCancel={onCancel}
            width={width || 420}
            centered
            closable={closable !== false}
            mask={{ closable: closable !== false }}
            destroyOnHidden
            rootClassName={scss.landingModalRoot}
        >
            {children}
        </Modal>
    )
}

export default LandingModal
