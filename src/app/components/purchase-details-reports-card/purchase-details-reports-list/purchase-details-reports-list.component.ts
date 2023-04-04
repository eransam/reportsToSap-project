import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-purchase-details-reports-list',
  templateUrl: './purchase-details-reports-list.component.html',
  styleUrls: ['./purchase-details-reports-list.component.scss'],
})
export class PurchaseDetailsReportsListComponent implements OnInit {
  purchases: any[];

  constructor(private reportService: ReportService) {}

  async ngOnInit(): Promise<void> {
    this.purchases = await this.reportService.bringRepIntheCurrentMonth();
    console.log('this.purchases: ', this.purchases);
  }

  public addRep(rep: any) {
    this.purchases = rep;

    console.log('this.purchases in addRep: ', this.purchases);
    console.log('this.purchases[0]: ', this.purchases[0]);
    console.log('this.purchases[0].day: ', this.purchases[0].day);
  }
}
