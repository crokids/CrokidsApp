import { z } from "zod";

export const clientSchema = z.object({
  codcli: z.coerce.number().min(1, "Código do cliente é obrigatório"),

  razao: z.string().min(2, "Razão social muito curta"),

  fantasia: z.string().optional(),

  tipo_log: z.enum([
    "RUA",
    "AVENIDA",
    "ALAMEDA",
    "TRAVESSA",
    "RODOVIA",
    "OUTRO",
  ]).optional(),

  nome_log: z.string().optional(),

  bairro: z.string().optional(),

  cidade: z.string().optional(),

  estado: z.string().optional(),

  uf: z.string().optional(),

  telefone: z.string().optional(),

  celular: z.string().optional(),

  cnpj_cpf: z.string().optional(),

  tipo_estab: z.string().optional(),

  bloqueio: z.enum(["S", "N"]).optional(),

  dt_bloqueo: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;