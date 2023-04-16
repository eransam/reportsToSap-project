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
  hachzakatRehevWithTax: any = '';
  hovaAndRishoeiWithTax: any = '';
  totalRentWithTax: any = 0;
  lastElementIntheArrayWithTheAllTotal: any = '';

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
  totalSumWithTax: any;
  selectedOption: string;

  myString: any =
    '  0                                                                                     \n';
  dayFromFile: any;
  yearFromFile: any;
  monthFromFile: any;

  constructor(
    private reportService: ReportService,
    public router: Router,
    private notify: NotifyService
  ) {}

  async ngOnInit(): Promise<void> {
    const currentDate = new Date();
    this.selectedYear = currentDate.getFullYear().toString();
    this.selectedMonth = (currentDate.getMonth() + 1).toString();

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
    switch (this.selectedOption) {
      case 'PAZ':
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(this.selectedFile);
        fileReader.onload = async () => {
          const arrayBuffer = fileReader.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          data.splice(0, 3); // Deletes the first 3 elements
          const checkMyString = await this.returnTheString(data);
          console.log('checkMyString.myString: ', checkMyString.myString);
          let day = checkMyString.dayFromFile;
          let month = checkMyString.monthFromFile;
          let year = checkMyString.yearFromFile;
          let year2digit = year % 100;
          console.log('year: ', year % 100);

          let theTotal = checkMyString.totalSumWithTax;
          theTotal = theTotal.toFixed(2);
          theTotal = theTotal.toString().replace(/\./g, '').padStart(12, '0');

          let allString = checkMyString.myString;
          console.log('allStringstart: ', allString);

          let endString = `  ${
            this.hova
          }             ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           MAM 0${month.toString()}/${year.toString()}000000000000 \n          ${
            this.zhot
          }     ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           PAZ 0${month.toString()}/${year.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`;

          allString += endString;
          console.log('allStringend: ', allString);
          this.asciiContent = new Blob([allString], { type: 'text/plain' });
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(this.asciiContent));
          link.setAttribute('download', 'MOVEIN.DAT');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        break;

      case 'ELDAN':
        const fileReaderELDAN = new FileReader();
        fileReaderELDAN.readAsArrayBuffer(this.selectedFile);
        fileReaderELDAN.onload = async () => {
          const arrayBuffer = fileReaderELDAN.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });

          console.log('eldanData: ', data);

          data.splice(0, 1); // Deletes the first 1 elements
          const checkMyString = await this.returnTheStringEldan(data);
          console.log('checkMyString.myString: ', checkMyString.myString);
          let day = checkMyString.dayFromFile;
          let month = checkMyString.monthFromFile;
          let year = checkMyString.yearFromFile;
          let year2digit = year % 100;
          console.log('year: ', year % 100);

          let theTotal = checkMyString.lastElementIntheArrayWithTheAllTotal;
          theTotal = Number(theTotal);

          theTotal = theTotal.toFixed(2);
          theTotal = theTotal.toString().replace(/\./g, '').padStart(12, '0');

          let allString2 = checkMyString.myString;
          console.log('allStringstart: ', allString2);

          let endString2 = `  ${
            this.hova
          }             ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           MAM 0${month.toString()}/${year.toString()}000000000000 \n          ${
            this.zhot
          }     ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           PAZ 0${month.toString()}/${year.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n`;

          allString2 += endString2;
          console.log('allStringend: ', allString2);
          this.asciiContent = new Blob([allString2], { type: 'text/plain' });
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(this.asciiContent));
          link.setAttribute('download', 'MOVEIN.DAT');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        break;
    }
  }

  async returnTheStringEldan(data: any) {
    if (!Array.isArray(data)) {
      throw new Error('data must be an array');
    }
    this.lastElementIntheArrayWithTheAllTotal = data.pop();

    const promises = data.map(async (subArray: any) => {
      this.hovaAndRishoeiWithTax = subArray[17] + subArray[18];
      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax * 1.17;
      let hachzakatRehevWithoutTax = subArray[16];
      this.hachzakatRehevWithTax = subArray[16] * 1.17;
      let ShlishTax = this.hachzakatRehevWithTax - hachzakatRehevWithoutTax;
      this.hachzakatRehevWithTax = hachzakatRehevWithoutTax + ShlishTax;
      this.totalRentWithTax = subArray[15] * 1.17;

      this.acountCarNum = await this.reportService.getCarAcountNumByCarNum(
        subArray[4]
      );

      this.acountCarNum = this.acountCarNum[0] ? this.acountCarNum[0] : null;
      this.acountCarNum = this.acountCarNum.Hesbon;

      console.log('this.acountCarNum333: ', this.acountCarNum);

      this.acountCarNum = this.acountCarNum[0] ? this.acountCarNum[0] : null;

      subArray.push({ Hesbon: this.acountCarNum });

      this.hachzakatRehevWithTax = Number(this.hachzakatRehevWithTax);
      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax.toFixed(2);
      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

      this.hachzakatRehevWithTax = Number(this.hachzakatRehevWithTax); // add to total sumWithTax

      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax.toFixed(2);
      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');
      this.hovaAndRishoeiWithTax = Number(this.hovaAndRishoeiWithTax); // add to total sumWithTax

      this.totalRentWithTax = this.totalRentWithTax.toFixed(2);
      this.totalRentWithTax = this.totalRentWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');
      this.totalRentWithTax = Number(this.totalRentWithTax); // add to total sumWithTax

      let excelDateValue = subArray[10];
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
      this.monthFromFile = parseInt(dateParts[0]);
      this.yearFromFile = parseInt(dateParts[2]);
      this.dayFromFile = parseInt(dateParts[1]);
      const currentDate = new Date();
      this.selectedYear = currentDate.getFullYear().toString();
      this.selectedMonth = (currentDate.getMonth() + 1).toString();
      let year2dig = this.yearFromFile % 100;

      this.myString += `
         ${
           this.acountCarNum
         }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hachzakatRehevWithTax.toString()}NIS           ELDAN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \n
         ${
           this.acountCarNum
         }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hovaAndRishoeiWithTax.toString()}NIS           ELDAN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \n
         ${
           this.acountCarNum
         }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.totalRentWithTax.toString()}NIS           ELDAN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \n`;
    });
    await Promise.all(promises);

    return {
      myString: this.myString,
      hachzakatRehevWithTax: this.hachzakatRehevWithTax,
      hovaAndRishoeiWithTax: this.hovaAndRishoeiWithTax,
      totalSumWithTax: this.totalRentWithTax,
      dayFromFile: this.dayFromFile,
      monthFromFile: this.monthFromFile,
      yearFromFile: this.yearFromFile,
      lastElementIntheArrayWithTheAllTotal:
        this.lastElementIntheArrayWithTheAllTotal,
    };
  }

  async returnTheString(data: any) {
    if (!Array.isArray(data)) {
      throw new Error('data must be an array');
    }
    const promises = data.map(async (subArray: any) => {
      this.acountCarNum = await this.reportService.getCarAcountNumByCarNum(
        subArray[8]
      );
      this.acountCarNum = this.acountCarNum[0] ? this.acountCarNum[0] : null;
      this.acountCarNum = this.acountCarNum.Hesbon;
      subArray.push({ Hesbon: this.acountCarNum });
      let acountNum = subArray[12].Hesbon;
      let sumWithTax = subArray[6];
      this.totalSumWithTax = 0;
      sumWithTax = sumWithTax.toFixed(2);
      sumWithTax = sumWithTax.toString().replace(/\./g, '').padStart(12, '0');
      this.totalSumWithTax += Number(sumWithTax); // add to total sumWithTax
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
      this.monthFromFile = parseInt(dateParts[0]);
      this.yearFromFile = parseInt(dateParts[2]);
      this.dayFromFile = parseInt(dateParts[1]);
      const currentDate = new Date();
      this.selectedYear = currentDate.getFullYear().toString();
      this.selectedMonth = (currentDate.getMonth() + 1).toString();
      let year2dig = this.yearFromFile % 100;
      this.myString += `${acountNum}             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${sumWithTax.toString()}NIS           paz 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \n`;
    });
    await Promise.all(promises);
    return {
      totalSumWithTax: this.totalSumWithTax,
      myString: this.myString,
      dayFromFile: this.dayFromFile,
      monthFromFile: this.monthFromFile,
      yearFromFile: this.yearFromFile,
    };
  }
}
