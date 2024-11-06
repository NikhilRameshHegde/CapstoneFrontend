import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onChangePassword(): void {
    console.log('Change password process initiated.');
  }

}
