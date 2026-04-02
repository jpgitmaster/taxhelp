import { KeyboardEvent, Dispatch, SetStateAction } from 'react'
const useGlobal = () => {
    const handleResubmit = (e: KeyboardEvent<HTMLButtonElement>) => {
        if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).code === 'Space'){
            e.preventDefault();
            (e.target as HTMLInputElement).blur()
        }
    }
    const handleBlur = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement>) => {
        if ((e as KeyboardEvent).key === 'Enter') {
            e.preventDefault();
            (e.target as HTMLInputElement).blur()
        }
    }

    const handleRemoveErr = (err: { [key: string]: string | { value: string; } }, name: string) => {
        if (err[name]) {
            // If the value is an object with a 'value' property, remove the 'value' property
            if (typeof err[name] === 'object' && 'value' in err[name]) {
                delete err[name];
            }
            // If it's a string, simply delete the property
            else {
                delete err[name];
            }
        }
    }
    
    const handleRemoveErrArray = (errArr: [{ [key: string]: string | { value: string; } }], name: string, index: number, setErrArr: Dispatch<SetStateAction<[{ [key: string]: string | { value: string; } }]>>) => {
        const updatedErrArr = errArr.map((err, idx) => {
            if (idx === index) {
                const newErr = { ...err };
                if (newErr[name]) {
                    delete newErr[name];
                }
                return newErr;
            }
            return err;
        });
        setErrArr(updatedErrArr as [{ [key: string]: string | { value: string; } }]);
    };
    return {
        handleBlur,
        handleResubmit,
        handleRemoveErr,
        handleRemoveErrArray,
    }
}

export default useGlobal;