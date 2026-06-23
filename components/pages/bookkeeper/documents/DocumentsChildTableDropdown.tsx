import Image from 'next/image'
import scss from './styles/CustomDropdown.module.scss'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function DocumentsChildTableDropdown(props: {
    doc: {
        docSearch: string
        selectedChildTable?: {
            value: string,
            label: string,
            parentValue?: string
        }
        client: {
            id: number | null,
            registered_name: string
        }
    }
    options: {
        label: string
        value: string
        children?: {
            label: string
            value: string
        }[]
    }[]
    displayDocsTbl: boolean

    setDisplayDocsTbl: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleSelectTable(selectedTable: {
        value: string
        label: string
        parentValue?: string
    }): void
    
}) {
    const {
        doc,
        options,
        displayDocsTbl,
        
        setDisplayDocsTbl,

        handleSelectTable,
        handleToggle
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
        setDisplayDocsTbl(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    return (
        <div className={scss.customDropdown + (!options?.length ? ' '+scss.disabled : '')} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('child_docs_table')} ref={ref}
                role="combobox"
                aria-labelledby="selectedTable"
                aria-expanded="false"
                tabIndex={0}
            >
                <div className={scss.arrow +' '+ (displayDocsTbl ? scss.open : scss.close)}>
                    <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                </div>
                <div className={scss.selected} style={{fontSize: '11px', marginTop: '3.5px'}}>
                    {doc.selectedChildTable?.label} &nbsp;
                </div>
            </div>
            {
                displayDocsTbl &&
                <div className={scss.dropwdownList} style={{padding: '15px 10px'}}>
                    {
                        options?.length ?
                        <ul style={{margin: 0}}>
                            {
                                options?.length ? options?.map((option, index) => 
                                    <li key={index} value={option.value}
                                        onClick={() => {
                                            setDisplayDocsTbl(false)

                                            handleSelectTable(option)
                                        }}
                                        className={option.children?.length ? scss.hasChildren : ''}
                                    >
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