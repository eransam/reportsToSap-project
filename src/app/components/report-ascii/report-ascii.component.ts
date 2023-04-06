import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifyService } from 'src/app/services/notify.service';
import { ReportService } from 'src/app/services/reports.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-report-ascii',
  templateUrl: './report-ascii.component.html',
  styleUrls: ['./report-ascii.component.scss'],
})
export class ReportAsciiComponent implements OnInit {
  yearInput: FormControl;
  DetailsForm: FormGroup;
  monthInput: FormControl;
  selectedMonth: string;
  selectedYear: string;
  AllTotalAmountByYearAndMonth: any = '';
  TotalAmountDay: any = '';
  TotalAmountMonth: any = '';
  TotalAmountYear: any = '';
  totalAmountTemplate: any = '';
  hova: any = '135201';
  zhot: any = '521222';
  theTtxetToTheAscii: any = '';
  detailsFromformMonth: any = '';
  detailsFromformYear: any = '';
  selectedFile: File | null = null;
  acountCarNum: any = [];
  myString: any = '  0                                                                                     \n  ';
  constructor(
    private reportService: ReportService,
    public router: Router,
    private notify: NotifyService
  ) {}

  async ngOnInit(): Promise<void> {
    //   const currentDate = new Date();
    //   this.selectedYear = currentDate.getFullYear().toString();
    //   this.selectedMonth = (currentDate.getMonth() + 1).toString();

    (this.monthInput = new FormControl('', Validators.required)),
      (this.yearInput = new FormControl('', Validators.required)),
      (this.DetailsForm = new FormGroup({
        nameBox: this.monthInput,
        yaerBox: this.yearInput,
      }));
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
        `  0                                                                                     \n  ${
          this.hova
        }             ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n          ${
          this.zhot
        }     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
      ],
      { type: 'text/plain' }
    );

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(this.asciiContent));
    link.setAttribute('download', 'MOVEIN.DAT');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async add() {
    this.detailsFromformMonth = this.monthInput.value;
    this.detailsFromformYear = this.yearInput.value;
    this.AllTotalAmountByYearAndMonth =
      await this.reportService.getAllTotalAmountByYearAndMonth(
        this.detailsFromformMonth,
        this.detailsFromformYear
      );
    this.TotalAmountDay = this.AllTotalAmountByYearAndMonth[0].lastDayOfMonth;
    this.TotalAmountMonth = this.AllTotalAmountByYearAndMonth[0].month;
    this.TotalAmountYear = this.AllTotalAmountByYearAndMonth[0].year;
    this.totalAmountTemplate = this.AllTotalAmountByYearAndMonth[0].totalAmount;
    this.totalAmountTemplate = this.totalAmountTemplate.toFixed(2);
    this.totalAmountTemplate = this.totalAmountTemplate
      .toString()
      .replace(/\./g, '')
      .padStart(12, '0');
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFile = files[0];
    } else {
      this.selectedFile = null;
    }
  }

  processFile() {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.selectedFile);
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result;
      const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log('data: ', data);

      data.splice(0, 3); // Deletes the first 3 elements
      //   console.log("data2: " , data);

      data.forEach(async (subArray) => {
        console.log('subArray[0]: ', subArray[8]);

        this.acountCarNum = await this.reportService.getCarAcountNumByCarNum(
          subArray[8]
        );
        this.acountCarNum = this.acountCarNum[0] ? this.acountCarNum[0] : null;
        this.acountCarNum = this.acountCarNum.Hesbon;
        console.log('this.acountCarNum: ', this.acountCarNum);
        subArray.push({ Hesbon: this.acountCarNum });
        console.log('subArrayNew: ', subArray);
        let acountNum = subArray[12].Hesbon;
        let sumWithTax = subArray[6];
        sumWithTax = sumWithTax.toFixed(2);
        sumWithTax = sumWithTax.toString().replace(/\./g, '').padStart(12, '0');
        let excelDateValue = subArray[1];
        const millisecondsPerDay = 86400000;
        const jan1900To1970 = 25569;
        let date = new Date(
          (excelDateValue - jan1900To1970) * millisecondsPerDay
        );
        let formattedDate = `${
          date.getMonth() + 1
        }/${date.getDate()}/${date.getFullYear()}`;
        console.log(formattedDate); // Output: "2/20/2023"
        let dateParts = formattedDate.split('/');
        let yearFromFile = parseInt(dateParts[2]);
        let monthFromFile = parseInt(dateParts[1]);
        let dayFromFile = parseInt(dateParts[0]);
        const currentDate = new Date();
        this.selectedYear = currentDate.getFullYear().toString();
        this.selectedMonth = (currentDate.getMonth() + 1).toString();

        this.myString += `${acountNum}             ${dayFromFile.toString()}${monthFromFile.toString()}${yearFromFile.toString()}   21${dayFromFile.toString()}${monthFromFile.toString()}${yearFromFile.toString()}${sumWithTax.toString()}NIS           paz ${monthFromFile.toString()}/${yearFromFile.toString()}000000000000 \n`;
        console.log('this.myString: ', this.myString);

        // this.asciiContent = new Blob(
        //   [
        //     `  0                                                                                     \n  ${
        //       this.hova
        //     }             ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n          ${
        //       this.zhot
        //     }     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
        //   ],
        //   { type: 'text/plain' }
        // );

        // const link = document.createElement('a');
        // link.setAttribute('href', URL.createObjectURL(this.asciiContent));
        // link.setAttribute('download', 'MOVEIN.DAT');
        // document.body.appendChild(link);
        // link.click();
        // document.body.removeChild(link);
      });
    };
  }
}
