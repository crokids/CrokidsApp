"use client";

import { useTransition, useState } from "react";
import Link from "next/link";

import { deleteClient } from "@/actions/client/delete-client";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

import { Pencil, Trash } from "lucide-react";

type Cliente = {
  id: string;
  codcli: number;
  razao: string;
  celular?: string;
  telefone?: string;
  cidade?: string;
  bairro?: string;
  bloqueio?: string;
  created_at: string;
  data_cadas: Date;
};

export default function ClientsTable({ clientes }: { clientes: Cliente[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleDelete() {
    if (!selectedId) return;
    startTransition(async () => {
      await deleteClient(selectedId);
    });
  }

  return (
    <div className="border rounded-lg overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="hidden sm:table-cell">Celular</TableHead>
            <TableHead className="hidden md:table-cell">Telefone</TableHead>
            <TableHead className="hidden md:table-cell">Cidade</TableHead>
            <TableHead className="hidden lg:table-cell">Bairro</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Criado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell className="font-medium">{cliente.codcli}</TableCell>

              <TableCell>{cliente.razao}</TableCell>

              <TableCell className="hidden sm:table-cell">
                {cliente.celular || "-"}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {cliente.telefone || "-"}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                {cliente.cidade || "-"}
              </TableCell>

              <TableCell className="hidden lg:table-cell">
                {cliente.bairro || "-"}
              </TableCell>

              <TableCell>
                {cliente.bloqueio === "S" ? (
                  <Badge variant="destructive">Bloqueado</Badge>
                ) : (
                  <Badge>Ativo</Badge>
                )}
              </TableCell>

              <TableCell className="hidden sm:table-cell">
                {new Date(cliente.data_cadas).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Link href={`/dashboard/clientes/${cliente.id}`}>
                  <Button size="icon" variant="outline">
                    <Pencil size={16} />
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setSelectedId(cliente.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deletar cliente</AlertDialogTitle>
                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá remover
                        permanentemente este cliente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}

          {clientes.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-10">
                Nenhum cliente encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}