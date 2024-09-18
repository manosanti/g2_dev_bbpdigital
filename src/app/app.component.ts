import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Componentes
import { SignInComponent } from './views/login/sign-in/sign-in.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, SignInComponent]
})
export class AppComponent {
}
