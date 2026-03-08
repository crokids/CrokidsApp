import { z } from "zod";

export const unitSchema = z.object({
  nome_unidade: z.string().min(1, "Informe a unidade"),
  quantidade_salgadinho: z.number().min(1, "Quantidade inválida"),
  preco: z.number().min(0, "Preço inválido"),
});

export const productSchema = z.object({
  nome: z.string().min(2, "Nome muito curto"),
  descricao: z.string().optional(),
  img_url: z.string().optional(),
  ativo: z.boolean(),
  unidades: z.array(unitSchema).min(1, "Adicione ao menos uma unidade"),
});

export type ProductFormValues = z.infer<typeof productSchema>;