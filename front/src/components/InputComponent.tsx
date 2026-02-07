import React, {useState} from 'react';
import "./styles/InputStyles/InputStyle.css"

interface InputComponentProps {
    createRoom: (name: string) => void;
}

const InputComponent: React.FC<InputComponentProps> = ({createRoom}) => {
    const [name, setName] = useState<string>('');
    const  handleInputChange = (e) => {
        e.preventDefault();
        createRoom(name);
        setName("");
    }
    
    return (
        <div>
            <div className="form-container">
                <form action="" onSubmit={handleInputChange}>
                    <input type="text"
                           value={name}
                           onChange={e => setName(e.target.value)}
                           className="form-input"
                    />
                    <button type={"submit"} className={"input-button"}>Создать комнату</button>
                </form>
            </div>
        </div>
    );
};

export default InputComponent;