
import dayjs from 'dayjs'
import { useRef } from 'react'
import { Button } from 'antd'
import scss from './styles/Receipt.module.scss'
import { SalesTableRow } from '@/controllers/sales/types'

interface Props {
  receipt: SalesTableRow
}

const formatNumber = (value?: number) =>
  Number(value || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const ReceiptModal = ({ receipt }: Props) => {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current

    if (!content) return

    const printWindow = window.open('', '_blank')

    if (!printWindow) {
      alert('Please allow popups to print.')
      return
    }

    const styles = Array.from(
      document.querySelectorAll('style, link[rel="stylesheet"]')
    ).map(style => style.outerHTML).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Default Receipt</title>
          ${styles}
          <style>
            body {
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }

            @media print {
              @page {
                size: A4;
                margin: 12mm;
              }
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          ${content.outerHTML}
          <script>
            window.onload = () => window.print();
            window.onafterprint = () => window.close();
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  const customerName =
    receipt.registered_name ||
    receipt.indivicdual_name ||
    'N/A'

  return (
    <div>
      <div className={scss.modalToolbar}>
        <Button type="primary" onClick={handlePrint}>
          Print Receipt
        </Button>
      </div>

      <div ref={printRef} className={scss.receipt}>
        <header className={scss.header}>
          <h2>YOUR BUSINESS NAME</h2>
          <p>Business Address</p>
          <p>TIN: YOUR BUSINESS TIN</p>
          <p>VAT Registered</p>
        </header>

        <div className={scss.receiptTitle}>
          <h2>SALES INVOICE</h2>
          <p>DEFAULT RECEIPT</p>
        </div>

        <section className={scss.invoiceDetails}>
          <div>
            <span>Invoice No.:</span>
            <strong>{receipt.invoice_number || receipt.id}</strong>
          </div>

          <div>
            <span>Invoice Date:</span>
            <strong>{receipt.invoice_date || 'N/A'}</strong>
          </div>

          <div>
            <span>Taxable Month:</span>
            <strong>
              {receipt.taxable_month
                ? dayjs(receipt.taxable_month).format('MMMM YYYY')
                : 'N/A'}
            </strong>
          </div>
        </section>

        <section className={scss.customerDetails}>
          <h3>CUSTOMER INFORMATION</h3>

          <div>
            <span>Customer Name:</span>
            <strong>{customerName}</strong>
          </div>

          <div>
            <span>TIN:</span>
            <strong>{receipt.tin || 'N/A'}</strong>
          </div>

          <div>
            <span>Address:</span>
            <strong>
              {[receipt.first_address, receipt.second_address]
                .filter(Boolean).join(', ') || 'N/A'}
            </strong>
          </div>

          <div>
            <span>Payment Terms:</span>
            <strong>{receipt.terms || 'N/A'}</strong>
          </div>
        </section>

        <section className={scss.salesBreakdown}>
          <h3>SALES SUMMARY</h3>

          <table>
            <tbody>
              <tr>
                <td>VAT-Exempt Sales</td>
                <td>{formatNumber(receipt.exempt_sales)}</td>
              </tr>

              <tr>
                <td>Zero-Rated Sales</td>
                <td>{formatNumber(receipt.zero_rated_sales)}</td>
              </tr>

              <tr>
                <td>VATable Sales</td>
                <td>{formatNumber(receipt.vatable_sales)}</td>
              </tr>

              <tr>
                <td>VAT Rate</td>
                <td>{formatNumber(Number(receipt.vat_rate))}%</td>
              </tr>

              <tr>
                <td>VAT Amount</td>
                <td>{formatNumber(receipt.vat_amount)}</td>
              </tr>

              <tr className={scss.totalRow}>
                <td>Gross Taxable</td>
                <td>{formatNumber(receipt.gross_taxable)}</td>
              </tr>

              <tr className={scss.grandTotal}>
                <td>GROSS AMOUNT</td>
                <td>₱ {formatNumber(receipt.gross_amount)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <footer className={scss.footer}>
          <p>Thank you for your business!</p>

          <div className={scss.signature}>
            <div>
              <span>____________________________</span>
              <p>Authorized Representative</p>
            </div>

            <div>
              <span>____________________________</span>
              <p>Customer Signature</p>
            </div>
          </div>

          <p className={scss.generated}>
            Generated: {dayjs().format('MM/DD/YYYY hh:mm A')}
          </p>
        </footer>
      </div>
    </div>
  )
}

export default ReceiptModal
