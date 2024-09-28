
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AllowOnlyNumbersService {

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.keyCode || event.which;
  
    // Permitir: teclas de controle (backspace, delete, tab, setas), números e teclado numérico
    if(
      charCode === 8 ||  // Backspace
    charCode === 9 ||  // Tab
    charCode === 46 || // Delete
    (charCode >= 37 && charCode <= 40) ||  // Setas (esquerda, direita, etc)
    (charCode >= 48 && charCode <= 57) ||  // Números (0-9)
    (charCode >= 96 && charCode <= 105)    // Teclado numérico (0-9)
      ) {
    // Tecla permitida, nada a fazer
    return;
  } else {
    // Bloquear a tecla não numérica
    event.preventDefault();
  }
  }
  constructor() { }
}