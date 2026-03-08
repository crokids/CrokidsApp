"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTransition, useState } from "react";
import { deleteProduct } from "@/actions/product/deleteProduct";

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

import { Pencil, Trash } from "lucide-react";
import Link from "next/link";

type Produto = {
  id: string;
  nome: string;
  img_url?: string;
  ativo: boolean;
  created_at: string;
  unidades_produto: { id: string }[];
};

export default function ProductsTable({ produtos }: { produtos: Produto[] }) {
  const [isPending, startTransition] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleDelete() {
    if (!selectedId) return;

    startTransition(async () => {
      await deleteProduct(selectedId);
    });
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Imagem</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Unidades</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Criado</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell>
                {produto.img_url ? (
                  <Image
                    src={produto.img_url}
                    alt={produto.nome}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-muted rounded-md" />
                )}
              </TableCell>

              <TableCell className="font-medium">{produto.nome}</TableCell>

              <TableCell>{produto.unidades_produto.length}</TableCell>

              <TableCell>{produto.ativo ? "Ativo" : "Inativo"}</TableCell>

              <TableCell>
                {new Date(produto.created_at).toLocaleDateString()}
              </TableCell>

              <TableCell className="text-right space-x-2">
                <Link href={`/dashboard/produtos/${produto.id}`}>
                  <Button size="icon" variant="outline">
                    <Pencil size={16} />
                  </Button>
                </Link>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setSelectedId(produto.id)}
                    >
                      <Trash size={16} />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Deletar produto
                      </AlertDialogTitle>

                      <AlertDialogDescription>
                        Essa ação não pode ser desfeita. Isso irá remover
                        permanentemente este produto.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>

                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isPending}
                        variant="destructive"
                      >
                        Deletar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}

          {produtos.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Nenhum produto encontrado
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}