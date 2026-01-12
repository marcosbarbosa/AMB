/*
 * ==========================================================
 * PÁGINA: ConfiguracoesPage.tsx
 * Versão: 3.1 (Correção de Importação e Integração Visual)
 * ==========================================================
 */
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Caminho corrigido
import { useToast } from '@/hooks/use-toast';
import { Palette, Smartphone, Save, Check, ImagePlus } from 'lucide-react';

// IMPORTAÇÃO DO MODAL DE GESTÃO VISUAL
import { GestaoVisualModal } from "@/components/admin/GestaoVisualModal";

const API_CONFIG = 'https://www.ambamazonas.com.br/api/admin_configuracoes.php';

// Preview de Layout mantido do original
const WebsitePreview = ({ p, s, a, nome, active }: { p: string, s: string, a: string, nome: string, active?: boolean }) => (
  <div className={`relative w-full aspect-[4/3] rounded-lg border-2 overflow-hidden transition-all hover:scale-[1.02] cursor-pointer ${active ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 bg-white'}`}>
    <div style={{ backgroundColor: a }} className="h-1 w-full" />
    <div style={{ backgroundColor: p }} className="h-4 w-full flex items-center px-2 justify-between">
       <div className="w-8 h-1 bg-white/30 rounded" />
    </div>
    <div style={{ backgroundColor: s + '20' }} className="h-12 w-full p-2 flex flex-col gap-1">
       <div style={{ backgroundColor: p }} className="w-1/2 h-2 rounded-sm" />
       <div style={{ backgroundColor: s }} className="w-8 h-2 rounded-sm mt-1 shadow-sm" />
    </div>
    <div className="absolute bottom-0 w-full bg-white p-2 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-bold text-slate-600 truncate mr-1">{nome}</span>
        {active && <Check className="h-3 w-3 text-blue-600 shrink-0" />}
    </div>
  </div>
);

export default function ConfiguracoesPage() {
  const { toast } = useToast();
  const [configs, setConfigs] = useState({ whatsapp_official: '', modo_tema_automatico: '1', inscricoes_abertas: '1' });
  const [temas, setTemas] = useState<any[]>([]);

  useEffect(() => { fetchDados(); }, []);

  const fetchDados = async () => {
    try {
        const resConf = await axios.get(`${API_CONFIG}?acao=geral`);
        const resTemas = await axios.get(`${API_CONFIG}?acao=temas`);
        if(resConf.data.status === 'sucesso') setConfigs(resConf.data.dados);
        if(resTemas.data.status === 'sucesso') setTemas(resTemas.data.dados);
    } catch (e) { console.error(e); }
  };

  const toggleTema = async (id: string) => {
    try {
        await axios.post(API_CONFIG, { acao: 'ativar_tema', id });
        toast({ title: "Tema Aplicado!" });
        fetchDados();
        setTimeout(() => window.location.reload(), 1000);
    } catch (e) { toast({ title: "Erro", variant: "destructive" }); }
  };

  const activeThemeId = temas.find(t => t.ativo === '1')?.id;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <main className="pt-24 pb-16 px-4 max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personalização</h1>
                <p className="text-slate-500">Gerencie a identidade visual e configurações da AMB.</p>
            </div>
            {activeThemeId && (
              <GestaoVisualModal 
                temaId={activeThemeId} 
                trigger={
                  <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg gap-2">
                    <ImagePlus className="h-4 w-4" /> Logo & Sede
                  </Button>
                }
              />
            )}
        </header>

        <Tabs defaultValue="temas" className="space-y-8">
            <TabsList className="bg-white border p-1 rounded-xl">
                <TabsTrigger value="geral" className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">Geral</TabsTrigger>
                <TabsTrigger value="temas" className="px-6 py-2 rounded-lg data-[state=active]:bg-slate-900 data-[state=active]:text-white transition-all">Identidade Visual</TabsTrigger>
            </TabsList>

            <TabsContent value="temas">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {temas.map((t) => (
                        <div key={t.id} className="space-y-2">
                            <div onClick={() => toggleTema(t.id)}>
                                <WebsitePreview p={t.cor_primaria} s={t.cor_secundaria} a={t.cor_accent} nome={t.nome} active={t.ativo === '1'} />
                            </div>
                            <GestaoVisualModal 
                              temaId={t.id} 
                              trigger={
                                <Button variant="ghost" size="sm" className="w-full text-[10px] h-6 gap-1 text-slate-500 hover:text-blue-600">
                                  <ImagePlus className="h-3 w-3" /> Logo do Tema
                                </Button>
                              }
                            />
                        </div>
                    ))}
                </div>
            </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}