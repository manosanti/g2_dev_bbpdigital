import { NgFor, NgIf, NgSwitchCase } from '@angular/common';
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
  imports: [NgFor],
  templateUrl: './customer-field.component.html',
  styleUrls: ['./customer-field.component.css']
})
export class CustomerFieldComponent implements OnInit {
  customerData: Customer[] = [];
  selectedCustomer: Customer | null = null;
  selectedBbpId: string | null = null;
  isLoading: boolean = true;
  isAdmin = localStorage.getItem('userRole') === "Ativo";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Recupera o bbP_id do localStorage
    this.selectedBbpId = localStorage.getItem('bbP_id');

    // Verifica se já há dados armazenados no localStorage
    const storedData = localStorage.getItem('customerData');

    if (storedData) {
      // Se houver dados armazenados, utiliza-os sem fazer um novo GET
      this.customerData = JSON.parse(storedData);
      this.selectedCustomer = this.findSelectedCustomer();
      this.isLoading = false;
    } else {
      // Se não houver dados, faz o GET
      this.fetchCustomerData();
    }
  }

  generateAndDownloadJSON(): void {
    if (this.selectedCustomer) {
      const jsonData = JSON.stringify(this.selectedCustomer, null, 2); // Formatação do JSON
      const blob = new Blob([jsonData], { type: 'application/json' });
      const fileName = `customer_${this.selectedCustomer.bbP_id}.json`;

      // Cria um link temporário para iniciar o download
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    }
  }

  // Método para buscar dados do cliente
  fetchCustomerData(): void {
    const cardCode = localStorage.getItem('cardCode');
    const bbP_id = localStorage.getItem('bbP_id');

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token'),
      }),
    };

    this.http.get<Customer[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPCardCode?cardCode=${cardCode}&bbP_id=${bbP_id}`, httpOptions).subscribe(
      (data: Customer[]) => {
        this.customerData = data;
        this.isLoading = false;

        // Armazena os dados no localStorage para uso futuro
        localStorage.setItem('customerData', JSON.stringify(this.customerData));

        // Define o cliente selecionado com base no bbP_id
        this.selectedCustomer = this.findSelectedCustomer();

        // Se não houver bbP_id salvo, salva o primeiro da lista no localStorage
        if (!bbP_id && this.customerData.length > 0) {
          const firstBbpId = this.customerData[0]?.bbP_id.toString();
          localStorage.setItem('bbP_id', firstBbpId);
          this.selectedBbpId = firstBbpId;
          this.selectedCustomer = this.customerData[0]; // Define o primeiro cliente como selecionado
        }
      },
      (error) => {
        console.error('Erro ao buscar os dados:', error);
        this.isLoading = false;
      }
    );
  }

  // Método para encontrar o cliente selecionado com base no bbP_id
  findSelectedCustomer(): Customer | null {
    if (this.selectedBbpId) {
      const selectedCustomerIndex = this.customerData.findIndex(
        customer => customer.bbP_id.toString() === this.selectedBbpId
      );
      return selectedCustomerIndex !== -1 ? this.customerData[selectedCustomerIndex] : null;
    }
    return null;
  }

  // Quando o usuário muda a filial no select
  onSelectChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    // Atualiza o bbP_id no localStorage
    localStorage.setItem('bbP_id', selectedValue);

    // Limpa os dados armazenados para forçar um novo GET após o reload
    localStorage.removeItem('customerData');

    // Recarrega a página para fazer o novo GET com o bbP_id atualizado
    window.location.reload();
  }

  // Método para formatar a data
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
}