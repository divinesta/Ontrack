type SendEmailInput = {
   to: string;
   subject: string;
   hrml: string;
}

export const sendEmail = async (_input: SendEmailInput) => {
   throw new Error("Infobip email integration is not implemented yet");
}