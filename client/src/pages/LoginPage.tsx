/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 *
 * Descrição: Página de Acesso ao Portal (Login).
 * Removidos os componentes de layout redundantes.
 *
 * ==========================================================
 */

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sucesso = await login(email, senha);
    if (sucesso) {
      // Redireciona para o painel; o App.tsx cuidará de mostrar o cadeado
      navigate("/painel");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 px-4 py-12">
      <Card className="w-full max-w-md shadow-2xl border-slate-200">
        <CardHeader className="text-center bg-slate-900 text-white rounded-t-xl py-10">
          <CardTitle className="text-2xl font-black italic uppercase flex items-center justify-center gap-3">
            <LogIn /> Acesso ao Portal
          </CardTitle>
          <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">
            AMB Amazonas
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase">E-mail</label>
              <Input 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-600 uppercase">Senha</label>
              <Input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 h-12 font-bold text-lg shadow-lg">
              ENTRAR NO PORTAL
            </Button>
            <div className="text-center pt-4 border-t border-slate-100">
              <Link to="/cadastro" className="text-sm text-orange-600 hover:underline font-bold">
                Ainda não tem conta? Recadastre-se aqui
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}