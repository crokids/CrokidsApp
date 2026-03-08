// Tipos compartilhados da página de pedidos

export type Client = {
  codcli: number;
  fantasia: string;
  razao: string;
  cidade: string;
};

export type UnidadeProduto = {
  id: number;
  produto_id: number;
  nome_unidade: string;
  quantidade_salgadinho: number;
  preco: number;
  ativo: boolean;
};

export type Produto = {
  id: number;
  nome: string;
  img_url: string | null;
  descricao: string;
  ativo: boolean;
  unidades_produto: UnidadeProduto[];
};

export type CartItem = {
  /** `${produto_id}-${unidade_id}` — impede duplicata de mesmo sabor+gramatura+unidade */
  key: string;
  produto: Produto;
  unidade: UnidadeProduto;
  quantidade: number;
};