import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FooterLoginComponent } from '../../../components/footer-login/footer-login.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forget-password-01',
  standalone: true,
  imports: [
    FooterLoginComponent, FormsModule
  ],
  templateUrl: './forget-password-01.component.html',
  styleUrls: ['./forget-password-01.component.css']
})
export class ForgetPassword01Component {
  emailRecovery: string = '';
  emailsValidos: string[] = ['teste@gmail.com', 'testee@gmail.com', 'testeee@gmail.com'];
  emailNaoCadastrado: boolean = false;

  constructor(private router: Router) {}

  // Redirecionar para rota 'Verify-email'
  verifyEmail() {
    if (this.emailsValidos.includes(this.emailRecovery)) {
      this.router.navigate(['/verify-email'])
    } else {
      this.emailNaoCadastrado = true;
    }
  }

  fecharModal() {
    this.emailNaoCadastrado = false;
  }
}