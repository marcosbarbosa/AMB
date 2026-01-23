// Nome: About.tsx
// Nro de linhas+ Caminho: 130 client/src/components/About.tsx
// Data: 2026-01-23
// Hora: 13:00 (America/Sao_Paulo)
// Função: Seção Sobre Nós (Robust Null Safety)
// Versão: v9.0 Crash Proof
// Alteração: Implementação de Defensive Coding para leitura de config.menu.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Trophy, HeartHandshake, MapPin, ArrowRight, FileText, Download, Loader2, History } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';
import { DiretoriaPremium } from '@/components/DiretoriaPremium'; 
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { useSiteConfig } from '@/context/SiteConfigContext'; 
import { motion } from 'framer-motion';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export function About() {
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Extração segura do contexto
  const { config, loading } = useSiteConfig(); 

  // 2. Lógica de Exibição Blindada
  // Se estiver carregando, assume true para evitar layout shift.
  // Se config existir, tenta ler menu.diretoria.
  // Se menu.diretoria for undefined, assume true.
  // Só esconde se for explicitamente false.
  const showDiretoria = loading ? true : (config?.menu?.diretoria ?? true);

  const [estatutos, setEstatutos] = useState<any[]>([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEstatutos = async () => {
      try {
        const res = await axios.get(`${API_BASE}/listar_documentos_publico.php?tipo=estatuto`);
        if (res.data.status === 'sucesso') {
          setEstatutos(res.data.documentos);
        }
      } catch (error) {
        console.error("Erro estatutos:", error);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchEstatutos();
  }, []);

  const handleVerEstatuto = () => {
    if (loadingDocs) return;
    if (estatutos.length === 0) {
      toast({ title: "Em Atualização", description: "O documento do Estatuto está sendo atualizado.", variant: "default" });
    } else if (estatutos.length === 1) {
      const url = estatutos[0].url_arquivo.startsWith('http') 
        ? estatutos[0].url_arquivo 
        : `https://www.ambamazonas.com.br${estatutos[0].url_arquivo}`;
      window.open(url, '_blank');
    } else {
      setIsModalOpen(true);
    }
  };

  const destaquesAMB = [
    { icon: HeartHandshake, title: 'Integração Social', description: 'Promovemos atividades que visam o desenvolvimento integral.' },
    { icon: Trophy, title: 'Espírito Competitivo', description: 'Incentivamos a participação em competições regionais e internacionais.' },
    { icon: Users, title: 'Categoria Master', description: 'Foco total na difusão do Basquetebol para atletas 30+.' },
  ];

  const ENDERECO = "R. Washington Luís, 111 - Dom Pedro, Manaus - AM, 69040-210";
  const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(ENDERECO)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const MAP_EXTERNAL_LINK = `https://maps.google.com/maps?q=${encodeURIComponent(ENDERECO)}`;

  return (
    <>
      <section id="sobre" className="py-20 lg:py-24 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Texto História */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="space-y-6"
            >
              <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 px-3 py-1 text-xs uppercase font-bold">
                   <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse mr-2" />Institucional
                </Badge>
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">A História da <br/><span className="text-blue-700">AMB Amazonas</span></h2>
              <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                <p>A <strong>Associação Master de Basquetebol do Amazonas (AMB)</strong> é uma entidade civil sem fins lucrativos, fundada em 20 de outubro de 2004.</p>
                <p>Nossa missão vai além das quadras: buscamos proporcionar saúde e o reencontro de amigos através do esporte.</p>
              </div>
              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                 <Button onClick={() => navigate('/sobre')} className="bg-blue-700 hover:bg-blue-800 text-white shadow-lg h-12 px-8 text-md">
                    <History className="mr-2 h-4 w-4"/> Nossa História
                 </Button>
                 <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white hover:text-blue-700 h-12 px-8 text-md relative" onClick={handleVerEstatuto} disabled={loadingDocs}>
                   {loadingDocs ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <FileText className="mr-2 h-4 w-4"/>} 
                   Ver Estatuto
                 </Button>
              </div>
            </motion.div>

            {/* Mapa */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="relative group perspective-1000"
            >
              <Card className="relative p-2 bg-white border-slate-200 shadow-2xl rounded-2xl overflow-hidden">
                 <div className="relative w-full h-[450px] bg-slate-100 rounded-xl overflow-hidden">
                    <iframe src={MAP_EMBED_URL} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"></iframe>
                    <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0"><MapPin className="h-6 w-6" /></div>
                        <div><h4 className="font-bold text-slate-800 text-sm">CCA Dom Pedro</h4><p className="text-[10px] text-slate-500">Manaus - AM</p></div>
                        <Button size="sm" variant="ghost" className="ml-auto text-blue-600 text-xs" onClick={() => window.open(MAP_EXTERNAL_LINK, '_blank')}>Abrir</Button>
                    </div>
                 </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {destaquesAMB.map((destaque, index) => (
              <div key={index} className="group p-8 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all relative overflow-hidden">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-blue-50 text-blue-600 mb-6 group-hover:scale-110 transition-transform"><destaque.icon className="h-7 w-7" /></div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{destaque.title}</h3>
                <p className="text-slate-500 text-sm">{destaque.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Renderização Segura */}
      {showDiretoria && <DiretoriaPremium />}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-white border border-slate-200">
            <DialogHeader><DialogTitle>Documentos Oficiais</DialogTitle></DialogHeader>
            <div className="py-4 space-y-3">
                {estatutos.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-slate-50" onClick={() => window.open(doc.url_arquivo.startsWith('http') ? doc.url_arquivo : `https://www.ambamazonas.com.br${doc.url_arquivo}`, '_blank')}>
                        <h4 className="font-bold text-slate-800 text-sm">{doc.titulo}</h4><Download className="h-4 w-4 text-blue-600"/>
                    </div>
                ))}
            </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
// linha 130 client/src/components/About.tsx