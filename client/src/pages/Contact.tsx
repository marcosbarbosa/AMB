/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2026 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 10 de janeiro de 2026
 * Hora: 16:05
 * Versão: 2.0
 *
 * Descrição: Página de Contato e Suporte ao Associado.
 * Implementação de design Elite com tipografia forte.
 *
 * ==========================================================
 */

import React from "react";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-slate-900 py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase text-white tracking-tighter">
            Fale com a <span className="text-orange-600">AMB</span>
          </h1>
          <p className="text-slate-400 mt-4 font-bold uppercase tracking-widest">
            Suporte direto, sugestões e parcerias.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
        {/* INFORMAÇÕES DE CONTATO */}
        <div className="space-y-12">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-slate-900 mb-6">Canais Oficiais</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-600"><Mail size={24} /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">E-mail</p>
                  <p className="font-bold text-slate-900">contato@ambamazonas.com.br</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-xl text-slate-900"><MessageSquare size={24} /></div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">WhatsApp Suporte</p>
                  <p className="font-bold text-slate-900">(92) 9XXXX-XXXX</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FORMULÁRIO */}
        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
          <ContactForm />
        </div>
      </section>
    </div>
  );
}