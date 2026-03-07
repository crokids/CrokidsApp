import { z } from "zod";

export const productSchema = z.object({
  nome: z.string().min(1, "Nome obrigatório"),
  descricao: z.string().optional(),
  img_url: z.string().optional(),
  ativo: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;