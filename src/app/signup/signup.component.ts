import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { subscribeOn, Subscription } from 'rxjs';
import { Users } from 'src/Users';
import { ValidatorService } from '../Services/ValidatorService';
import { loginservice } from './../Services/loginservice';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  SignUpForm: FormGroup;
  users: Users[] = [];
  user: Users = new Users();
  mismatch: boolean = false;
  userExists: boolean = false;
  text: String = '';
  username: any;
  password: any;
  confirmpassword: any;
  getUserSubscription: Subscription;
  constructor(private loginService: loginservice, private v: ValidatorService) {
    this.getUserSubscription = Subscription.EMPTY;
  }

  ngOnInit(): void {
    this.SignUpForm = new FormGroup(
      {
        username: new FormControl('', [Validators.required,Validators.maxLength(10)]),
        password: new FormControl('', Validators.required),
        confirmpassword: new FormControl('', Validators.required),
      },
      { validators: this.v.passwordMatch('password', 'confirmpassword') }
    );
    console.log('Called000');
  }
  Submit() {
    this.username = this.SignUpForm.get('username')?.value;
    this.password = this.SignUpForm.get('password')?.value;
    console.log(this.username + ' ' + this.password);
    this.confirmpassword = this.SignUpForm.get('confirmpassword')?.value;
    if (!this.SignUpForm.invalid) {
      if (
        this.username != '' &&
        this.password != '' &&
        this.username != null &&
        this.password != null
      ) {
        this.loginService.getUsers().subscribe(
          (res) => {
            this.users = res;
            if (this.password != this.confirmpassword) {
              console.log('called');
              this.mismatch = true;
            }
            if (this.users.find((x) => x.user_name == this.username)) {
              this.userExists = true;
              this.text = 'User Exists Already!!';
            }
            if (!this.mismatch && !this.userExists) {
              this.user.user_name = this.username;
              this.user.Password = this.password;
              this.loginService.postUsers(this.user).subscribe((res) => {
                if (res != undefined && res != null) {
                  this.text = 'Sucessfully Created';
                }
              });
            }
          },
          (error) => {
            console.log(error);
          }
        );
        this.mismatch = false;
        this.userExists = false;
      }
    } else {
      alert('Invalid details');
    }
  }
  ngOnDestroy() {
    console.log('Called111');
    this.getUserSubscription.unsubscribe();
  }
}
