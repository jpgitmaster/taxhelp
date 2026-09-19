import Image from 'next/image'
import scss from './styles/AuditTrailDropdown.module.scss'
import { useRef, useEffect, useState, MouseEvent } from 'react'

interface Option {
    value: string
    label: string
}

interface Props {
    label: string
    placeholder: string
    options: Option[]
    value: string
    onSelect(value: string): void
}

export default function AuditTrailDropdown(props: Props) {
    const { label, placeholder, options, value, onSelect } = props
    const [display, setDisplay] = useState(false)

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
        setDisplay(false);
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)

    const selected = options.find((option) => option.value === value)

    return (
        <div className={scss.filterDropdown}>
            <span className={scss.label}>{label}</span>
            <div className={scss.customDropdown} onClick={handleHeaderClick}>
                <div className={scss.dropdownInput} onClick={() => setDisplay((prev) => !prev)} ref={ref}>
                    <div className={scss.selected}>
                        {
                            selected?.label ?
                            selected.label :
                            <span className={scss.placeholder}>
                                {placeholder}
                            </span>
                        }
                    </div>
                    {
                        value ?
                        <div className={scss.erase} onClick={(e) => {
                            e.stopPropagation();
                            onSelect('');
                        }}>
                            <Image src='/svgs/eraser.svg' alt='Clear' priority width={15} height={15} unoptimized={true} />
                        </div>
                        :
                        <div className={scss.arrow + ' ' + (display ? scss.open : scss.close)}>
                            <Image src='/svgs/arrowDown.svg' alt='Arrow Down' priority width={12} height={12} unoptimized={true} />
                        </div>
                    }
                </div>
                {
                    display &&
                    <div className={scss.dropwdownList}>
                        {
                            options?.length ?
                            <ul>
                                {
                                    options.map(option =>
                                        <li key={option.value} onClick={() => {
                                            setDisplay(false)
                                            onSelect(option.value)
                                        }}>
                                            <strong>{option.label}</strong>
                                        </li>
                                    )
                                }
                            </ul>
                            : <p className={scss.noItems}>No options found.</p>
                        }
                    </div>
                }
            </div>
        </div>
    );
}