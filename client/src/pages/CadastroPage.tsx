/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 27 de outubro de 2025
 * Hora: 23:05
 * Versão: 1.1 (Refatoração de Terminologia)
 *
 * Descrição: Página de Cadastro de Associado (/cadastro).
 * ATUALIZADO para usar a terminologia "Associado" e remover
 * componentes Navigation e Footer manuais.
 *
 * ==========================================================
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function CadastroPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-none">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl text-center py-10">
            <div className="flex justify-center mb-4">
              <UserPlus size={48} className="text-orange-500" />
            </div>
            <CardTitle className="text-3xl font-black italic uppercase tracking-tighter">
              Recadastro de Associados <span className="text-orange-500">2026</span>
            </CardTitle>
            <p className="text-slate-400 mt-2 font-medium">Associação Master de Basquetebol do Amazonas</p>
          </CardHeader>
          <CardContent className="p-8">
            <div className="text-center py-12">
               <p className="text-slate-600 text-lg font-medium">
                 Inicie o seu processo de recadastro para garantir participação nos torneios oficiais.
               </p>

               {/* Área para renderização do formulário dinâmico de cadastro */}
               <div className="mt-12 border-2 border-dashed border-slate-200 rounded-2xl p-10 text-slate-400 font-bold uppercase tracking-widest">
                  Formulário de Cadastro / Associado
               </div>

               <div className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-xl text-orange-800 text-sm max-w-md mx-auto">
                 <strong>Dica:</strong> Certifique-se de que os seus dados de contacto estão atualizados para receber as tabelas de jogos.
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}