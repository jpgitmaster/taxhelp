import Image from 'next/image'
import scss from './styles/CustomDropdown.module.scss'
import { DocObj } from '@/controllers/documents/types'
import Loader from '@/components/reusables/RotatingLoader'
import { useRef, useEffect, ChangeEvent, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function DocumentsDropdown(props: {
    doc: {
        docSearch: string
        hasSelectedDocument: boolean
        selectedTerms?: {
            value: string,
            label: string
        }
        document: {
            id: number | null
            file_name: string
        }
    }
    loader: boolean
    documents: DocObj[]
    displayDocuments: boolean
    

    setDisplayDocuments: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleClearSelected?: (dropdown: string) => void
    handleChange(event: ChangeEvent<HTMLInputElement>): void
    handleSelectDocument(document: { id: null | number, file_name: string }): void
    
}) {
    const {
        doc,
        loader,
        documents,
        displayDocuments,
        
        setDisplayDocuments,

        handleChange,
        handleToggle,
        handleClearSelected,
        handleSelectDocument
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
        setDisplayDocuments(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    return (
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('documents')} ref={ref}>
                {
                    doc.hasSelectedDocument ?
                    <div className={scss.erase} onClick={(e) => {
                        e.stopPropagation();
                        handleClearSelected?.('document');
                    }}>
                        <Image src='/svgs/eraser.svg' alt='Erase Icon' priority width={15} height={15} unoptimized={true} />
                    </div>
                    :
                    <div className={scss.arrow +' '+ (displayDocuments ? scss.open : scss.close)}>
                        <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                    </div>
                }
                <div className={scss.selected}>
                    {(doc.document.file_name ? doc.document.file_name : '')}
                    &nbsp;
                </div>
            </div>
            {
                displayDocuments &&
                <div className={scss.dropwdownList}>
                    <div className={scss.dropwdownSearch}>
                        <div className={scss.searchIcon}>
                            <Image src='/svgs/search.svg' alt='Search' priority width={12} height={12} unoptimized={true} />
                        </div>
                        <input name='docSearch' type='text' value={doc.docSearch} onChange={handleChange} />
                    </div>
                    {
                        documents?.length ?
                        <ul>
                            {
                                documents.map(document => document.id &&
                                    <li key={document.id} value={document.id} onClick={() => {
                                        setDisplayDocuments(false)
                                        handleSelectDocument(document)
                                    }}>
                                        <strong>
                                            {document.file_name}
                                        </strong>
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