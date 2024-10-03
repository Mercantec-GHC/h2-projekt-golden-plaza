import { useState } from 'react';

const MailForm = () => {
    const [emailToId, setEmailToId] = useState('');
    const [emailToName, setEmailToName] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [response, setResponse] = useState('');

    //When the button is clicked then the sequence below runs and sends a mail.
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Strings
        const emailData = {
            emailToId,
            emailToName,
            emailSubject,
            emailBody
        };

        // Using a post request via the MailController. 
        try {
            const res = await fetch('https://localhost:7207/Mail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'text/plain'
                },
                body: JSON.stringify(emailData)
            });

            //Checks if the result is valid or not.
            if (res.ok) {
                //const result = await res.json();
                setResponse('Email sent successfully!');
            } else {
                setResponse('Failed to send email.');
            }
        //Error handling
        } catch (error) {
            console.error('Error:', error);
            setResponse('An error occurred while sending the email.');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    {/* Each of the text boxes apply the text to a set variable, and after pressing the button, then that data will be used in the sequence above. */ }
                    <label>Email To (ID): </label>
                    <input
                        type="text"
                        value={emailToId}
                        onChange={(e) => setEmailToId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email To (Name): </label>
                    <input
                        type="text"
                        value={emailToName}
                        onChange={(e) => setEmailToName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Subject: </label>
                    <input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Body: </label>
                    <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Email</button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default MailForm;
