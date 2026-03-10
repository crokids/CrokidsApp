/** Retorna quantas tiras formam 1 fardo */
export function getTirasPorFardo(gramatura: number): number {
  return gramatura === 30 ? 10 : 5;
}

/** Converte quantidade para tiras — unidade padrão */
export function quantidadeEmTiras(
  quantidade: number,
  nomeUnidade: string,
  gramatura: number,
): number {
  if (nomeUnidade === "Tira") return quantidade;
  return quantidade * getTirasPorFardo(gramatura); // Fardo → tiras
}

/** Preço por tira */
export function precoPorTira(
  precoUnidade: number,
  nomeUnidade: string,
  gramatura: number,
): number {
  if (nomeUnidade === "Tira") return precoUnidade;
  return precoUnidade / getTirasPorFardo(gramatura); // Fardo → tira
}

/** Valida se a quantidade de tiras é múltiplo correto para a gramatura */
export function validarQuantidadeTiras(
  quantidade: number,
  nomeUnidade: string,
  gramatura: number,
): string | null {
  // Fardo não precisa validar — qualquer quantidade inteira é válida
  if (nomeUnidade === "Fardo") return null;

  const multiplo = getTirasPorFardo(gramatura);

  if (quantidade < multiplo) {
    return `Quantidade mínima é ${multiplo} tiras (1 fardo) para ${gramatura}GR.`;
  }
  if (quantidade % multiplo !== 0) {
    return `Quantidade deve ser múltiplo de ${multiplo} para ${gramatura}GR. Ex: ${multiplo}, ${multiplo * 2}, ${multiplo * 3}...`;
  }
  return null;
}