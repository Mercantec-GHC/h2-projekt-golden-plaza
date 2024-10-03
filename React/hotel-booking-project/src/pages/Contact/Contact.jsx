import { useState } from 'react';

// Page for sending an email to the support team
// Was promptly replaced by a ticket system instead
const Contact = () => {
    // Default values for email recipient and recipient's name
    const [emailToId] = useState('INSERT REPLY EMAIL HERE'); // The default email address to send the message to
    const [emailToName] = useState('Support'); // The default recipient name (e.g., Support team)

    // State to handle the email's subject and body, set by the user
    const [emailSubject, setEmailSubject] = useState(''); // Stores the subject of the email
    const [emailBody, setEmailBody] = useState(''); // Stores the body of the email (user's message)

    // State to store the response message after email is sent (success/failure)
    const [response, setResponse] = useState(''); // Feedback message displayed to the user after submission

    // Function to handle form submission (when the user sends the email)
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the default form submission behavior (page reload)

        // Prepare the email data object to be sent in the request
        const emailData = {
            emailToId,     // The recipient's email address
            emailToName,   // The recipient's name
            emailSubject,  // The subject input from the form
            emailBody      // The message input from the form
        };

        try {
            // Make a POST request to send the email
            const res = await fetch('https://localhost:7207/Mail', {
                method: 'POST', // HTTP method for sending data
                headers: {
                    'Content-Type': 'application/json', // Indicate that we're sending JSON data
                    'accept': 'text/plain' // Accept plain text response
                },
                body: JSON.stringify(emailData) // Convert the email data object to JSON and send it
            });

            if (res.ok) {
                // If the request was successful, show a success message
                setResponse('Email sent successfully!');
                // Clear the subject and body fields after the email is sent
                setEmailSubject('');
                setEmailBody('');
            } else {
                // If the request failed (non-2xx response), show a failure message
                setResponse('Failed to send email.');
            }
        } catch (error) {
            // If an error occurs during the request, log the error and show an error message
            console.error('Error:', error);
            setResponse('An error occurred while sending the email.');
        }
    };

    return (
        <div className="backgroundLogin">
            <div className="login-container">
                <div>
                    {/* Form for entering email subject and message */}
                    <form onSubmit={handleSubmit}>
                        {/* Input field for email subject */}
                        <div>
                            <label>Subject: </label>
                            <input
                                type="text"
                                value={emailSubject} // Bind the subject input to emailSubject state
                                onChange={(e) => setEmailSubject(e.target.value)} // Update emailSubject state on input change
                                required // Make the field required
                            />
                        </div>
                        {/* Textarea for the email message body */}
                        <div>
                            <label>Your Message: </label>
                            <textarea
                                value={emailBody} // Bind the textarea to emailBody state
                                onChange={(e) => setEmailBody(e.target.value)} // Update emailBody state on input change
                                required // Make the field required
                            />
                        </div>
                        {/* Submit button to send the email */}
                        <button type="submit">Send Email</button>
                    </form>
                    {/* Display the response message after form submission */}
                    {response && <p>{response}</p>}
                </div>
            </div>
        </div>
    );
};

export default Contact;
