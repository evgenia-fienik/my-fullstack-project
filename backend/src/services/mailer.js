import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    }
})

export const sendVerificationEmail = async (email, token) => {

    console.log('=== SENDING EMAIL ===');
    console.log('to:', email);
    console.log('token:', token);

    const verificationUrl = `${process.env.APP_URL}/api/users/verify-email?token=${token}`;

    await transport.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject: 'Підтвердження email',
        html:`
        <h2>Підтвердження нового email</h2>
        <p>Для підтвердження нового email натисніть на кнопку нижче:</p>
        <a href="${verificationUrl}" style="
        background-color: #4CAF50;
        color: white;
        padding: 14px 20px;
        text-decoration: none;
        border-radius: 4px;
      ">Підтвердити email</a>
        <p>Посиляння дійсне 24 години</p>`,
    })
}