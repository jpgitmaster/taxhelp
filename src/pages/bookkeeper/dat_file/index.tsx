import dayjs from 'dayjs'
import * as XLSX from 'xlsx'
import Image from 'next/image'
import { DatePicker } from 'antd'
import { Table, Pagination } from 'antd'
import { useState, useEffect} from 'react'
import scss from './styles/Reports.module.scss'
import { signOut, getSession } from 'next-auth/react'
import CustomContainer from '@/components/reusables/CustomContainer'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { Session, PageProps } from '@/controllers/layouts/types/cms_types'

const DatFile_V = () => {
    const [width_, setWidth] = useState(0)
    const [rows, setRows] = useState<string[]>([])
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        const reader = new FileReader()
        reader.onload = (evt) => {
        const data = evt.target?.result
        if (!data) return
            const workbook = XLSX.read(data, { type: 'binary' })
            const sheet = workbook.Sheets[workbook.SheetNames[0]]
            const json = XLSX.utils.sheet_to_json(sheet, { defval: '' })
            const tableRows = json?.map((tableRow, index) => tableRow && ({
                ...tableRow,
                id: index
            }))
            console.log(tableRows)
            setRows(tableRows as string[])
        }
        reader.readAsBinaryString(f)
    }
    const handleUpload = async () => {
        if (!rows || rows.length === 0) {
            alert('No rows to upload. Please select an Excel file first.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/converter/dat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rows }),
            });

            if (!res.ok) {
                throw new Error('Conversion failed');
            }

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `sales-${dayjs().format('YYYYMMDD')}.dat`;
            document.body.appendChild(a);
            a.click();

            a.remove();
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error(err);
            alert('Error converting Excel to DAT');
        }
    };
    const columns = [
        {
            key: 'client_TIN',
            title: 'TIN Number',
            dataIndex: 'client_TIN',
        },
        {
            key: 'companyName',
            title: 'Company Name',
            dataIndex: 'companyName',
        },
        {
            key: 'lastName',
            title: 'Lastname',
            dataIndex: 'lastName',
        },
        {
            key: 'exempt',
            title: 'Exempt',
            dataIndex: 'exempt',
        },
        {
            key: 'zeroRated',
            title: 'Zero Rated',
            dataIndex: 'zeroRated',
        },
        {
            key: 'taxableNetofVat',
            title: 'Net Amount (excluding VAT)',
            dataIndex: 'taxableNetofVat',
        },
        {
            key: 'vatRate',
            title: 'VAT Rate',
            dataIndex: 'vatRate',
        },
        {
            key: 'outputVat',
            title: 'Output VAT',
            dataIndex: 'outputVat',
        },
        {
            key: 'totalSales',
            title: 'Total Sales',
            dataIndex: 'totalSales',
        },
        {
            key: 'grossTaxable',
            title: 'Gross Taxable',
            dataIndex: 'grossTaxable',
        },
        
    ];
    useEffect(() => {
        if(typeof window !== 'undefined'){
        setWidth(window.innerWidth - 240)
        }
    },[])
    return (
        <div>
            {
                rows?.length ?
                <>
                    <div className={scss.pageHeader}>
                        <button onClick={handleUpload} type='button' className={scss.button+' '+scss.btnorange}>
                            Convert to DAT File
                        </button>
                        <form className={scss.searchComponent}
                            // onSubmit={handleSubmitSearch}
                        >
                            <input id='search' type='text' name='search' maxLength={50} autoComplete='search' placeholder='Enter keyword...'
                                // value={filter.search} onKeyUp={handleBlur} onChange={handleSearch}
                            />
                            <button type='submit' className={`${scss.button} ${scss.btnblue}`}
                                // onKeyDown={handleResubmit}
                            >
                            Search
                            </button>
                        </form>
                    </div>
                    <div style={{width:width_+'px'}}>
                        <Table
                            rowKey='id'
                            columns={columns}
                            pagination={false}
                            dataSource={rows}
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </>
                :
                <>
                    <div className={scss.cards} style={{width: '700px', margin: '0 auto'}}>
                        <CustomContainer
                            scss={scss}
                            width={33}
                            required={true}
                            label='Select Client'
                            // err={customer.customerErr.firstName as string}
                        >
                            <select>
                                <option>
                                    RB ACCOUNTING OFFICE
                                </option>
                                <option>
                                    VALCITY VIRTUAL OFFICE
                                </option>
                                <option>
                                    QCITY VIRTUAL OFFICE
                                </option>
                            </select>
                        </CustomContainer>
                        <CustomContainer
                            scss={scss}
                            width={33}
                            required={true}
                            label='Select Reporting Type'
                            // err={customer.customerErr.firstName as string}
                        >
                            <select>
                                <option>
                                    SUMMARY LIST OF SALES (SLS)
                                </option>
                                <option>
                                    SUMMARY LIST OF PURCHASES (SLP)
                                </option>
                                <option>
                                    IMPORTATION
                                </option>
                                <option>
                                    QUARTERLY ALPHALIST OF PAYEES (QAP)
                                </option>
                            </select>
                        </CustomContainer>
                        <CustomContainer
                            scss={scss}
                            width={33}
                            required={true}
                            label='Month & Year'
                            // err={customer.customerErr.firstName as string}
                        >
                            <DatePicker picker="month" />
                        </CustomContainer>
                    </div>
                    <div className={scss.customFile}>
                        <div className={scss.customFileUpload}>
                            <label className={scss.customFile}>
                                <input
                                    name="file"
                                    type="file"
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                />
                                <div className={scss.empty_image}>
                                    <Image
                                        src="/svgs/reports.svg"
                                        alt="Empty Image"
                                        width={26}
                                        height={26}
                                        unoptimized
                                    />
                                </div>
                                <>
                                    <p>Browse or upload your report here</p>
                                    <span>
                                        Supported formats: .xls, .xlsx<br />
                                        Maximum file size: 5 MB
                                    </span>
                                </>
                            </label>
                        </div>
                    </div>
                </>
            }
            {/* <button onClick={handleUpload} disabled={loading}>
                {loading ? 'Converting...' : 'Convert to DAT'}
            </button> */}
        </div>
    )
}
export const getServerSideProps: GetServerSideProps<PageProps> = async (context: GetServerSidePropsContext) => {
  const session = await getSession(context) as Session
  if (!session?.user) {
    signOut({ redirect: true, callbackUrl: '/' })
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: { session }
  }
}
export default DatFile_V;