async function sendEmail(to: string, subject: string, body: string) {
    // Logic to send email
        import nodemailer from 'nodemailer';

        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com', // Replace with your SMTP server
            port: 587, // Replace with your SMTP port
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'your-email@example.com', // Replace with your email
                pass: 'your-email-password', // Replace with your email password
            },
        });

        // Set up email data
        const mailOptions = {
            from: '"Sender Name" <your-email@example.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: body, // plain text body
            // html: '<b>Hello world?</b>' // html body (optional)
        };

        // Send mail with defined transport object
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log('Message sent: %s', info.messageId);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    // Use subject and body in the email
}