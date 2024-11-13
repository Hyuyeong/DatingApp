import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  registerMode = false;

  resisterToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelResisterMode(event: boolean) {
    this.registerMode = event;
  }
}
