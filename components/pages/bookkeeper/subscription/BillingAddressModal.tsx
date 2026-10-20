import { Modal } from 'antd'
import { ChangeEvent } from 'react'
import scss from './styles/BillingAddressModal.module.scss'
import { BillingAddressForm } from '@/controllers/billingAddresses/types'

export default function BillingAddressModal(props: {
    open: boolean
    mode: 'new' | 'edit'
    form: BillingAddressForm
    saving: boolean

    onChange(field: keyof BillingAddressForm): (event: ChangeEvent<HTMLInputElement>) => void
    onSave(): void
    onCancel(): void
}) {
    const {
        open,
        mode,
        form,
        saving,

        onChange,
        onSave,
        onCancel,
    } = props

    return (
        <Modal
            footer={null}
            open={open}
            onCancel={onCancel}
        >
            <div className={scss.billingAddressModal}>
                <h3 className={scss.title}>
                    {mode === 'new' ? 'Add' : 'Edit'} Billing Address
                </h3>

                <label className={scss.label} htmlFor='billingName'>Name</label>
                <input id='billingName' type='text' className={scss.input} placeholder='e.g. Juan Dela Cruz' value={form.name} onChange={onChange('name')} />

                <label className={scss.label} htmlFor='billingPhone'>Phone</label>
                <input id='billingPhone' type='tel' className={scss.input} placeholder='e.g. +639171234567' value={form.phone} onChange={onChange('phone')} />

                <label className={scss.label} htmlFor='billingLine1'>Address Line 1</label>
                <input id='billingLine1' type='text' className={scss.input} placeholder='e.g. 123 Rizal St' value={form.line1} onChange={onChange('line1')} />

                <label className={scss.label} htmlFor='billingLine2'>Address Line 2</label>
                <input id='billingLine2' type='text' className={scss.input} placeholder='e.g. Unit 4B (optional)' value={form.line2} onChange={onChange('line2')} />

                <div className={scss.row}>
                    <div>
                        <label className={scss.label} htmlFor='billingCity'>City</label>
                        <input id='billingCity' type='text' className={scss.input} placeholder='e.g. Quezon City' value={form.city} onChange={onChange('city')} />
                    </div>
                    <div>
                        <label className={scss.label} htmlFor='billingState'>State / Province</label>
                        <input id='billingState' type='text' className={scss.input} placeholder='e.g. Metro Manila' value={form.state} onChange={onChange('state')} />
                    </div>
                </div>

                <div className={scss.row}>
                    <div>
                        <label className={scss.label} htmlFor='billingPostalCode'>Postal Code</label>
                        <input id='billingPostalCode' type='text' className={scss.input} placeholder='e.g. 1100' value={form.postal_code} onChange={onChange('postal_code')} />
                    </div>
                    <div>
                        <label className={scss.label} htmlFor='billingCountry'>Country Code</label>
                        <input id='billingCountry' type='text' maxLength={2} className={scss.input} placeholder='e.g. PH' style={{ textTransform: 'uppercase' }} value={form.country} onChange={onChange('country')} />
                    </div>
                </div>

                <div className={scss.actions}>
                    <button type='button' onClick={onSave} disabled={saving} className={scss.btn+' '+scss.btnSave}>
                        {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button type='button' onClick={onCancel} className={scss.btn+' '+scss.btnCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </Modal>
    )
}
