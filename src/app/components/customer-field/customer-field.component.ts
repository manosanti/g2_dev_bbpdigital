import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Customer {
  id: number;
  cardName: string;
  cardCode: string;
  docDate: string;
  bbP_id: number;
}

@Component({
  selector: 'app-customer-field',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './customer-field.component.html',
  styleUrls: ['./customer-field.component.css']
})
export class CustomerFieldComponent implements OnInit {
  customerData: Customer[] = [];
  selectedCustomer: Customer | null = null;
  selectedBbpId: string | null = null; // Mantém o bbP_id selecionado

  constructor(private http: HttpClient) { }

  // Método para alterar a filial
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    sessionStorage.setItem('bbP_id', selectedValue); // Salva o valor no sessionStorage

    // Recarrega a página para fazer a nova requisição GET com o bbP_id atualizado
    window.location.reload();
  }

  ngOnInit(): void {
    this.selectedBbpId = sessionStorage.getItem('bbP_id'); // Pega o valor salvo no sessionStorage
    this.fetchCustomerData();
  }

  fetchCustomerData(): void {
    const cardCode = sessionStorage.getItem('cardCode'); // Pega o cardCode no sessionStorage
    const bbP_id = sessionStorage.getItem('bbP_id'); // Pega o bbP_id no sessionStorage

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + sessionStorage.getItem('token')
      }),
    };

    this.http.get<Customer[]>(`/api/BBP/BBPCardCode?cardCode=${cardCode}&bbP_id=${bbP_id}`, httpOptions).subscribe(
      (data: Customer[]) => {
        this.customerData = data;

        // Se nenhum bbP_id estiver definido, use o primeiro da lista retornada
        if (!bbP_id && this.customerData.length > 0) {
          const firstBbpId = this.customerData[0]?.bbP_id.toString();
          sessionStorage.setItem('bbP_id', firstBbpId);
          this.selectedBbpId = firstBbpId;
          this.selectedCustomer = this.customerData[0]; // Define o primeiro cliente como selecionado
        } else if (bbP_id) {
          // Encontra o cliente correspondente com o bbP_id selecionado
          const selectedCustomerIndex = this.customerData.findIndex(customer => customer.bbP_id.toString() === bbP_id);
          if (selectedCustomerIndex !== -1) {
            this.selectedCustomer = this.customerData[selectedCustomerIndex];  // Atualiza o cliente selecionado
          }
        }
      },
      (error) => {
        console.error('Erro de Fetch:', error);
      }
    );
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // ou formatar como preferir
  }
}