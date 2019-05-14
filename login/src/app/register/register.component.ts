import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatCheckboxModule} from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';

@Component({templateUrl: 'register.component.html',
    styleUrls: ['./register.component.css']})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    firstname: string = '';
    lastname: string = '';
    email: string = '';
    username: string = '';
    password: string = '';
    confirmpassword: string = '';
    checked: boolean = false;

    formControl = new FormControl('', [
        Validators.required,
        Validators.email,
      ]);

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {// redirect to home if already logged in
        this.registerForm = formBuilder.group({
            color: 'primary',
            fontSize: [16, Validators.min(10)],
          });
        if (this.authenticationService.currentUserValue) {this.router.navigate(['/']);}
    }

    getErrorMessage() {
        return this.formControl.hasError('required') ? 'Required field' :
             this.formControl.hasError('email') ? 'Not a valid email' :
          '';
      }

    ngOnInit() {
        
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Registration successful', true);
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
