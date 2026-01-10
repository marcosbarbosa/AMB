/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 17:15
 * Versão: 1.0
 * Tarefa: 401
 *
 * Descrição: Gestão de Posts, Notícias e Newsletters.
 * Módulo para publicação de conteúdos no portal público.
 *
 * ==========================================================
 */

import React from "react";
import { FileText, Plus, Search, Newspaper, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function GestaoPostsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER ELITE */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black italic uppercase text-slate-900 tracking-tighter flex items-center gap-3">
              <Newspaper className="text-orange-600" size={36} /> Posts & News
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-1">
              Gerenciamento de comunicação oficial AMB
            </p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700 font-black uppercase italic tracking-widest px-8 shadow-lg shadow-orange-600/20">
            <Plus size={18} className="mr-2" /> Novo Post
          </Button>
        </div>

        {/* ÁREA DE CONTEÚDO */}
        <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 border-b border-slate-800 p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <CardTitle className="text-white font-black italic uppercase text-sm tracking-widest">
                Artigos Publicados
              </CardTitle>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <Input className="pl-10 bg-slate-800 border-none text-white placeholder:text-slate-500 text-xs" placeholder="Buscar notícia..." />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Data</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Título do Post</TableHead>
                  <TableHead className="font-black uppercase text-[10px] tracking-widest text-slate-500">Status</TableHead>
                  <TableHead className="text-right font-black uppercase text-[10px] tracking-widest text-slate-500">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-30">
                      <FileText size={48} />
                      <p className="font-black italic uppercase text-sm">Nenhum post encontrado</p>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}