import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucsses-msg',
  templateUrl: './sucsses-msg.component.html',
  styleUrls: ['./sucsses-msg.component.scss'],
})
export class SucssesMsgComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.router.navigateByUrl('/logout');
    }, 2000);
  }
}
