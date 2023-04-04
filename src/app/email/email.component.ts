import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
})
export class EmailComponent {
  constructor(private http: HttpClient) {}

  sendEmailWithAttachment() {
    const attachmentPath = 'C:/Users/erans/Downloads/table.xlsx';
    const emailParams = {
      to: 'eransam21@gmail.com',
      attachmentPath: attachmentPath,
    };

    this.http
      .post<any>('http://localhost:3001/api/send-email', emailParams)
      .subscribe(
        (response) => {
          console.log('Email sent successfully!', response);
        },
        (error) => {
          console.error('Error sending email:', error);
        }
      );
  }
}
