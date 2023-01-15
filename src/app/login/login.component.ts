import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login: string = "";
  password: string = "";

  private address: string = "http://localhost:8080/";
  private methodAuthorize: string = "auth/login";
  private methodRegister: string = "auth/registration";

  isErrorAuthorization: boolean = false;
  isErrorRegister: boolean = false;
  isLoginError: boolean = false;
  isPasswordError: boolean = false;
  incorrectCredentials: string = "incorrect credentials!"
  jwt: string = "";

  constructor(private router: Router, private httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  authorize() {
    this.checkFields();
    if (!this.isLoginError && !this.isPasswordError) {
      this.makeRequest(this.methodAuthorize);
    }
  }

  register() {
    this.checkFields();
    if (!this.isLoginError && !this.isPasswordError) {
      this.makeRequest(this.methodRegister);
    }
  }

  checkFields() {
    this.isErrorRegister = false;
    this.isErrorAuthorization = false;
    this.isPasswordError = this.password.length < 4;
    this.isLoginError = this.login.length < 4;
  }

  makeRequest(method: string) {
    this.httpClient.post<any>(this.address + method, this.makeBody(), {
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe(
      {
        next: ((response: any) => {
          if (response) {
            this.jwt = response['jwt-token']
            console.log(response);
            if (response['message'] === this.incorrectCredentials) {
              this.isErrorAuthorization = true;
            } else {
              this.router.navigate(['/data'], {queryParams: {jwt: this.jwt}});
            }
          } else {
            if (method === this.methodAuthorize) {
              this.isErrorAuthorization = true;
            } else {
              this.isErrorRegister = true;
            }
          }
        }),
        error: (error => {
          console.log(error);
          console.log(this.makeBody());
        })
      }
    )
  }

  makeBody(): Object {
    const data = {
      "username": this.login,
      "password": this.password,
    }
    return JSON.stringify(data);
  }
}
