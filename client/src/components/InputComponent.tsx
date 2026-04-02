import React, { useState } from 'react';
import "../styles/InputComponentStyles/InputStyles.css"

interface InputComponentProps {
    value?: string;
    onChange?: (value: string) => void;
    onSubmit?: (value: string) => void;
    placeholder?: string;
    buttonText?: string;
}

const InputComponent = ({
                            value = '',
                            onChange,
                            onSubmit,
                            placeholder = "Your name",
                            buttonText = "Confirm"
                        }: InputComponentProps) => {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setLocalValue(newValue);
        onChange?.(newValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit?.(localValue);
    };

    return (
        <div className="input-container">
            <form onSubmit={handleSubmit} className="input-section">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="create-input"
                    value={localValue}
                    onChange={handleChange}
                />
                <button type="submit" className="form-button">
                    {buttonText}
                </button>
            </form>
        </div>
    );
};

export default InputComponent;