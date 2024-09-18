import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.css']
})
export class MenuNavigationComponent implements OnInit {

  activeBtnIndex: number | null = null;
  filter: string = 'all'; // Filtro atual

  items: { label: string, link: string, category: string }[] = [
    { label: 'Informações Básicas', link: '/informacoes-basicas', category: 'comercial' },
    { label: 'Configurações Gerais', link: '/configuracoes-gerais', category: 'financeiro' },
    { label: 'Plano de Contas', link: '/plano-de-contas', category: 'financeiro' },
    { label: 'Informações de Banco', link: '/informacoes-de-banco', category: 'financeiro' },
    { label: 'Lançamentos de Transação', link: '/lancamentos-de-transacao', category: 'comercial' },
    { label: 'Centro de Custo', link: '/centro-de-custos', category: 'financeiro' },
    { label: 'Definição de Despesas', link: '/definicao-de-despesas', category: 'financeiro' },
    { label: 'Depósitos', link: '/depositos', category: 'comercial' },
    { label: 'Grupo de Itens', link: '/grupo-de-itens', category: 'comercial' },
    { label: 'Imposto', link: '/imposto', category: 'financeiro' },
    { label: 'Condições de Pagamento', link: '/condicoes-de-pagamento', category: 'financeiro' },
    { label: 'Informações de Cartões', link: '/informacoes-de-cartoes', category: 'financeiro' },
    { label: 'Usuários SAP', link: '/usuarios-sap', category: 'consultor' },
    { label: 'Territórios', link: '/territorios', category: 'consultor' },
    { label: 'Grupo de Clientes', link: '/grupo-de-clientes', category: 'comercial' },
    { label: 'Grupo de Fornecedores', link: '/grupo-de-fornecedores', category: 'comercial' },
    { label: 'Tipos de Expedição', link: '/tipos-de-expedicao', category: 'comercial' },
    { label: 'Config. Iniciais de Documento', link: '/configuracoes-iniciais-de-documento', category: 'financeiro' },
  ];

  get filteredItems() {
    if (this.filter === 'all') {
      return this.items;
    }
    return this.items.filter(item => item.category === this.filter);
  }

  ngOnInit(): void {
    const savedIndex = sessionStorage.getItem('activeBtnIndex');
    if (savedIndex !== null) {
      this.activeBtnIndex = +savedIndex;
    } else {
      this.setActiveBtn(0, this.items[0]?.link);
    }

    this.checkScreenSize();
  }

  checkScreenSize() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.isMenuCollapsed = true;
    }
  }

  setActiveBtn(index: number, link: string): void {
    this.activeBtnIndex = index;
    sessionStorage.setItem('activeBtnIndex', index.toString());
  }

  isMenuCollapsed = false;

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filter = selectElement.value;
  }
}
