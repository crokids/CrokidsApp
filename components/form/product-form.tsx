"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";

import { productSchema, ProductFormValues } from "@/lib/schemas/productSchema";
import { createProduct } from "@/actions/product/createProduct";
import { updateProduct } from "@/actions/product/updateProduct";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ImageUpload } from "./image-upload";
import { toast } from "sonner";
import Link from "next/link";

const GRAMATURAS = [
  { valor: 30, tirasPorFardo: 10 },
  { valor: 40, tirasPorFardo: 5 },
  { valor: 50, tirasPorFardo: 5 },
  { valor: 60, tirasPorFardo: 5 },
];

function getTirasPorFardo(gramatura: number): number {
  return gramatura === 30 ? 10 : 5;
}

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  img_url: string | null;
  ativo: boolean;
  gramatura: number | null;
  unidades_produto: {
    id: string;
    nome_unidade: string;
    quantidade_salgadinho: number;
    preco: number;
  }[];
}

interface Props {
  product?: Produto;
}

function getDefaultUnidades(gramatura: number) {
  const tirasPorFardo = getTirasPorFardo(gramatura);
  return [
    { nome_unidade: "Tira", quantidade_salgadinho: 1, preco: 0 },
    { nome_unidade: "Fardo", quantidade_salgadinho: tirasPorFardo, preco: 0 },
  ];
}

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Lê a página atual da URL para preservar no botão voltar
  const currentPage = searchParams.get("page") ?? "1";
  const backHref = `/dashboard/produtos?page=${currentPage}`;

  const [loading, setLoading] = useState(false);

  // Flag para ignorar o useEffect de gramatura durante a carga inicial do produto
  const isInitialized = useRef(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      img_url: "",
      ativo: true,
      gramatura: undefined,
      unidades: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "unidades",
  });

  // ── Carrega produto para edição ───────────────────────────────────────────
  useEffect(() => {
    if (product) {
      isInitialized.current = false; // bloqueia o effect de gramatura durante o reset
      form.reset({
        nome: product.nome,
        descricao: product.descricao ?? "",
        img_url: product.img_url ?? "",
        ativo: product.ativo,
        gramatura: product.gramatura ?? undefined,
        unidades: product.unidades_produto.map((u) => ({
          nome_unidade: u.nome_unidade,
          quantidade_salgadinho: u.quantidade_salgadinho,
          preco: u.preco,
        })),
      });
    }
    // Marca como inicializado após o reset (próximo tick)
    setTimeout(() => {
      isInitialized.current = true;
    }, 0);
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  // Para criação nova (sem product), libera o effect imediatamente
  useEffect(() => {
    if (!product) {
      isInitialized.current = true;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const gramaturaWatched = form.watch("gramatura");
  const tirasWatched = form.watch("unidades.0.preco");

  // ── Quando gramatura muda (pelo usuário), recalcula unidades ─────────────
  useEffect(() => {
    if (!gramaturaWatched) return;
    // Ignora durante carga inicial do produto em edição
    if (!isInitialized.current) return;

    const tirasPorFardo = getTirasPorFardo(gramaturaWatched);
    const unidades = form.getValues("unidades");

    if (unidades.length === 0) {
      replace(getDefaultUnidades(gramaturaWatched));
      return;
    }

    form.setValue("unidades.1.quantidade_salgadinho", tirasPorFardo);
  }, [gramaturaWatched]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Preço da tira muda → calcula preço do fardo automaticamente ──────────
  useEffect(() => {
    if (tirasWatched === undefined || tirasWatched === null) return;
    if (!isInitialized.current) return;

    const tirasPorFardo = getTirasPorFardo(gramaturaWatched ?? 30);
    const precoFardo = Number((Number(tirasWatched) * tirasPorFardo).toFixed(2));
    form.setValue("unidades.1.preco", precoFardo);
  }, [tirasWatched]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Submit ────────────────────────────────────────────────────────────────
  async function onSubmit(data: ProductFormValues) {
    try {
      setLoading(true);
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

      if (result?.success) {
        toast.success(product ? "Produto atualizado!" : "Produto criado!");
        router.push("/dashboard/produtos");
        router.refresh();
      } else {
        toast.error("Erro ao salvar produto");
      }
    } catch (error) {
      toast.error("Erro ao salvar produto");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

        {/* ── INFORMAÇÕES DO PRODUTO ──────────────────────────────────── */}
        <Card>
          <CardHeader><CardTitle>Informações do Produto</CardTitle></CardHeader>
          <CardContent className="space-y-6">

            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: 01-30GR QUEIJO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="gramatura"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gramatura</FormLabel>
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a gramatura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {GRAMATURAS.map((g) => (
                        <SelectItem key={g.valor} value={String(g.valor)}>
                          {g.valor}GR — {g.tirasPorFardo} tiras/fardo
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descricao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="img_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagem</FormLabel>
                  <FormControl>
                    <ImageUpload
                      key={field.value ?? "empty"}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between border rounded-lg p-4">
                  <FormLabel>Produto ativo</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ── PREÇOS (Tira e Fardo) ───────────────────────────────────── */}
        {gramaturaWatched && (
          <Card>
            <CardHeader>
              <CardTitle>Preços</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-3 bg-muted p-3 text-sm font-medium">
                  <div>Unidade</div>
                  <div>Tiras equivalentes</div>
                  <div>Preço (R$)</div>
                </div>

                {fields.map((field, index) => {
                  const qtd = form.watch(`unidades.${index}.quantidade_salgadinho`);
                  return (
                    <div key={field.id} className="grid grid-cols-3 gap-3 p-3 border-t items-center">
                      <p className="text-sm font-medium">
                        {form.watch(`unidades.${index}.nome_unidade`)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {qtd} tira{qtd !== 1 ? "s" : ""}
                      </p>
                      <FormField
                        control={form.control}
                        name={`unidades.${index}.preco`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                disabled={index !== 0}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === "" ? "" : Number(e.target.value)
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  );
                })}
              </div>

              {gramaturaWatched && (
                <p className="text-xs text-muted-foreground mt-3">
                  Preço do fardo calculado automaticamente: preço da tira ×{" "}
                  {getTirasPorFardo(gramaturaWatched)} tiras.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          {/* Botão voltar preserva a página atual */}
          <Button variant="outline" asChild className="w-full">
            <Link href={backHref}>Voltar</Link>
          </Button>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Salvando..." : "Salvar produto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}