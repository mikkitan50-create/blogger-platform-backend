import { CONFIRM_EMAIL_URL } from '../../settings/config';

export const emailExamples = {
  registrationEmail(code: string): string {
    return `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='${CONFIRM_EMAIL_URL}?code=${code}'>complete registration</a>
 </p>`;
  },
};