import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onForgotPassword(): void {
    console.log('Forgot password process initiated.');
  }

}
