import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
require('dotenv').config();

// Interfaz para las opciones del correo electrónico
interface EmailOptions {
    email: string;
    subject: string;
    template: string;
    data: { [key: string]: any };
}

// Función para enviar un correo electrónico
const sendEmail = async (options: EmailOptions): Promise<void> => {
    // Configuración del transporte de Nodemailer
    const transporter: Transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        service: process.env.SMTP_SERVICE,
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD
        },
    });

    const { email, subject, template, data } = options;

    // Obtiene la ruta del archivo de la plantilla de correo
    const templatePath = path.join(__dirname, '../mails', template);

    // Renderiza la plantilla de correo con EJS
    const html: string = await ejs.renderFile(templatePath, data);

    // Configuración del correo a enviar
    const mailOptions = {
        from: process.env.SMTP_MAIL,
        to: email,
        subject,
        html,
    };

    // Envía el correo
    await transporter.sendMail(mailOptions);
};

export default sendEmail;
