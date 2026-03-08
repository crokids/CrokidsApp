"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

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

import { ImageUpload } from "./image-upload";

import { Trash, Plus } from "lucide-react";
import { toast } from "sonner";

interface Produto {
  id: string;
  nome: string;
  descricao: string | null;
  img_url: string | null;
  ativo: boolean;
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

export default function ProductForm({ product }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      nome: "",
      descricao: "",
      img_url: "",
      ativo: true,
      unidades: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "unidades",
  });

  /*
  ======================
  DEFAULT CREATE VALUES
  ======================
  */

  /*
  ======================
  LOAD PRODUCT / CREATE
  ======================
  */

  useEffect(() => {
    const defaultUnits = [
      {
        nome_unidade: "Unidade",
        quantidade_salgadinho: 1,
        preco: 0,
      },
      {
        nome_unidade: "Tira",
        quantidade_salgadinho: 10,
        preco: 0,
      },
      {
        nome_unidade: "Fardo",
        quantidade_salgadinho: 100,
        preco: 0,
      },
    ];

    if (product) {
      const unidades = product.unidades_produto.map((u) => ({
        nome_unidade: u.nome_unidade,
        quantidade_salgadinho: u.quantidade_salgadinho,
        preco: u.preco,
      }));

      form.reset({
        nome: product.nome,
        descricao: product.descricao ?? "",
        img_url: product.img_url ?? "",
        ativo: product.ativo,
        unidades,
      });
    } else {
      form.reset({
        nome: "",
        descricao: "",
        img_url: "",
        ativo: true,
        unidades: defaultUnits,
      });
    }
  }, [product, form]);

  /*
  ======================
  AUTO PRICE CALCULATION
  ======================
  */

  const unidadePreco = form.watch("unidades.0.preco");

  useEffect(() => {
    if (unidadePreco === undefined || unidadePreco === null) return;

    const unidades = form.getValues("unidades");

    unidades.forEach((u, index) => {
      if (index === 0) return;

      const novoPreco = Number(
        (Number(unidadePreco) * u.quantidade_salgadinho).toFixed(2),
      );

      form.setValue(`unidades.${index}.preco`, novoPreco);
    });
  }, [unidadePreco, form]);

  /*
  ======================
  SUBMIT
  ======================
  */

  async function onSubmit(data: ProductFormValues) {
    try {
      setLoading(true);

      let result;

      if (product) {
        result = await updateProduct(product.id, data);
      } else {
        result = await createProduct(data);
      }

      if (result?.success) {
        toast.success(
          product
            ? "Produto atualizado com sucesso!"
            : "Produto criado com sucesso!",
        );

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
        {/* PRODUTO */}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Produto</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do produto" {...field} />
                  </FormControl>
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
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* UNIDADES */}

        <Card>
          <CardHeader>
            <CardTitle>Unidades de venda</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <div className="grid grid-cols-4 bg-muted p-3 text-sm font-medium">
                <div>Unidade</div>
                <div>Quantidade</div>
                <div>Preço</div>
                <div></div>
              </div>

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-4 gap-3 p-3 border-t items-center"
                >
                  <FormField
                    control={form.control}
                    name={`unidades.${index}.nome_unidade`}
                    render={({ field }) => <Input {...field} />}
                  />

                  <FormField
                    control={form.control}
                    name={`unidades.${index}.quantidade_salgadinho`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`unidades.${index}.preco`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value === "" ? "" : Number(value));
                        }}
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => remove(index)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() =>
                append({
                  nome_unidade: "",
                  quantidade_salgadinho: 1,
                  preco: 0,
                })
              }
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar unidade
            </Button>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Salvar produto"}
        </Button>
      </form>
    </Form>
  );
}
