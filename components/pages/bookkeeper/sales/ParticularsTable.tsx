import Image from 'next/image'
import { ChangeEvent, KeyboardEvent } from 'react'
import { Particular } from '@/controllers/sales/types'
import scss from './styles/ParticularsTable.module.scss'

interface PropsDefinition {
  particulars: Particular[]
  errArr: Particular[]
  handleBlur: (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => void
  handleAddParticular: () => void
  handleRemoveParticular: (index: number) => void
  handleParticularChange: (index: number, event: ChangeEvent<HTMLInputElement>) => void
}

const formatCurrency = (value: string) =>
  Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const ParticularsTable = ({
  particulars,
  errArr,
  handleBlur,
  handleAddParticular,
  handleRemoveParticular,
  handleParticularChange,
}: PropsDefinition) => {
  const subtotal = particulars.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)

  return (
    <div className={scss.particularsSection}>
      <div className={scss.sectionHeader}>
        <h2>Particulars</h2>
        <button type="button" className={scss.addLine} onClick={handleAddParticular}>
          <span className={scss.plus}>+</span>
          Add Line
        </button>
      </div>

      <div className={scss.table}>
        <div className={scss.row + ' ' + scss.headRow}>
          <span>Item Description / Service Nature</span>
          <span>Qty</span>
          <span>Unit Price</span>
          <span>Amount</span>
          <span />
        </div>

        {particulars.map((particular, index) => (
          <div className={scss.row} key={index}>
            <div className={scss.cell}>
              <input
                type="text"
                name="description"
                autoComplete="off"
                placeholder="e.g. Consulting services"
                id={`description-${index}`}
                value={particular.description}
                onKeyUp={handleBlur}
                onChange={(e) => handleParticularChange(index, e)}
                className={errArr[index]?.description ? scss.invalid : ''}
              />
              {errArr[index]?.description && <span className={scss.errmsg}>{errArr[index].description}</span>}
            </div>

            <div className={scss.cell}>
              <input
                type="text"
                name="quantity"
                placeholder="0"
                autoComplete="off"
                id={`quantity-${index}`}
                value={particular.quantity}
                onKeyUp={handleBlur}
                onChange={(e) => handleParticularChange(index, e)}
                className={errArr[index]?.quantity ? scss.invalid : ''}
              />
              {errArr[index]?.quantity && <span className={scss.errmsg}>{errArr[index].quantity}</span>}
            </div>

            <div className={scss.cell}>
              <input
                type="text"
                name="unit_price"
                placeholder="0.00"
                autoComplete="off"
                id={`unit-price-${index}`}
                value={particular.unit_price}
                onKeyUp={handleBlur}
                onChange={(e) => handleParticularChange(index, e)}
                className={errArr[index]?.unit_price ? scss.invalid : ''}
              />
              {errArr[index]?.unit_price && <span className={scss.errmsg}>{errArr[index].unit_price}</span>}
            </div>

            <div className={scss.cell}>
              <input
                readOnly
                type="text"
                name="amount"
                placeholder="0.00"
                autoComplete="off"
                id={`amount-${index}`}
                value={particular.amount}
                className={scss.amountField}
                onChange={(e) => handleParticularChange(index, e)}
              />
            </div>

            <div className={scss.cell + ' ' + scss.removeCell}>
              {particulars.length > 1 && (
                <button
                  type="button"
                  className={scss.removeBtn}
                  onClick={() => handleRemoveParticular(index)}
                  aria-label="Remove line"
                >
                  <Image src="/svgs/delete.svg" alt="Remove" width={16} height={16} unoptimized />
                </button>
              )}
            </div>
          </div>
        ))}

        <div className={scss.subtotalRow}>
          <span>Subtotal</span>
          <strong>{formatCurrency(String(subtotal))}</strong>
        </div>
      </div>
    </div>
  )
}

export default ParticularsTable
