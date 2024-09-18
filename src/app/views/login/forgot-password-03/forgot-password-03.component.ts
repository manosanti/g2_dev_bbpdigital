import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FooterLoginComponent } from "../../../components/footer-login/footer-login.component";

@Component({
  selector: 'app-forgot-password-03',
  standalone: true,
  imports: [FooterLoginComponent],
  templateUrl: './forgot-password-03.component.html',
  styleUrl: './forgot-password-03.component.css'
})
export class ForgotPassword03Component implements AfterViewInit {
  constructor(private renderer: Renderer2, private router: Router) { }

  ngAfterViewInit(): void {
    const passwordSuccessful = this.renderer.selectRootElement('#passwordSuccessful', true);
    this.renderer.setStyle(passwordSuccessful, 'display', 'none');

    this.checkPassword();
  }

  checkPassword() {
    const newPassword = this.renderer.selectRootElement('#newPassword').value;
    const confirmPassword = this.renderer.selectRootElement('#confirmPassword').value;

    if (newPassword === confirmPassword) {
      
    }
  }

  dashboard() {
    this.router.navigate(['/informacoes-basicas']);
  }
}
