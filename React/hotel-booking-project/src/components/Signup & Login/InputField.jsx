import './InputField.css'

function InputField({ labelText, inputType, inputId, inputName, value, onChange }) {
    // Takes input labelText, inputType, inputId, inputName, value, and onChange as properties, used below to create the input field

    return (
        <div className="input-field">
            <input
                type={inputType} // provided inputType
                id={inputId} // provided inputId
                name={inputName} // provided inputName
                placeholder={labelText} // provided labelText
                value={value} // provided value
                onChange={onChange} // provided onChange
            />
        </div>
    )
}

export default InputField
