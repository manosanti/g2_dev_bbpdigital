import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
// Variáveis Globais
import { bbP_id, httpOptions } from '../../global/constants';
import { infoBasica } from '../../models/infobasica/infobasica.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu-navigation',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './menu-navigation.component.html',
  styleUrls: ['./menu-navigation.component.css'],
})
export class MenuNavigationComponent implements OnInit {
  isMenuOpen: boolean = true;
  activeBtnIndex: number | null = null;
  filter: string = 'all';
  isMenuCollapsed: boolean = false;
  @Output() menuStatusChanged = new EventEmitter<boolean>();
  items: { label: string, link: string, category: string, icon?: string, isFilled?: boolean, submenu?: { label: string }[], }[] = [
    { label: 'Informações Básicas', link: '/informacoes-basicas', category: 'comercial', isFilled: false, icon: 'fa-list-check', submenu: [
      { label: 'Web', }, { label: 'Campos de Localização', }, { label: 'Dados Contábeis' }, { label: 'Lista de Moedas' }, { label: 'Telefone' }, { label: 'Caminho Para Pastas' }, { label: 'Moedas' }
    ] },
    { label: 'Configurações Gerais', link: '/configuracoes-gerais', category: 'financeiro', isFilled: false, icon: 'fa-gear', submenu: [
      { label: 'Alerta de Atividade', }, {label: 'Casas Decimais'}, {label: 'Taxa de Comissão'}, {label: 'Formato Data e Hora'}
    ] },
    { label: 'Plano de Contas', link: '/plano-de-contas', category: 'financeiro', isFilled: false, icon: 'fa-comments-dollar' },
    { label: 'Informações de Banco', link: '/informacoes-de-banco', category: 'financeiro', isFilled: false, icon: 'fa-building-columns' },
    { label: 'Lançamentos de Transação', link: '/lancamentos-de-transacao', category: 'comercial', isFilled: false, icon: 'fa-file-invoice-dollar', submenu: [
      {label: 'Determinação Contábil Vendas'}, {label: 'Determinação Contábil Estoque'}, {label: 'Determinação Contábil Geral'}, {label: 'Determinação Contábil Compras'}
    ] },
    { label: 'Centro de Custo', link: '/centro-de-custos', category: 'financeiro', isFilled: false, icon: 'fa-receipt', submenu: [
      {label: 'Definir Dimensões Centro de Custo'}, {label: 'Definir Centro de Custo'}
    ] },
    { label: 'Definição de Despesas', link: '/definicao-de-despesas', category: 'financeiro', isFilled: false, icon: 'fa-filter-circle-dollar', submenu: [
      {label: 'Definição Despesas'}, {label: 'Despesas Adicionais'}
    ] },
    { label: 'Depósitos', link: '/depositos', category: 'comercial', isFilled: false, icon: 'fa-money-bill-transfer' },
    { label: 'Grupo de Itens', link: '/grupo-de-itens', category: 'comercial', isFilled: false, icon: 'fa-border-all' },
    { label: 'Imposto', link: '/imposto', category: 'financeiro', isFilled: false, icon: 'fa-solid fa-hand-holding-dollar' },
    { label: 'Condições de Pagamento', link: '/condicoes-de-pagamento', category: 'financeiro', isFilled: false, icon: 'fa-hand-holding-dollar' },
    { label: 'Informações de Cartões', link: '/informacoes-de-cartoes', category: 'financeiro', isFilled: false, icon: 'fa-scale-unbalanced-flip' },
    { label: 'Usuários SAP', link: '/usuarios-sap', category: 'consultor', isFilled: false, icon: 'fa-user-group' },
    { label: 'Territórios', link: '/territorios', category: 'consultor', isFilled: false, icon: 'fa-map-location-dot', submenu: [
      {label: 'Territórios'}, {label: 'Controlar Vendas'}, {label: 'Percentual de Comissão'}, {label: 'Estágios'}, {label: 'Niveis de Vendas'}
    ] },
    { label: 'Grupo de Clientes', link: '/grupo-de-clientes', category: 'comercial', isFilled: false, icon: 'fa-users-viewfinder' },
    { label: 'Grupo de Fornecedores', link: '/grupo-de-fornecedores', category: 'comercial', isFilled: false, icon: 'fa-boxes-packing' },
    { label: 'Tipos de Expedição', link: '/tipos-de-expedicao', category: 'comercial', isFilled: false, icon: 'fa-file-export' },
    { label: 'Config. Iniciais de Documento', link: '/configuracoes-iniciais-de-documento', category: 'financeiro', isFilled: false, icon: 'fa-file-lines' },
  ];

