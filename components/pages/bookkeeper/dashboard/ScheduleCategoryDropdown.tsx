import Image from 'next/image'
import { CirclePicker } from 'react-color'
import { CloseOutlined } from '@ant-design/icons';
import useGlobal from '@/controllers/global/useGlobal';
import useDashboardAPI from '@/controllers/dashboard/api';
import Loader from '@/components/reusables/RotatingLoader';
import scss from './../documents/styles/CustomDropdown.module.scss'
import ValidatorV3 from '@/components/reusables/validation/ValidatorV3'
import { useRef, useEffect, MouseEvent, Dispatch, SetStateAction, useState, ChangeEvent } from 'react'
export default function ScheduleCategoryDropdown(props: {
    err: boolean
    doc: {
        selectedCategory: {
            name: string,
            color: string
        }
    }
    schedCategories: {
        id: number,  name: string, color: string
    }[]
    categoryLoader: boolean
    displayCategory: boolean

    setDisplayCategory: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleSelectCategory(selectedCategory: {
        name: string,
        color: string
    }): void
    
}) {
    const {
        doc,
        err,
        categoryLoader,
        displayCategory,
        schedCategories,
        
        setDisplayCategory,

        handleToggle,
        handleSelectCategory,
    } = props
    const {
        handleBlur,
    } = useGlobal()
    const {
        useCreateCategory,
    } = useDashboardAPI()
    const [catErr, setCatErr] = useState<any>({
        name: '',
        color: ''
    })
    const [loader, setLoader] = useState(false)
    const [cat, setCat] = useState({ name: '', color: '' })
    const [displayAddCat, setDisplayAddCat] = useState(false)
    
    const fieldValidations = {
        name: { usename: 'Category Name', required: true },
        color: { usename: 'Color', required: true },
    }
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

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        // setRole({ ...role, [name]: value });
        setCat({
            ...cat,
            [name]: value
        })
        setCatErr({ name: '', color: '' })
    }
    // HANDLE COLOR CHANGES
    const handleColorChange = (color: { hex: string }) => {
        setCat({
            ...cat,
            color: color.hex
        })
        setCatErr({ name: '', color: '' })
    }
    const handleCreateCategory = async () => {
        setLoader(true)
        const {
            validation_errors,
            validation_has_error,
        } = ValidatorV3(fieldValidations, cat)
        if (validation_has_error) {
            const timer = setTimeout(() => {
                setLoader(false)
                setCatErr(validation_errors)
                return false
            }, 500)
            return () => clearTimeout(timer)
        }

        useCreateCategory.mutate(cat, {
            onSuccess: () => {
                setCat({ name: '', color: '' })
                setCatErr({ name: '', color: '' })
                setDisplayAddCat(false)
                setLoader(false)
            }
        })
        
    }
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
                    {doc.selectedCategory.name} &nbsp; {err}
                </div>
            </div>
            
            {
                displayCategory &&
                <div className={scss.dropwdownList} style={{padding: '10px 8px 30px', marginTop: '-5px'}}>
                    {(categoryLoader || loader) && (
                    <Loader scss={scss} position='absolute' />
                    )}
                    {
                        !displayAddCat ?
                            (
                                schedCategories?.length ?
                                    <ul style={{height: '80px', padding: 0, margin: 0}}>
                                        {
                                            schedCategories?.length ? schedCategories?.map((option: { id: number,  name: string, color: string }) => 
                                                <li key={option.id} onClick={() => {
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
                                                    {option.name}

                                                    <button type='button' className={scss.action+' '+scss.edit}
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                        }}
                                                    >
                                                        <Image src='/svgs/edit.svg' alt='Edit' priority width={20} height={20} unoptimized={true} />
                                                    </button>
                                                </li>
                                            )
                                            : null
                                        }
                                    </ul>
                                    :
                                    <div className={scss.noCategory}>
                                        No category yet
                                    </div>
                            )
                        :
                        <div className={scss.categoryCreation}>
                            <button onClick={() =>
                                {
                                    setDisplayAddCat(false);
                                    setCat({ name: '', color: '' });
                                    setCatErr({ name: '', color: '' });
                                }
                            } className={scss.categoryClose}>
                                <CloseOutlined style={{width: '100%'}} />
                            </button>
                            <div className={scss.inputCategory + ((catErr.name || catErr.color) ? ' '+scss.catErr : '')}>
                                <div className={scss.selectedColor} style={{
                                    backgroundColor: cat.color || ''
                                }}></div>
                                <input
                                    type='text'
                                    name='name'
                                    placeholder='Category Name'
                                    value={cat.name}
                                    maxLength={30}
                                    onKeyUp={handleBlur}
                                    onChange={handleChange}
                                    style={{marginBottom: '20px'}}
                                />
                                <span className={scss.catErr}>{catErr.name ? catErr.name : catErr.color ? catErr.color : ''}&nbsp;</span>
                            </div>
                            <CirclePicker
                                width='220px'
                                circleSize={15}
                                circleSpacing={8}
                                onChangeComplete={handleColorChange}
                                color={cat.color || ''}
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
                            <button type='button' onClick={() => {
                                handleCreateCategory();
                            }}>
                                Save New Category
                            </button>
                        }
                        
                    </div>
                </div>
            }
        </div>
    );
}