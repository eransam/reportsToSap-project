import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      this.router.navigateByUrl('/home');
    } catch (err: any) {}
  }

  test(){
    console.log("the-testo");
    
  }
}
