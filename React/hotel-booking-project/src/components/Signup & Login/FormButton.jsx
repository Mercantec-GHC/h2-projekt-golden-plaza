import './FormButton.css';

function FormButton({ type, text }) {
    // Takes input type and text as properties, used below to create the button

    return (
        <button type={type} className="form-button"> {/* provided type used on button */}
            {text}                                   {/* provided text used in button text */}
        </button>
    )
}

export default FormButton
