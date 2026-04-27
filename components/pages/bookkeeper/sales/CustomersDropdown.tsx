import Image from 'next/image'
import Loader from '@/components/reusables/RotatingLoader'
import { CustomersObj } from '@/controllers/sales/types/customers'
import scss from './../documents/styles/CustomDropdown.module.scss'
import { useRef, useEffect, ChangeEvent, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function CustomersDropdown(props: {
    doc: {
        customerSearch: string
        hasSelectedClient?: boolean
        selectedTerms?: {
            value: string,
            label: string
        }
        customer: {
            id: number | null,
            last_name: string
            first_name: string
            trade_name: string
            registered_name: string
        }
    }
    loader: boolean
    customers: CustomersObj[]
    displayCustomers: boolean

    setDisplayCustomers: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleClearSelected?: (dropdown: string) => void
    handleChange(event: ChangeEvent<HTMLInputElement>): void
    handleSelectClient(client: { id: null | number, registered_name: string }): void
    
}) {
    const {
        doc,
        loader,
        customers,
        displayCustomers,
        
        setDisplayCustomers,

        handleToggle,
        handleChange,
        handleSelectClient,
        handleClearSelected
    } = props
    // CLICK OUTSIDE
    const useOutsideClick = (callback: () => void) => {
        const ref = useRef<HTMLDivElement>(null)
    
        useEffect(() => {
        const handleClick = () => {
            callback();
        };
    
        document.addEventListener('click', handleClick);
    
        return () => {
            document.removeEventListener('click', handleClick);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
    
        return ref;
    };
    const handleClickOutside = () => {
        setDisplayCustomers(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    const selectedText =
    (doc.customer.registered_name || '') ||
    (doc.customer.first_name
        ? `${doc.customer.first_name} ${doc.customer.last_name}`
        : '');

    const displayText = selectedText +
    (doc.customer.trade_name ? ` - ${doc.customer.trade_name}` : '');
    return (
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('customers')} ref={ref}>
                {
                    doc.hasSelectedClient ?
                    <div className={scss.erase} onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelected?.('client');
                    }}>
                        <Image src='/svgs/eraser.svg' alt='Erase Icon' priority width={15} height={15} unoptimized={true} />
                    </div>
                    :
                    <div className={scss.arrow +' '+ (displayCustomers ? scss.open : scss.close)}>
                        <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                    </div>
                }
                
                <div className={scss.selected} title={displayText}>
                    {displayText}
                    &nbsp;
                </div>
            </div>
            {
                displayCustomers &&
                <div className={scss.dropwdownList}>
                    <div className={scss.dropwdownSearch}>
                        <div className={scss.searchIcon}>
                            <Image src='/svgs/search.svg' alt='Search' priority width={12} height={12} unoptimized={true} />
                        </div>
                        <input name='customerSearch' type='text' value={doc.customerSearch} onChange={handleChange} />
                    </div>
                    {
                        customers?.length ?
                        <ul>
                            {
                                customers.map(customer => customer.id &&
                                    <li key={customer.id} value={customer.id} onClick={() => {
                                        setDisplayCustomers(false)
                                        handleSelectClient(customer)
                                    }}>
                                        <strong>
                                            {customer.registered_name || (customer.first_name+' '+customer.last_name)}
                                        </strong>
                                        <p>
                                            {customer.trade_name}
                                        </p>
                                    </li>
                                )
                            }
                        </ul>
                        : <p className={scss.noClient}>No client found.</p>
                    }
                    {loader &&  <Loader scss={scss} position='absolute' />}
                </div>
            }
        </div>
    );
}