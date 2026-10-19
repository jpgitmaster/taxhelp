import { useState, ChangeEvent } from "react";


const TestPage = () => {
    const [age, setAge] = useState<number | null>(null);
    const [birthYear, setBirthYear] = useState<number | null>(null);
    
    const handleBirthYear = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        const year = parseInt(inputValue);
        if (!isNaN(year)) {
            setBirthYear(year);
        }
        return false
    }
    const calculateAge = () => {
        const currentYear = new Date().getFullYear();
        console.log(currentYear - (birthYear || 0))
        setAge(currentYear - (birthYear || 0));
    }
    return (
        <>
            <h1>Test Page</h1>
            <input type="text" placeholder="Enter your birth year..." onChange={handleBirthYear} />
            {
                age && <p>Your current age is {age} years old.</p>
            }
            <button onClick={calculateAge}>
                Calculate Age
            </button>
        </>
    );
}
export default TestPage;