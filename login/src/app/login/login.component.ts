import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, AuthenticationService } from '@app/_services';

@Component({templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css']})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    email: string;
    password: string;

  formControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {
      this.loginForm = formBuilder.group({
        color: 'primary',
        fontSize: [16, Validators.min(10)],
      });
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) {
          this.router.navigate(['/']);
        }
    }

  getFontSize() {
    return Math.max(10, this.loginForm.value.fontSize);
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :
         this.formControl.hasError('email') ? 'Not a valid email' :
      '';
  }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        this.loading = true;
        this.authenticationService.login(this.email, this.password)
            .pipe(first())
            .subscribe(
                data => {
                    this.router.navigate([this.returnUrl]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
