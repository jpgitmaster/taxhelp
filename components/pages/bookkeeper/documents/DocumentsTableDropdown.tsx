import Image from 'next/image'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function DocumentsTableDropdown(props: {
    doc: {
        search: string
        selectedTable: string
        client: {
            id: number | null,
            registered_name: string
        }
    }
    displayDocsTbl: boolean
    scss: { [key: string]: string }

    setDisplayDocsTbl: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleSelectTable(selectedTable: string): void
    
}) {
    const {
        doc,
        scss,
        displayDocsTbl,
        
        setDisplayDocsTbl,

        handleSelectTable,
        handleToggle
    } = props
    const docs = ['SALES', 'PURCHASES']
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
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('docs_table')} ref={ref}
                role="combobox"
                aria-labelledby="selectedTable"
                aria-expanded="false"
                tabIndex={0}
            >
                <div className={scss.arrow +' '+ (displayDocsTbl ? scss.open : scss.close)}>
                    <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                </div>
                <div className={scss.selected}>
                    {doc.selectedTable} &nbsp;
                </div>
            </div>
            {
                displayDocsTbl &&
                <div className={scss.dropwdownList} style={{padding: '15px 10px'}}>
                    {
                        docs?.length ?
                        <ul style={{height: 'auto', margin: 0}}>
                            {
                                docs?.length ? docs?.map((doc, index) => 
                                    <li key={index} value={doc} onClick={() => {
                                        setDisplayDocsTbl(false)
                                        handleSelectTable(doc)
                                    }}>
                                        {doc}
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