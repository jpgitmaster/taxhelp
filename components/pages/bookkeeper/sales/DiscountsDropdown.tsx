import Image from 'next/image'
import scss from './../documents/styles/CustomDropdown.module.scss'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function DiscountsDropdown(props: {
    doc: {
        clientSearch: string
        selectedDiscount?: {
            value: string,
            label: string
        }
        client: {
            id: number | null,
            registered_name: string
        }
    }
    options: {
        label: string
        value: string
    }[]
    displayDiscounts: boolean

    setDisplayDiscounts: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleSelectDiscount(selectedDiscount?: {
        value: string,
        label: string
    }): void
    
}) {
    const {
        doc,
        options,
        displayDiscounts,
        
        setDisplayDiscounts,

        handleToggle,
        handleSelectDiscount,
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
        setDisplayDiscounts(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    return (
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('discounts')} ref={ref}
                role="combobox"
                aria-labelledby="selectedDiscount?"
                aria-expanded="false"
                tabIndex={0}
            >
                <div className={scss.arrow +' '+ (displayDiscounts ? scss.open : scss.close)}>
                    <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                </div>
                <div className={scss.selected}>
                    {doc.selectedDiscount?.label} &nbsp;
                </div>
            </div>
            {
                displayDiscounts &&
                <div className={scss.dropwdownList} style={{padding: '15px 10px'}}>
                    {
                        options?.length ?
                        <ul style={{height: 'auto', margin: 0}}>
                            {
                                options?.length ? options?.map((option, index) => 
                                    <li key={index} value={option.value} onClick={() => {
                                        setDisplayDiscounts(false)
                                        handleSelectDiscount(option)
                                    }}>
                                        {option.label}
                                    </li>
                                )
                                : ''
                            }
                        </ul>
                        : null
                    }
                </div>
            }
        </div>
    );
}