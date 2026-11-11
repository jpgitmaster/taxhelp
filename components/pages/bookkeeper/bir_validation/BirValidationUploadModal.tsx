import { Modal, Upload } from 'antd'
import type { UploadChangeParam, UploadFile } from 'antd/es/upload/interface'
import { BIR_VALIDATION_UPLOAD_EXTENSION } from '@/controllers/bir_validation/constants'
import scss from './styles/BirValidationUploadModal.module.scss'

interface Props {
    open: boolean
    fileList: UploadFile[]
    submitting: boolean
    onChange(fileList: UploadFile[]): void
    onClose(): void
    onSubmit(): void
}

export default function BirValidationUploadModal(props: Props) {
    const { open, fileList, submitting, onChange, onClose, onSubmit } = props

    const handleChange = ({ fileList: nextFileList }: UploadChangeParam<UploadFile>) => {
        onChange(nextFileList)
    }

    return (
        <Modal
            open={open}
            title='Upload Files for BIR Validation'
            footer={null}
            width={520}
            maskClosable={!submitting}
            closable={!submitting}
            onCancel={onClose}
        >
            <div className={scss.uploadModal}>
                <p className={scss.hint}>
                    Drag and drop a {BIR_VALIDATION_UPLOAD_EXTENSION} file here, or click to
                    select. One file at a time, up to 10 MB. Each file creates one validation
                    job.
                </p>

                <Upload.Dragger
                    accept={BIR_VALIDATION_UPLOAD_EXTENSION}
                    maxCount={1}
                    beforeUpload={() => false}
                    fileList={fileList}
                    disabled={submitting}
                    onChange={handleChange}
                    className={scss.dragger}
                >
                    <p className={scss.icon}>📄</p>
                    <p className={scss.title}>Drag &amp; drop files here</p>
                    <p className={scss.subtitle}>or click to browse</p>
                </Upload.Dragger>

                <div className={scss.actions}>
                    <button
                        type='button'
                        className={`${scss.button} ${scss.btnorange}`}
                        onClick={onClose}
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        className={`${scss.button} ${scss.btnblue}`}
                        onClick={onSubmit}
                        disabled={!fileList.length || submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </Modal>
    )
}
