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
  Tax_2_3: any = 0;

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

  //  hova
  hovamiznon: any = '135201';
  mam: any = '219007';

  // zhot
  zhotEldan: any = '2168024';
  zhotmiznon: any = '521222';
  zhotFreesbe: any = '2168257';
  zhotPaz: any = '0000000';

  theTtxetToTheAscii: any = '';
  detailsFromformMonth: any = '';
  detailsFromformYear: any = '';
  selectedFile: File | null = null;
  acountCarNum: any = [];
  totalSumWithTax: any;
  selectedOption: string;

  myString: any =
    '  0                                                                                     \r\n';
  dayFromFile: any;
  yearFromFile: any;
  monthFromFile: any;

  allFullTtotal: number = 0;

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
        this.hovamiznon
      } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n       ${
        this.zhotmiznon
      } ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()} ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000\n99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
    ],
    { type: 'text/plain' }
  );

  downloadFile() {
    this.asciiContent = new Blob(
      [
        `  0                                                                                     \n  ${
          this.hovamiznon
        }             ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n          ${
          this.zhotmiznon
        }     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}     ${this.TotalAmountDay.toString()}0${this.TotalAmountMonth.toString()}${this.TotalAmountYear.toString()}${this.totalAmountTemplate.toString()}NIS          Miznon 0${this.TotalAmountMonth.toString()}/${this.TotalAmountYear.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999`,
      ],
      { type: 'text/plain' }
    );

    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(this.asciiContent));
    link.setAttribute('download', 'MOVEIN.DAT');
    document.body.appendChild(link);
    -link.click();
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
          const checkMyString = await this.returnTheStringPaz(data);
          let day = checkMyString.dayFromFile;
          let month = checkMyString.monthFromFile;
          let year = checkMyString.yearFromFile;
          let year2digit = year % 100;

          let theTotal = checkMyString.totalSumWithTax;
          theTotal = theTotal.toFixed(2);
          theTotal = theTotal.toString().replace(/\./g, '').padStart(12, '0');

          let allString = checkMyString.myString;

          let endString = `  ${
            this.mam
          }             ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           MAM 0${month.toString()}/${year.toString()}000000000000 \n          ${
            this.zhotPaz
          }     ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTotal.toString()}NIS           PAZ 0${month.toString()}/${year.toString()}000000000000 \n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\n`;

          allString += endString;
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
          console.log('dataEldan before splice: ', data);

          data.splice(0, 1); // Deletes the first 1 elements
          console.log('dataEldan: ', data);

          const checkMyString = await this.returnTheStringEldan(data);
          console.log(
            'checkMyString.allFullTtotal: ',
            checkMyString.allFullTtotal
          );

          let day = checkMyString.dayFromFile;
          let month = checkMyString.monthFromFile;
          let year = checkMyString.yearFromFile;
          let year2digit = year % 100;
          let theTotal = checkMyString.lastElementIntheArrayWithTheAllTotal[19];
          console.log('theTotal: ', theTotal);

          theTotal = Number(theTotal);
          let taxOfTheTotal: any = (theTotal * 0.17).toFixed(2);
          theTotal = theTotal - taxOfTheTotal;
          let theTax2_3: any = checkMyString.tax2_3;
          console.log('theTax2_3: ', theTax2_3);
          theTax2_3 = theTax2_3.toFixed(2);
          theTax2_3 = theTax2_3.toString().replace(/\./g, '').padStart(12, '0');
          theTotal = theTotal.toFixed(2);
          taxOfTheTotal = taxOfTheTotal
            .toString()
            .replace(/\./g, '')
            .padStart(12, '0');
          let allFullTtotal = checkMyString.allFullTtotal
            .toFixed(2)
            .toString()
            .replace(/\./g, '')
            .padStart(12, '0');

          console.log('allFullTtotal333: ', allFullTtotal);

          theTotal = theTotal.toString().replace(/\./g, '').padStart(12, '0');
          console.log('theTotal: ', theTotal);

          let allString2 = checkMyString.myString;
          let endString2 = `  ${
            this.mam
          }             ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTax2_3.toString()}NIS           MAM 0${month.toString()}/${year.toString()}000000000000 \r\n         ${
            this.zhotEldan
          }     ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${allFullTtotal.toString()}NIS           ELN 0${month.toString()}/${year.toString()}000000000000 \r\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\r\n`;

          allString2 += endString2;
          allString2.replace(' ', '&nbsp;');
          this.asciiContent = new Blob([allString2], { type: 'text/plain' });
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(this.asciiContent));
          link.setAttribute('download', 'MOVEIN.DAT');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };
        break;

      case 'FREESBE':
        const fileReaderFREESBE = new FileReader();
        fileReaderFREESBE.readAsArrayBuffer(this.selectedFile);
        fileReaderFREESBE.onload = async () => {
          const arrayBuffer = fileReaderFREESBE.result;
          const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const data: any[][] = XLSX.utils.sheet_to_json(worksheet, {
            header: 1,
          });
          console.log('dataFREESBE before splice: ', data);

          data.splice(0, 1); // Deletes the first 1 elements
          console.log('dataEldan: ', data);

          const checkMyString = await this.returnTheStringFREESBE(data);
          console.log(
            'checkMyString.allFullTtotal: ',
            checkMyString.allFullTtotal
          );

          let day = checkMyString.dayFromFile;
          let month = checkMyString.monthFromFile;
          let year = checkMyString.yearFromFile;
          let year2digit = year % 100;
          let theTotal = checkMyString.lastElementIntheArrayWithTheAllTotal[19];
          console.log('theTotal: ', theTotal);

          theTotal = Number(theTotal);
          let taxOfTheTotal: any = (theTotal * 0.17).toFixed(2);
          theTotal = theTotal - taxOfTheTotal;
          let theTax2_3: any = checkMyString.tax2_3;
          console.log('theTax2_3: ', theTax2_3);
          theTax2_3 = theTax2_3.toFixed(2);
          theTax2_3 = theTax2_3.toString().replace(/\./g, '').padStart(12, '0');
          theTotal = theTotal.toFixed(2);
          taxOfTheTotal = taxOfTheTotal
            .toString()
            .replace(/\./g, '')
            .padStart(12, '0');
          let allFullTtotal = checkMyString.allFullTtotal
            .toFixed(2)
            .toString()
            .replace(/\./g, '')
            .padStart(12, '0');

          console.log('allFullTtotal333: ', allFullTtotal);

          theTotal = theTotal.toString().replace(/\./g, '').padStart(12, '0');
          console.log('theTotal: ', theTotal);

          let allString2 = checkMyString.myString;
          let endString2 = `  ${
            this.mam
          }             ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${theTax2_3.toString()}NIS           MAM 0${month.toString()}/${year.toString()}000000000000 \r\n         ${
            this.zhotFreesbe
          }     ${day.toString()}0${month.toString()}${year2digit.toString()}     ${day.toString()}0${month.toString()}${year2digit.toString()}${allFullTtotal.toString()}NIS           FRE 0${month.toString()}/${year.toString()}000000000000 \r\n9999999999999999999999999999999999999999999999999999999999999999999999999999999999999999\r\n`;

          allString2 += endString2;
          allString2.replace(' ', '&nbsp;');
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

  async returnTheStringFREESBE(data: any) {
    console.log('data in returnTheStringEldan', data);

    if (!Array.isArray(data)) {
      throw new Error('data must be an array');
      console.log('data in eldan', data);
    }
    this.lastElementIntheArrayWithTheAllTotal = data.pop();
    let second = data.pop();
    console.log('second: ', second);

    console.log(
      'this.lastElementIntheArrayWithTheAllTotal: ',
      this.lastElementIntheArrayWithTheAllTotal
    );

    //data.splice(-2, 2); // removes the last two elements (4 and 5)

    for (let i = 1; i < data.length; i++) {
      if (data[i][16] === 'פרמיה חודשית') {
        data[i - 1][19] += data[i][19];
      }
    }
    data = data.filter((subArray) => subArray[16] !== 'פרמיה חודשית');
    console.log('data after filter: ', data);

    const promises = data.map(async (subArray: any, index: number) => {
      let hachzakatRehevWithoutTax = subArray[16];
      console.log('hachzakatRehevWithoutTax: ', hachzakatRehevWithoutTax);

      this.hachzakatRehevWithTax = subArray[16] * 1.17;
      let ShlishTax = this.hachzakatRehevWithTax - hachzakatRehevWithoutTax;
      ShlishTax = Number(ShlishTax);
      console.log('ShlishTax: ', ShlishTax);

      ShlishTax = ShlishTax / 3;
      console.log('ShlishTax2: ', ShlishTax);
      this.hachzakatRehevWithTax = hachzakatRehevWithoutTax + ShlishTax;

      this.hachzakatRehevWithTax = Number(this.hachzakatRehevWithTax);
      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax.toFixed(2);
      this.allFullTtotal += Number(this.hachzakatRehevWithTax);
      console.log('this.allFullTtotal: ', this.allFullTtotal);

      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

      let shniShlish: any = (ShlishTax * 2).toFixed(2);
      shniShlish = Number(shniShlish);
      this.allFullTtotal += Number(shniShlish);

      this.Tax_2_3 += shniShlish;
      this.Tax_2_3 = Number(this.Tax_2_3);

      this.acountCarNum = await this.reportService.getCarAcountNumByCarNum(
        subArray[4]
      );

      this.acountCarNum = this.acountCarNum[0]
        ? this.acountCarNum[0].Hesbon
        : null;

      this.hovaAndRishoeiWithTax = subArray[17] + subArray[18];
      this.hovaAndRishoeiWithTax = Number(this.hovaAndRishoeiWithTax); // add to total sumWithTax
      //   this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax * 1.17;
      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax.toFixed(2);
      this.allFullTtotal += Number(this.hovaAndRishoeiWithTax);

      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

      this.totalRentWithTax = subArray[15] * 1.17;
      this.totalRentWithTax = Number(this.totalRentWithTax); // add to total sumWithTax
      this.totalRentWithTax = this.totalRentWithTax.toFixed(2);
      this.allFullTtotal += Number(this.totalRentWithTax);

      this.totalRentWithTax = this.totalRentWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

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

      this.myString += `${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hachzakatRehevWithTax.toString()}NIS           FRE 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hovaAndRishoeiWithTax.toString()}NIS           FRE 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.totalRentWithTax.toString()}NIS           FRE 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n`;
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
      tax2_3: this.Tax_2_3,
      allFullTtotal: this.allFullTtotal,
    };
  }

  async returnTheStringEldan(data: any) {
    console.log('data in returnTheStringEldan', data);

    if (!Array.isArray(data)) {
      throw new Error('data must be an array');
      console.log('data in eldan', data);
    }
    this.lastElementIntheArrayWithTheAllTotal = data.pop();
    let second = data.pop();
    console.log('second: ', second);

    console.log(
      'this.lastElementIntheArrayWithTheAllTotal: ',
      this.lastElementIntheArrayWithTheAllTotal
    );

    //data.splice(-2, 2); // removes the last two elements (4 and 5)

    for (let i = 1; i < data.length; i++) {
      if (data[i][16] === 'פרמיה חודשית') {
        data[i - 1][19] += data[i][19];
      }
    }
    data = data.filter((subArray) => subArray[16] !== 'פרמיה חודשית');
    console.log('data after filter: ', data);

    const promises = data.map(async (subArray: any, index: number) => {
      let hachzakatRehevWithoutTax = subArray[16];
      console.log('hachzakatRehevWithoutTax: ', hachzakatRehevWithoutTax);

      this.hachzakatRehevWithTax = subArray[16] * 1.17;
      let ShlishTax = this.hachzakatRehevWithTax - hachzakatRehevWithoutTax;
      ShlishTax = Number(ShlishTax);
      console.log('ShlishTax: ', ShlishTax);

      ShlishTax = ShlishTax / 3;
      console.log('ShlishTax2: ', ShlishTax);
      this.hachzakatRehevWithTax = hachzakatRehevWithoutTax + ShlishTax;

      this.hachzakatRehevWithTax = Number(this.hachzakatRehevWithTax);
      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax.toFixed(2);
      this.allFullTtotal += Number(this.hachzakatRehevWithTax);
      console.log('this.allFullTtotal: ', this.allFullTtotal);

      this.hachzakatRehevWithTax = this.hachzakatRehevWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

      let shniShlish: any = (ShlishTax * 2).toFixed(2);
      shniShlish = Number(shniShlish);
      this.allFullTtotal += Number(shniShlish);

      this.Tax_2_3 += shniShlish;
      this.Tax_2_3 = Number(this.Tax_2_3);

      this.acountCarNum = await this.reportService.getCarAcountNumByCarNum(
        subArray[4]
      );

      this.acountCarNum = this.acountCarNum[0]
        ? this.acountCarNum[0].Hesbon
        : null;

      this.hovaAndRishoeiWithTax = subArray[17] + subArray[18];
      this.hovaAndRishoeiWithTax = Number(this.hovaAndRishoeiWithTax); // add to total sumWithTax
      //   this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax * 1.17;
      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax.toFixed(2);
      this.allFullTtotal += Number(this.hovaAndRishoeiWithTax);

      this.hovaAndRishoeiWithTax = this.hovaAndRishoeiWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

      this.totalRentWithTax = subArray[15] * 1.17;
      this.totalRentWithTax = Number(this.totalRentWithTax); // add to total sumWithTax
      this.totalRentWithTax = this.totalRentWithTax.toFixed(2);
      this.allFullTtotal += Number(this.totalRentWithTax);

      this.totalRentWithTax = this.totalRentWithTax
        .toString()
        .replace(/\./g, '')
        .padStart(12, '0');

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

      this.myString += `${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hachzakatRehevWithTax.toString()}NIS           ELN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.hovaAndRishoeiWithTax.toString()}NIS           ELN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n${
        this.acountCarNum
      }             ${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}   21${this.dayFromFile.toString()}0${this.monthFromFile.toString()}${year2dig.toString()}${this.totalRentWithTax.toString()}NIS           ELN 0${this.monthFromFile.toString()}/${this.yearFromFile.toString()}000000000000 \r\n`;
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
      tax2_3: this.Tax_2_3,
      allFullTtotal: this.allFullTtotal,
    };
  }

  async returnTheStringPaz(data: any) {
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
