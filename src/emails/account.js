const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// New Account - Welcome Email
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'contact@amrdesai.com',
        subject: 'Welcome to Task Manager App',
        text: `Welcome to Task Manager App, ${name}.`,
        // html: '',
    });
};

// Account Deletion Email
const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'contact@amrdesai.com',
        subject: `Sorry to see you go - Team TaskManagerApp`,
        text: `Goodbye ${name}. We hope see you soon. We value your feedback. 
        Please let us know how we can improve our service.
        Regards,
        Team TaskManagerApp`,
        // html: '',
    });
};

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail,
};
