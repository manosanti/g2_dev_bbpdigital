import { Component, AfterViewInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FooterLoginComponent } from "../../../components/footer-login/footer-login.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password-02',
  standalone: true,
  imports: [FooterLoginComponent, FormsModule],
  templateUrl: './forgot-password-02.component.html',
  styleUrls: ['./forgot-password-02.component.css']
})
export class ForgotPassword02Component implements AfterViewInit {

  emailSent: string = 'lucas.santiago@g2tecnologia.com.br';
  codeInputs: string[] = ['', '', '', '', ''];
  emailNaoCadastrado: boolean = false;

  constructor(private renderer: Renderer2, private router: Router) { }

  ngAfterViewInit(): void {
    const emailElement = this.renderer.selectRootElement('#emailSentCode', true);
    this.renderer.setProperty(emailElement, 'innerHTML', this.emailSent);

    const modalSuccessful = this.renderer.selectRootElement('#modalSuccessful', true);
    this.renderer.setStyle(modalSuccessful, 'display', 'none');
  }

  validateCodes(): boolean {
    const validCodes = ['11111', '22222'];
    const enteredCode = this.codeInputs.join('');
    return validCodes.includes(enteredCode);
  }

  setNewPassword() {
    if (this.validateCodes()) {
      this.router.navigate(['/new-password']);
    } else {
      this.emailNaoCadastrado = true;
    }
  }

  fecharModal() {
    this.emailNaoCadastrado = false;
  }
}
