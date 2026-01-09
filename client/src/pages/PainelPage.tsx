/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Painel do Associado
 * ==========================================================
 */
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, BadgeCheck, Clock } from "lucide-react";

export default function PainelPage() {
  const { atleta } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-black italic uppercase text-slate-900">Meu Painel</h1>
          <p className="text-slate-500 font-medium">Gerencie seus dados e acompanhe sua situação.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase">Status</CardTitle>
              <BadgeCheck className="text-orange-600" size={20} />
            </CardHeader>
            <CardContent>
              {/* CORREÇÃO DO ERRO toUpperCase */}
              <p className="text-2xl font-black text-slate-900">
                {atleta?.status_cadastro?.toUpperCase() || "PENDENTE"}
              </p>
            </CardContent>
          </Card>

          {/* Mais cards aqui... */}
        </div>

        <Card className="shadow-xl border-none">
          <CardHeader className="bg-slate-900 text-white rounded-t-lg">
            <CardTitle className="uppercase italic font-black">Dados Cadastrais</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">Nome Completo</label>
                <p className="font-bold text-slate-800">{atleta?.nome_completo || "Não informado"}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">E-mail</label>
                <p className="font-bold text-slate-800">{atleta?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}