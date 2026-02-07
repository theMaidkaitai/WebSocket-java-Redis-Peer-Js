import React, {useState} from 'react';
import "./styles/InputStyles/InputNickNameStyle.css"

interface InputComponentNickProps {
    setNickFunc: (name: string) => void;
}


const InputNickComponent: React.FC<InputComponentNickProps> = ({setNickFunc}) => {
    const [name, setName] = useState<string>('');

    const  handleInputChange = (e) => {
        e.preventDefault();
        setNickFunc(name);
        setName("");
    }

    return (
        <div>
            <div className="form-container1">
                <form action="" onSubmit={handleInputChange}>
                    <input type="text"
                           value={name}
                           onChange={e => setName(e.target.value)}
                           className="form-input1"
                    />
                    <button type={"submit"} className={"input-button1"}>Подтвердить ник</button>
                </form>

            </div>
        </div>
    );
};

export default InputNickComponent;