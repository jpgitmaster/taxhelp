import Image from 'next/image'
import { ClientObj } from '@/controllers/clients/types'
import Loader from '@/components/reusables/RotatingLoader'
import { useRef, useEffect, ChangeEvent, MouseEvent, Dispatch, SetStateAction } from 'react'
export default function ClientsDropdown(props: {
    doc: {
        search: string
        selectedTable: string
        client: {
            id: number | null,
            registered_name: string
        }
    }
    search: string
    clients: ClientObj[]
    displayClients: boolean
    scss: { [key: string]: string }

    setDisplayClients: Dispatch<SetStateAction<boolean>>

    handleToggle(dropdown: string): void
    handleChange(event: ChangeEvent<HTMLInputElement>): void
    handleSelectClient(client: { id: null | number, registered_name: string }): void
    
}) {
    const {
        doc,
        scss,
        search,
        clients,
        displayClients,
        
        setDisplayClients,

        handleChange,
        handleSelectClient,
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
        setDisplayClients(false)
    };
    const handleHeaderClick = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
    };
    const ref = useOutsideClick(handleClickOutside)
    return (
        <div className={scss.customDropdown} onClick={handleHeaderClick}>
            <div className={scss.dropdownInput} onClick={() => handleToggle('clients')} ref={ref}>
                <div className={scss.arrow +' '+ (displayClients ? scss.open : scss.close)}>
                    <Image src='/svgs/arrowDown.svg' alt='Arrow Down Icon' priority width={12} height={12} unoptimized={true} />
                </div>
                <div className={scss.selected}>
                    {doc.client.registered_name}
                    &nbsp;
                </div>
            </div>
            {
                displayClients &&
                <div className={scss.dropwdownList}>
                    <div className={scss.dropwdownSearch}>
                        <div className={scss.searchIcon}>
                            <Image src='/svgs/search.svg' alt='Search' priority width={12} height={12} unoptimized={true} />
                        </div>
                        <input name='search' type='text' value={search} onChange={handleChange} />
                    </div>
                    {
                        clients?.length ?
                        <ul>
                            {
                                clients.map(client => client.id &&
                                    <li key={client.id} value={client.id} onClick={() => {
                                        setDisplayClients(false)
                                        handleSelectClient(client)
                                    }}>
                                        {client.registered_name}
                                    </li>
                                )
                            }
                        </ul>
                        : <Loader scss={scss} position='absolute' />
                    }
                </div>
            }
        </div>
    );
}