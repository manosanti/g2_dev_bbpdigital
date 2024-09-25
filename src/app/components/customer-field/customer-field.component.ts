import { NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

interface Customer {
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
  selectedBbpId: string | null = null;
  isLoading: boolean = true; // Adiciona estado de carregamento

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.selectedBbpId = sessionStorage.getItem('bbP_id');
    this.fetchCustomerData();
  }

  // Método para buscar dados do cliente
  fetchCustomerData(): void {
    const cardCode = sessionStorage.getItem('cardCode');
    const bbP_id = sessionStorage.getItem('bbP_id');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + sessionStorage.getItem('token'),
      }),
    };

    this.http.get<Customer[]>(`/api/BBP/BBPCardCode?cardCode=${cardCode}&bbP_id=${bbP_id}`, httpOptions).subscribe(
      (data: Customer[]) => {
        this.customerData = data;
        this.isLoading = false;

        // Se não tiver bbP_id salvo, seleciona o primeiro da lista
        if (!bbP_id && this.customerData.length > 0) {
          const firstBbpId = this.customerData[0]?.bbP_id.toString();
          sessionStorage.setItem('bbP_id', firstBbpId);
          this.selectedBbpId = firstBbpId;
          this.selectedCustomer = this.customerData[0]; // Define o primeiro cliente como selecionado
        } else if (bbP_id) {
          // Se houver um bbP_id, seleciona o cliente correspondente
          const selectedCustomerIndex = this.customerData.findIndex(customer => customer.bbP_id.toString() === bbP_id);
          if (selectedCustomerIndex !== -1) {
            this.selectedCustomer = this.customerData[selectedCustomerIndex];
          }
        }
      },
      (error) => {
        console.error('Erro ao buscar os dados:', error);
        this.isLoading = false;
      }
    );
  }

  // Quando o usuário muda a filial no select
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Atualiza o bbP_id no sessionStorage
    sessionStorage.setItem('bbP_id', selectedValue);

    // Recarrega a página para fazer o novo GET com o bbP_id atualizado
    window.location.reload();
  }

  // Método para formatar a data
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // ou outro formato
  }
}