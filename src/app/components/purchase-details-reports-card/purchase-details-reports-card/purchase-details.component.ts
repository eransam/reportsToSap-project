import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ReportService } from '../../../services/reports.service';
import * as XLSX from 'xlsx';
import { EmailService } from 'src/app/services/email-service/email.service';

interface EmailConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  from: string;
  secure?: boolean;
  attachments?: {
    filename: string;
    content: any;
    encoding?: string;
    contentType?: string;
  }[];
}

@Component({
  selector: 'app-purchase-details',
  templateUrl: './purchase-details.component.html',
  styleUrls: ['./purchase-details.component.scss'],
})
export class PurchaseDetailsComponent implements OnInit {
  @Input() purchases: any;
  @ViewChild('myTable', { static: false }) table: ElementRef;

  constructor(
    private reportService: ReportService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {}

  async onSendEmail(): Promise<void> {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const email: EmailConfig = {
      host: 'smtp.example.com',
      port: 587,
      username: 'eransam21@gmail.com',
      password: 'erueushk28Ee',
      from: 'eransam21@gmail.com',
      secure: false,
      attachments: [
        {
          filename: 'table.xlsx',
          content: XLSX.write(workbook, { bookType: 'xlsx', type: 'base64' }),
          encoding: 'base64',
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ],
    };
    EmailService.sendEmail(email);
  }

  exportExcel(): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'table.xlsx');
  }
}
