"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2, UserCircle } from "lucide-react";

type Usuario = {
  id: string;
  email: string;
  nome: string;
  role: "admin" | "vendedor";
  codigo_vendedor: string | null;
  created_at: string;
  last_sign_in_at: string | null;
};

type FormData = {
  email: string;
  password: string;
  nome: string;
  role: "admin" | "vendedor";
  codigo_vendedor: string;
};

const EMPTY_FORM: FormData = {
  email: "",
  password: "",
  nome: "",
  role: "vendedor",
  codigo_vendedor: "",
};

export default function UsuariosClient() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog criar/editar
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [salvando, setSalvando] = useState(false);

  // Dialog deletar
  const [usuarioParaDeletar, setUsuarioParaDeletar] = useState<Usuario | null>(null);
  const [deletando, setDeletando] = useState(false);

  // ── Busca usuários ──────────────────────────────────────────────────────────
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/usuarios");
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      setUsuarios(data);
      console.log(data);
    } catch {
      toast.error("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);

  // ── Abrir dialog ────────────────────────────────────────────────────────────
  const abrirCriar = () => {
    setEditando(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const abrirEditar = (u: Usuario) => {
    setEditando(u);
    setForm({
      email: u.email,
      password: "",
      nome: u.nome ?? "",
      role: u.role ?? "vendedor",
      codigo_vendedor: u.codigo_vendedor ?? "",
    });
    setDialogOpen(true);
  };

  // ── Salvar (criar ou editar) ────────────────────────────────────────────────
  const handleSalvar = async () => {
    if (!form.nome || !form.role) {
      toast.error("Nome e role são obrigatórios.");
      return;
    }
    if (!editando && (!form.email || !form.password)) {
      toast.error("Email e senha são obrigatórios para novo usuário.");
      return;
    }

    setSalvando(true);
    try {
      const payload = {
        nome: form.nome,
        role: form.role,
        codigo_vendedor: form.codigo_vendedor || null,
        ...(editando
          ? { password: form.password || undefined }
          : { email: form.email, password: form.password }),
      };

      const res = await fetch(
        editando ? `/api/usuarios/${editando.id}` : "/api/usuarios",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }

      toast.success(editando ? "Usuário atualizado." : "Usuário criado com sucesso.");
      setDialogOpen(false);
      fetchUsuarios();
    } catch {
      toast.error("Erro ao salvar usuário.");
    } finally {
      setSalvando(false);
    }
  };

  // ── Deletar ─────────────────────────────────────────────────────────────────
  const handleDeletar = async () => {
    if (!usuarioParaDeletar) return;
    setDeletando(true);
    try {
      const res = await fetch(`/api/usuarios/${usuarioParaDeletar.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); return; }
      toast.success("Usuário removido.");
      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioParaDeletar.id));
    } catch {
      toast.error("Erro ao remover usuário.");
    } finally {
      setDeletando(false);
      setUsuarioParaDeletar(null);
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={abrirCriar} className="gap-2">
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Button>
      </div>

      {/* Lista */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {loading ? "Carregando..." : `${usuarios.length} usuário${usuarios.length !== 1 ? "s" : ""}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="divide-y">
              {usuarios.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-6 py-3 hover:bg-muted/40 transition-colors">
                  <UserCircle className="w-9 h-9 text-muted-foreground shrink-0" />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{u.nome ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </div>

                  {/* Role */}
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                    u.role === "admin"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {u.role ?? "—"}
                  </span>

                  {/* Código vendedor */}
                  {u.codigo_vendedor != "0"  && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      Cod.vendedor - {u.codigo_vendedor}
                    </span>
                  )}

                  {/* Último acesso */}
                  <span className="text-xs text-muted-foreground w-24 text-right shrink-0 hidden sm:block">
                    {formatDate(u.last_sign_in_at)}
                  </span>

                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => abrirEditar(u)}
                      className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                      title="Editar"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setUsuarioParaDeletar(u)}
                      className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog criar/editar */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Email — só na criação */}
            {!editando && (
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
              </div>
            )}

            {/* Nome */}
            <div className="space-y-1">
              <Label>Nome</Label>
              <Input
                placeholder="Nome completo"
                value={form.nome}
                onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <Label>Role</Label>
              <Select
                value={form.role}
                onValueChange={(v) => setForm((f) => ({ ...f, role: v as "admin" | "vendedor" }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendedor">Vendedor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Código vendedor */}
            <div className="space-y-1">
              <Label>Código Vendedor</Label>
              <Input
                placeholder="ex: 09"
                value={form.codigo_vendedor}
                onChange={(e) => setForm((f) => ({ ...f, codigo_vendedor: e.target.value }))}
              />
            </div>

            {/* Senha */}
            <div className="space-y-1">
              <Label>{editando ? "Nova senha (deixe vazio para não alterar)" : "Senha"}</Label>
              <Input
                type="password"
                placeholder={editando ? "••••••••" : "mínimo 6 caracteres"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={salvando}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={salvando}>
              {salvando ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Salvando...</> : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar exclusão */}
      <AlertDialog
        open={usuarioParaDeletar !== null}
        onOpenChange={(open) => { if (!open) setUsuarioParaDeletar(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover usuário?</AlertDialogTitle>
            <AlertDialogDescription>
              O usuário <strong>{usuarioParaDeletar?.nome}</strong> ({usuarioParaDeletar?.email}) será removido permanentemente do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletando}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDeletar}
              disabled={deletando}
            >
              {deletando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Remover"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}