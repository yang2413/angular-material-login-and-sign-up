import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent implements OnInit {

  resetForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  email: string;

formControl = new FormControl('', [
  Validators.email,
]);

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { 
    this.resetForm = formBuilder.group({
      color: 'primary',
      fontSize: [16, Validators.min(10)],
    });
      // redirect to home if already logged in
      if (this.authenticationService.currentUserValue) {
        this.router.navigate(['/']);
      }
  }

  getFontSize() {
    return Math.max(10, this.resetForm.value.fontSize);
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
  get f() { return this.resetForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.userService.reset(this.email)
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