  searchQuery: string = '';

  constructor(private http: HttpClient) { }

  get filteredItems() {
    return this.items.filter(item => {
      // Verifica o label do item principal
      const itemMatches = item.label.toLowerCase().includes(this.searchQuery.toLowerCase());
  
      // Se o item tiver submenus, verifica também nos submenus
      const submenuMatches = item.submenu?.some((submenu: any) => 
        submenu.label.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
  
      // O item será exibido se corresponder ao filtro principal ou se algum submenu corresponder
      return (this.filter === 'all' || item.category === this.filter) && 
             (itemMatches || submenuMatches);
    });
  }    

  ngOnInit(): void {
    const savedIndex = sessionStorage.getItem('activeBtnIndex');
    this.activeBtnIndex = savedIndex !== null ? +savedIndex : 0;

    const hasReloaded = sessionStorage.getItem('hasReloaded');

    if (!hasReloaded) {
      // Se o sessionStorage ainda não existir, cria e recarrega a página
      sessionStorage.setItem('hasReloaded', 'true');
      window.location.reload();
    }
    // Realiza a requisição GET
    this.http.get<infoBasica[]>(`http://bbpdigital.g2tecnologia.com.br:8021/BBP/BBPID?bbpid=${bbP_id}`, httpOptions).subscribe(
      response => {
        if (Array.isArray(response) && response.length > 0) {
          response.forEach(data => {
            this.items.forEach(item => {
              switch (item.label) {
                case 'Grupo de Clientes':
                  const grupoClientesArray = data.definir_grupos_clientes || [];
                  item.isFilled = grupoClientesArray.length > 0;
                  break;

                case 'Informações Básicas':
                  const site = data.site || [];
                  const email = data.email || [];
                  const registroComercial = data.campos_Loca_Registro_Comercial || [];
                  const perfilSPED = data.campos_Loca_Perfil_Sped || [];
                  const dadosCTB = data.dadosCTB || [];
                  const moedas = data.moedas || [];
                  const telefone = data.telefone || [];
                  const telefone2 = data.telefone2 || [];
                  const word = data.caminho_Pasta_Word || [];
                  const excel = data.caminho_Pasta_Excel || [];
                  const imagens = data.caminho_Pasta_Imagens || [];
                  const licencas = data.caminho_Pasta_Licencas || [];
                  const XML = data.caminho_Pasta_XML || [];
                  const moedaCorrente = data.moeda_Corrente || [];
                  const moedaSistema = data.moeda_Sistema || [];

                  item.isFilled = site.length > 0 && email.length > 0 && registroComercial.length > 0 && perfilSPED.length > 0 &&
                    dadosCTB.length > 0 && moedas.length > 0 && telefone.length > 0 && telefone2.length > 0 && word.length > 0 &&
                    excel.length > 0 && imagens.length > 0 && licencas.length > 0 && XML.length > 0 && moedaCorrente.length > 0 && moedaSistema.length > 0;
                  break;

                case 'Configurações Gerais':
                  const alertaAtividadeArray = data.alerta_Atividade || [];
                  const taxaComissaoArray = data.com_base_negocio_define_taxadecomiss || [];
                  const casasDecimaisArray = data.quantas_casas_decimais_utilizar || [];
                  const dataArray = data.qual_formato_data_uitlizar_tela || [];
                  const horaArray = data.qual_formato_hora_uitlizar_tela || [];

                  // A condição correta: item.isFilled será true apenas se TODOS os arrays estiverem preenchidos
                  const configsFilled = alertaAtividadeArray.length > 0 &&
                    taxaComissaoArray.length > 0 &&
                    casasDecimaisArray.length > 0 &&
                    dataArray.length > 0 &&
                    horaArray.length > 0;

                  // Se todos estiverem preenchidos, isFilled será true, caso contrário será false
                  item.isFilled = configsFilled;
                  break;

                case 'Plano de Contas':
                  const planoContas = data.plano_Contas_Empresa_anexo || [];
                  item.isFilled = planoContas.length > 0;
                  break;

                case 'Informações de Banco':
                  const infoBanco = data.definir_Informacoes_banco || [];
                  item.isFilled = infoBanco.length > 0;
                  break;

                case 'Lançamentos de Transação':
                  const detVendas = data.determinacao_contacontabil_vendas || [];
                  const detGeral = data.determinacao_contacontabil_geral || [];
                  const detEstoque = data.determinacao_contacontabil_estoque || [];
                  const detCompras = data.determinacao_contacontabil_compras || [];

                  item.isFilled = detVendas.length > 0 && detGeral.length > 0 && detEstoque.length > 0 && detCompras.length > 0;
                  break;

                case 'Centro de Custo':
                  const dimCentroCusto = data.definir_Dimensoes_Centros_Custo || [];
                  const centroCusto = data.definir_Centros_Custo || [];
                  item.isFilled = dimCentroCusto.length > 0 && centroCusto.length > 0;
                  break;

                case 'Definição de Despesas':
                  const despesa = data.definicao_Despesas || [];
                  const despAdicionais = data.despesas_Adicionais || [];
                  item.isFilled = despesa.length > 0 && despAdicionais.length > 0;
                  break;

                case 'Depósitos':
                  const depositos = data.defina_Depositos || [];
                  item.isFilled = depositos.length > 0;
                  break;

                case 'Grupo de Itens':
                  const grupoItens = data.defina_Grupo_Item || [];
                  item.isFilled = grupoItens.length > 0;
                  break;

                case 'Imposto':
                  const imposto = data.configuracao_Imposto_Retido_Fonte || [];
                  item.isFilled = imposto.length > 0;
                  break;

                case 'Condições de Pagamento':
                  const condPagamento = data.definir_condicoes_pagamentos || [];
                  item.isFilled = condPagamento.length > 0;
                  break;

                case 'Informações de Cartões':
                  const infoCartoes = data.definir_informacoes_cartoes || [];
                  item.isFilled = infoCartoes.length > 0;
                  break;

                case 'Usuários SAP':
                  const usuariosSAP = data.definir_usuario_senhas || [];
                  item.isFilled = usuariosSAP.length > 0;
                  break;

                case 'Territórios':
                  const territoriosGerenciar = data.definir_Territorios || [];
                  const controlarVendas = data.definir_controle_vendedor || [];
                  const percentualComissao = data.definir_grupo_comissoes || [];
                  const estagNiveisVendas = data.definir_Estagios_Niveis_Vendas || [];

                  item.isFilled = territoriosGerenciar.length > 0 && controlarVendas.length > 0 &&
                    percentualComissao.length > 0 && estagNiveisVendas.length > 0;
                  break;

                case 'Grupo de Fornecedores':
                  const grupoFornecedores = data.definir_grupos_fornecedores || [];
                  item.isFilled = grupoFornecedores.length > 0;
                  break;

                case 'Tipos de Expedição':
                  const tiposExpedicao = data.definir_tipos_expedicao || [];
                  item.isFilled = tiposExpedicao.length > 0;
                  break;

                case 'Config. Iniciais de Documento':
                  const configInicialDoc = data.definir_configuracoes_iniciais_documento || [];
                  item.isFilled = configInicialDoc.length > 0;
                  break;

                default:
                  item.isFilled = false;
              }
            });
          });
        } else {
          // Se a resposta for vazia, marque todos os itens como não preenchidos
          this.items.forEach(item => item.isFilled = false);
        }
      },
      error => {
        console.error('Erro ao buscar dados da API', error);
      }
    );
    const savedStatus = sessionStorage.getItem('menuStatus');
    this.isMenuCollapsed = savedStatus === 'collapsed'; // Define o estado com base no valor salvo  
  }

  setActiveBtn(index: number, link: string): void {
    this.activeBtnIndex = index;
    sessionStorage.setItem('activeBtnIndex', index.toString());
  }

  toggleMenu() {
    this.isMenuCollapsed = !this.isMenuCollapsed; // Alterna o estado do menu colapsado
    sessionStorage.setItem('menuStatus', this.isMenuCollapsed ? 'collapsed' : 'open'); // Salva o estado no sessionStorage
    this.menuStatusChanged.emit(!this.isMenuCollapsed);
  }

  onFilterChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filter = selectElement.value;
  }
}