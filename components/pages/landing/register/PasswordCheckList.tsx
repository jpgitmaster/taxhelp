import React from 'react'
interface PropsDefinition {
    value: string
    scss: { [key: string]: string }
}
const PasswordCheckList = ({
    scss,
    value
}: PropsDefinition) => {
    const rules = [
        {
            label: 'at least 8 characters long.',
            validate: (value: string) => {
                return value && value.length >= 8;
            },
        },
        {
            label: 'at least one number.',
            validate: (value: string) => {
                return value && /.*[0-9].*/.test(value);
            },
        },
        {
            label: 'alphabet letters.',
            validate: (value: string) => {
                return value && /.*[a-zA-Z].*/.test(value);
            },
        },
        {
            label: 'at least one upper case letter.',
            validate: (value: string) => {
                return value && /.*[A-Z].*/.test(value);
            },
        },
        {
            label: 'at least one special character.',
            validate: (value: string) => {
                return value && /[^0-9a-zA-Z]/.test(value);
            },
        },
    ];
    return (
        <div className={scss.pwdCheck}>
            <p>Password must consist of: </p>
            <ul>
                {rules.map((rule, index) => {
                    const { label, validate } = rule;
                    const isValid = validate ? validate(value) : false;
                    return (
                        <li key={index} className={isValid ? scss.meet_requirement : ''}>
                            {label}
                        </li>
                    )
                })}
            </ul>
        </div>
    );
}

export default PasswordCheckList;