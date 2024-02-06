import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Form } from '@angular/forms';
import { Router } from '@angular/router';
import { loginservice } from './../Services/loginservice';
import { Users } from 'src/Users';
import { ValidatorService } from '../Services/ValidatorService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  responsedata: any;
  users: Users[] = [];
  loggedIn: boolean = false;
  constructor(private router: Router, private loginService: loginservice) {
    router.canceledNavigationResolution = 'computed';
  }

  ngOnInit(): void {
    this.loginService.getUsers().subscribe(
      (res) => {
        this.users = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  Submit() {
    let username = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;
    console.log(this.users);
    if (!this.loginForm.invalid) {
      this.users.forEach((res) => {
        if (username == res.user_name && password == res.Password) {
          this.loginService.setUserName(username);
          this.router.navigate(['movies'], {
            queryParams: { username: username },
          });
          this.loggedIn = false;
        }
      });
      if (username == '' || password == '') {
        this.loggedIn = false;
      }
      this.loggedIn = true;
    }
  }
}
