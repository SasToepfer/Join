import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service';
// import { IUser } from '../interfaces/iuser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Output() topicSelected = new EventEmitter<string>()
  user = {
    name: '',
    email: '',
    phone: 0,
    password: '',
    secondPassword: ''
  };
  stateLogin: boolean = true;
  authSucceeded: boolean = true;
  privacyAccepted: boolean = false;
  privacyAcceptedMismatch: boolean = false;
  tryRegister: boolean = false;
  registrationSuccess: boolean = false;
  passwordMismatch: boolean = false;
  logoTransition: boolean = false;
  isVisible: boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    setTimeout(() => {
      this.logoTransition = true;
      this.isVisible = true;
    }, 100);
    
  }

  toggleSignUp() {
    this.stateLogin = !this.stateLogin;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      this.tryRegister = true;
      return;
    }

    if (!this.privacyAccepted) {
      this.privacyAcceptedMismatch = true;
      return;
    }
    this.privacyAcceptedMismatch = false;

    if (this.user.password !== this.user.secondPassword) {
      this.passwordMismatch = true;
      return;
    }
    this.passwordMismatch = false;
    
  
    const result = await this.authService.registerUser(this.user.name, this.user.email, this.user.password);
    if (result) {
      this.registrationSuccess = true;
      setTimeout(() => this.stateLogin = true, 2000);
    }
  }
  
  async logIn() {
    const user = await this.authService.loginUser(this.user.email, this.user.password);
    this.authSucceeded = !!user;
    
    if (!this.authSucceeded) {
      setTimeout(() => this.authSucceeded = true, 1800);
    }
  }
  
  successAuth() {
    this.authService.successAuth();
  }
  
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  selectTopic(topic: string) {
    this.topicSelected.emit(topic);
    this.scrollToTop();
  }
}