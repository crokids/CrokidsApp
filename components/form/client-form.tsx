/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { clientSchema, ClientFormValues } from "@/lib/schemas/clientSchema";

import { createClientAction } from "@/actions/client/create-client";
import { updateClient } from "@/actions/client/update-client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { toast } from "sonner";

type Props = {
  cliente?: ClientFormValues & { id: string };
};

export default function ClientForm({ cliente }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Tipagem explícita resolve o erro do resolver
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as any,
    defaultValues: {
      codcli: cliente?.codcli ?? 0,
      razao: cliente?.razao ?? "",
      fantasia: cliente?.fantasia ?? "",
      tipo_log: cliente?.tipo_log ?? undefined,
      nome_log: cliente?.nome_log ?? "",
      bairro: cliente?.bairro ?? "",
      cidade: cliente?.cidade ?? "",
      estado: cliente?.estado ?? "",
      uf: cliente?.uf ?? "",
      telefone: cliente?.telefone ?? "",
      celular: cliente?.celular ?? "",
      cnpj_cpf: cliente?.cnpj_cpf ?? "",
      tipo_estab: cliente?.tipo_estab ?? "",
      bloqueio: cliente?.bloqueio ?? "N",
      dt_bloqueo: cliente?.dt_bloqueo ?? "",
    },
  });

  async function onSubmit(data: ClientFormValues) {
    try {
      setLoading(true);

      let result;

      if (cliente) {
        result = await updateClient(cliente.id, data);
      } else {
        result = await createClientAction(data);
      }

      if (result?.success) {
        toast.success(
          cliente
            ? "Cliente atualizado com sucesso!"
            : "Cliente criado com sucesso!",
        );
        router.push("/dashboard/clientes");
        router.refresh();
      } else {
        toast.error("Erro ao salvar cliente");
      }
    } catch (error) {
      toast.error("Erro ao salvar cliente");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* IDENTIFICAÇÃO */}
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="codcli"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código do cliente</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 1001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cnpj_cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ / CPF</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0001-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="razao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Razão social</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão social" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fantasia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome fantasia</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome fantasia" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tipo_estab"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de estabelecimento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Mercado, Bar, Restaurante..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* ENDEREÇO */}
        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tipo_log"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de logradouro</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="RUA">Rua</SelectItem>
                        <SelectItem value="AVENIDA">Avenida</SelectItem>
                        <SelectItem value="ALAMEDA">Alameda</SelectItem>
                        <SelectItem value="TRAVESSA">Travessa</SelectItem>
                        <SelectItem value="RODOVIA">Rodovia</SelectItem>
                        <SelectItem value="OUTRO">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nome_log"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da rua, avenida..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bairro"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input placeholder="Bairro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Estado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="uf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input placeholder="SP" maxLength={2} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* CONTATO */}
        <Card>
          <CardHeader>
            <CardTitle>Contato</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="telefone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="celular"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Celular</FormLabel>
                    <FormControl>
                      <Input placeholder="(00) 00000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* BLOQUEIO */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bloqueio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloqueio</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="N">Ativo</SelectItem>
                        <SelectItem value="S">Bloqueado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dt_bloqueo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de bloqueio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Salvando..." : "Salvar cliente"}
        </Button>
      </form>
    </Form>
  );
}
