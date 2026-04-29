import Image from 'next/image'
import { CirclePicker } from 'react-color'
import scss from './../documents/styles/CustomDropdown.module.scss'
import CustomContainer from '@/components/reusables/CustomContainer'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction, useState } from 'react'
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
    const [displayAddCat, setDisplayAddCat] = useState(false)
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
                <div className={scss.dropwdownList} style={{padding: '15px 10px 30px'}}>
                    {
                        !displayAddCat ?
                            (
                                options?.length ?
                                    <ul style={{height: 'auto', margin: 0}}>
                                        {
                                            options?.length ? options?.map((option, index) => 
                                                <li key={index} value={option.value} onClick={() => {
                                                    setDisplayCategory(false)
                                                    handleSelectCategory(option)
                                                }}
                                                style={{
                                                    padding: '4px',
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
                            )
                        :
                        <div style={{paddingInline: '5px', marginBottom: '10px'}}>
                            <input
                                type='text'
                                id='category_name'
                                name='category_name'
                                placeholder='Category Name'
                                // value={dashboard.scheduleObj.category_name}
                                // onKeyUp={handleBlur}
                                // onChange={handleChange}
                                style={{marginBottom: '15px'}}
                            />
                            <CirclePicker
                                width='220px'
                                circleSize={15}   // default is ~28
                                circleSpacing={8}
                            />
                        </div>
                    }
                    <div className={scss.createNewCategory}>
                        {
                            !displayAddCat ?
                            <button type='button' onClick={() => setDisplayAddCat(true)}>
                                Create New Category
                            </button>
                            :
                            <button type='button' onClick={() => setDisplayAddCat(false)}>
                                Save New Category
                            </button>
                        }
                        
                    </div>
                </div>
            }
        </div>
    );
}