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
  cardCode: string | null = null;

  constructor(private http: HttpClient) { }

  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    sessionStorage.setItem('bbP_id', selectedValue);
    window.location.reload();
  }

  selectedBbpId: string | null = null;

  ngOnInit(): void {
    this.selectedBbpId = sessionStorage.getItem('bbP_id');
    this.fetchCustomerData();
  }

  fetchCustomerData(): void {
    const cardCode = sessionStorage.getItem('cardCode');
    const bbP_id = sessionStorage.getItem('bbP_id');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + sessionStorage.getItem('token')
      }),
    }

    this.http.get<Customer[]>(`/api/BBP/BBPCardCode?cardCode=${cardCode}`, httpOptions).subscribe(
      (data: Customer[]) => {
        this.customerData = data;

        // Se bbP_id ainda não estiver definido, use o primeiro da lista retornada
        if (!bbP_id && this.customerData.length > 0) {
          const firstBbpId = this.customerData[0]?.bbP_id.toString();
          sessionStorage.setItem('bbP_id', firstBbpId);
          this.selectedBbpId = firstBbpId; // Atualize o valor selecionado
        }
      },
      (error) => {
        console.error('Erro de Fetch:', error);
      }
    )
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // ou formatar como preferir
  }
}