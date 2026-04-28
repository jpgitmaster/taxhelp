import Image from 'next/image'
import scss from './../documents/styles/CustomDropdown.module.scss'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function ScheduleCategoryDropdown(props: {
    err: boolean
    doc: {
        selectedCategory: {
            value: string,
            label: string,
            color: string
        }
    }
    options: {
        label: string
        value: string
        color: string
    }[]
    displayCategory: boolean

    setDisplayCategory: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleSelectCategory(selectedCategory: {
        value: string,
        label: string
    }): void
    
}) {
    const {
        doc,
        err,
        options,
        displayCategory,
        
        setDisplayCategory,

        handleToggle,
        handleSelectCategory,
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
        setDisplayCategory(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    return (
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput + (err ? ' '+scss.err : '')} onClick={() => handleToggle('categories')} ref={ref}
                role="combobox"
                aria-labelledby="selectedCategory"
                aria-expanded="false"
                tabIndex={0}
            >
                <div className={scss.arrow +' '+ (displayCategory ? scss.open : scss.close)}>
                    <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                </div>
                <div className={scss.selected} style={{
                    fontSize: '11px',
                    marginTop: '3px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}>
                    <div style={{
                        backgroundColor: doc.selectedCategory.color,
                        height: '10px', width: '10px',
                        borderRadius: '50%', marginRight: '5px'
                    }}></div>
                    {doc.selectedCategory.label} &nbsp; {err}
                </div>
            </div>
            {
                displayCategory &&
                <div className={scss.dropwdownList} style={{padding: '15px 10px'}}>
                    {
                        options?.length ?
                        <ul style={{height: 'auto', margin: 0}}>
                            {
                                options?.length ? options?.map((option, index) => 
                                    <li key={index} value={option.value} onClick={() => {
                                        setDisplayCategory(false)
                                        handleSelectCategory(option)
                                    }}
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}
                                    >
                                        <div style={{
                                            backgroundColor: option.color,
                                            height: '10px', width: '10px',
                                            borderRadius: '50%', marginRight: '5px'
                                        }}></div>
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