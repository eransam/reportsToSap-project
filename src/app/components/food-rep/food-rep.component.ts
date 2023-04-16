import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/services/reports.service';

@Component({
    selector: 'app-food-rep',
    templateUrl: './food-rep.component.html',
    styleUrls: ['./food-rep.component.scss']
})
export class FoodRepComponent implements OnInit {
  purchases: any[];

  constructor(private reportService: ReportService) {}

  async ngOnInit(): Promise<void> {
    this.purchases = await this.reportService.bringRepIntheCurrentMonth();
    console.log('this.purchases: ', this.purchases);
  }

  public addRep(rep: any) {
    this.purchases = rep;
  }
}

