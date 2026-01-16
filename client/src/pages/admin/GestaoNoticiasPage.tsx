/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: GestaoNoticiasPage.tsx
 * CAMINHO: client/src/pages/admin/GestaoNoticiasPage.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Gestão de Blog/Notícias (Placeholder Funcional)
 * VERSÃO: 1.0 Prime
 * ==========================================================
 */

import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Newspaper, Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function GestaoNoticiasPage() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="flex-1 p-8 flex flex-col items-center justify-center">

        <div className="max-w-2xl w-full text-center">
            <div className="mb-6 flex justify-center">
                <div className="h-20 w-20 bg-cyan-100 rounded-full flex items-center justify-center">
                    <Newspaper className="h-10 w-10 text-cyan-600" />
                </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-2">Gestão de Notícias</h1>
            <p className="text-slate-500 mb-8">
                O módulo de blog e newsletters está sendo preparado para o lançamento da temporada 2026.
            </p>

            <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
                <CardContent className="p-12 flex flex-col items-center">
                    <Construction className="h-12 w-12 text-slate-400 mb-4 animate-pulse" />
                    <h3 className="font-bold text-slate-700 text-lg">Módulo em Desenvolvimento</h3>
                    <p className="text-sm text-slate-400 mt-1">Aguarde as próximas atualizações do sistema.</p>
                </CardContent>
            </Card>
        </div>

      </main>
    </div>
  );
}