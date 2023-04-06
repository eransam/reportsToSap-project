import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ReportService } from '../../services/reports.service';
import { Router } from '@angular/router';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-search-reports',
  templateUrl: './search-reports.component.html',
  styleUrls: ['./search-reports.component.scss'],
})
export class SearchReportsComponent implements OnInit {
  AllTotalAmountByYearAndMonth: any = '';
  TotalAmountDay: any = '';
  TotalAmountMonth: any = '';
  TotalAmountYear: any = '';
  totalAmountTemplate: any = '';
  hova: any = '135201';
  zhot: any = '521222';
  theTtxetToTheAscii: any = '';

  @Output()
  public addRep = new EventEmitter<any>();
  selectedDepartment: any;
  selectedMonth: string;
  selectedYear: string;
  username: string;
  users: any[] = [];
  users2: any[];
  yearInput: FormControl;
  DetailsForm: FormGroup;
  monthInput: FormControl;
  usernameInput: FormControl;
  detailsFromformUsername: any = '';
  detailsFromformcheckbox: any = '';
  detailsFromformMonth: any = '';
  detailsFromformYear: any = '';

  filteredUsers: Observable<string[]>;

  usernameControl = new FormControl();
  selectedDepartmentControl = new FormControl();
  constructor(
    private reportService: ReportService,
    public router: Router,
    private notify: NotifyService
  ) {
    // Initialize the filteredUsers observable

    this.filteredUsers = this.usernameControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  async ngOnInit(): Promise<void> {
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear().toString();
    this.selectedMonth = (currentDate.getMonth() + 1).toString();

    (this.monthInput = new FormControl('', Validators.required)),
      (this.yearInput = new FormControl('', Validators.required)),
      (this.usernameInput = new FormControl('', Validators.required));
    this.DetailsForm = new FormGroup({
      nameBox: this.monthInput,
      priceBox: this.usernameInput,
      yaerBox: this.yearInput,
    });

    this.users2 = await this.reportService.getFullNameAnrUserId();
    for (let i = 0; i < this.users2.length; i++) {
      this.users.push(`${this.users2[i].fullname}-${this.users2[i].userId}`);
    }

    this.totalAmountTemplate = this.totalAmountTemplate
      .toString()
      .replace(/\./g, '0')
      .padStart(12, '0');

    console.log('this.totalAmountTemplate: ', this.totalAmountTemplate);
    this.theTtxetToTheAscii = `0\n${
      this.hova
    } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n       ${
      this.zhot
    } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`;
  }

  asciiContent: Blob = new Blob(
    [
      `0\n${
        this.hova
      } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n       ${
        this.zhot
      } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
    ],
    { type: 'text/plain' }
  );

  downloadFile() {
    this.asciiContent = new Blob(
      [
        `  0                                                                                     \r\n  ${
          this.hova
        }             ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \r\n          ${
          this.zhot
        }     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \r\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
      ],
      { type: 'text/plain' }
    );

    console.log('asciiContent: ', this.asciiContent);

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(this.asciiContent));
    link.setAttribute('download', 'MOVEIN.DAT');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async add() {
    if (
      this.detailsFromformUsername === undefined &&
      this.detailsFromformcheckbox === true
    ) {
    }

    this.detailsFromformUsername = this.usernameControl.value;
    this.detailsFromformcheckbox = this.selectedDepartmentControl.value;
    this.detailsFromformMonth = this.monthInput.value;
    this.detailsFromformYear = this.yearInput.value;
    console.log('this.detailsFromformUsername: ', this.detailsFromformUsername);
    console.log('this.detailsFromformMonth: ', this.detailsFromformMonth);
    console.log('this.detailsFromformYear: ', this.detailsFromformYear);
    console.log('this.selectedDepartment: ', this.selectedDepartment);
    console.log('this.detailsFromformcheckbox: ', this.detailsFromformcheckbox);
    if (this.detailsFromformUsername === undefined) {
      const results = await this.reportService.bringRepIntheChosenMonthAndYear(
        this.detailsFromformMonth,
        this.detailsFromformYear
      );
      this.addRep.emit(results);
    } else {
      if (this.detailsFromformcheckbox) {
        const results = await this.reportService.bringRepFull(
          this.detailsFromformUsername,
          this.detailsFromformMonth,
          this.detailsFromformYear
        );
        this.addRep.emit(results);
      } else {
        const results = await this.reportService.bringRepMin(
          this.detailsFromformUsername,
          this.detailsFromformMonth,
          this.detailsFromformYear
        );

        console.log('results: ', results);
        this.addRep.emit(results);

        //   this.notify.success('added');
        // this.DetailsForm.reset();
        // this.router.navigateByUrl('/admin-home');
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) =>
      user.toLowerCase().includes(filterValue)
    );
  }

  search() {
    // TODO: implement search functionality using selectedMonth and username variables
  }
}
