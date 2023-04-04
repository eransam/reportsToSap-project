import { Injectable } from '@angular/core';
import { EMAIL_CONFIG } from './email-config';
import * as EmailJS from 'emailjs-com';

declare let Email: any;

export interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  secure: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  static sendEmail(email: any): void {
    Email.send(
      'service_z7hnnos', // email service ID
      'template_ph8zpmo', // email template ID
      {
        ...email,
        from: 'eransam21@gmail.com', // replace with your email address
        to: 'eransam21@gmail.com', // replace with recipient's email address
        subject: 'Subject',
        // any additional options you want to pass to the EmailJS API
      }
    )
      .then((response: any) => {
        console.log('Email sent successfully:', response);
      })
      .catch((error: any) => {
        console.error('Email send failed:', error);
      });
  }
}
