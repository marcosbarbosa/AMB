// Nome: ConfiguracoesPage.tsx
// Nro de linhas+ Caminho: 380 client/src/pages/admin/ConfiguracoesPage.tsx
// Data: 2026-01-23
// Hora: 14:50 (America/Sao_Paulo)
// Função: Painel de Configurações (Binding Correto)
// Versão: v7.2 Final Binding
// Alteração: Garantia de que os campos são populados usando as chaves corretas do objeto config normalizado.

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useSiteConfig } from '@/context/SiteConfigContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
    Loader2, Save, Settings, CalendarClock, AlertTriangle, 
    CheckCircle2, Globe, MessageCircle, Crown, DollarSign, Hammer, 
    Eye, EyeOff, Menu, MapPin, Mail, Youtube, Facebook, Instagram
} from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function ConfiguracoesPage() {
  const { atleta, isAuthenticated, isLoading: authLoading } = useAuth();
  const { config, refreshConfig } = useSiteConfig(); 
  const navigate = useNavigate();
  const { toast } = useToast();

  const [settings, setSettings] = useState({
      email_official: '',
      endereco_sede: '',
      facebook_url: '',
      instagram_url: '',
      whatsapp_official: '',
      youtube_url: ''
  });

  const [menuLocal, setMenuLocal] = useState<Record<string, boolean>>({});
  const [eleicoesAtivas, setEleicoesAtivas] = useState(false);
  const [modoManutencao, setModoManutencao] = useState(false);
  const [diaVencimento, setDiaVencimento] = useState('10');
  const [saving, setSaving] = useState(false);
  const [processingFin, setProcessingFin] = useState(false);
  const [lastResultFin, setLastResultFin] = useState<string | null>(null);

  const menuStructure = [
    { label: "Páginas Principais", items: [
        { key: 'inicio', label: 'Início (Home)' },
        { key: 'cadastro', label: 'Botão: Seja Associado' },
        { key: 'contato', label: 'Contato' },
    ]},
    { label: "Institucional", items: [
        { key: 'institucional', label: 'Menu Institucional (Pai)' },
        { key: 'sobre', label: '↳ Sobre a AMB' },
        { key: 'historico', label: '↳ Histórico' },
        { key: 'diretoria', label: '↳ Diretoria' },
        { key: 'secretaria_digital', label: '↳ Secretaria Digital' },
        { key: 'transparencia', label: '↳ Transparência (Antigo)' },
        { key: 'parceiros', label: '↳ Parceiros' },
    ]},
    { label: "Conteúdo & Eventos", items: [
        { key: 'noticias', label: 'Notícias' },
        { key: 'blog', label: 'Blog' },
        { key: 'eventos', label: 'Eventos & Inscrições' },
        { key: 'campeonatos', label: 'Campeonatos' },
        { key: 'bi', label: 'Inteligência (BI)' },
        { key: 'eleicoes', label: 'Eleições 2026' },
    ]}
  ];

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || atleta?.role !== 'admin')) {
        navigate('/');
        return;
    }

    // POPULATE ROBUSTO
    if (config) {
        setMenuLocal(config.menu || {});
        setEleicoesAtivas(config.eleicoes_ativas);
        setModoManutencao(config.modo_manutencao);

        setSettings({
            email_official: config.email_official || '',
            endereco_sede: config.endereco_sede || '',
            facebook_url: config.social_facebook || '',
            instagram_url: config.social_instagram || '',
            whatsapp_official: config.whatsapp_number || '',
            youtube_url: config.youtube_url || ''
        });
    }
  }, [config, authLoading, isAuthenticated, atleta, navigate]);

  const handleToggleMenu = (key: string) => {
    setMenuLocal(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
        const payload = {
            site_settings: settings,
            menu_config: menuLocal,
            global_flags: {
                eleicoes_ativas: eleicoesAtivas,
                modo_manutencao: modoManutencao
            }
        };

        // Este endpoint precisa existir no servidor
        const res = await axios.post(`${API_BASE}/admin/update_full_config.php`, payload);

        if (res.data.status === 'sucesso') {
            await refreshConfig();
            toast({ title: "Configurações Atualizadas", description: "Todos os dados foram salvos com sucesso.", className: "bg-green-600 text-white" });
        } else {
            // Se der 404 aqui, o usuário ainda não subiu o arquivo PHP
            console.error("Backend Error:", res);
            throw new Error("Falha ao salvar. Verifique se a API existe.");
        }
    } catch (error: any) {
        toast({ title: "Erro ao Salvar", description: "Verifique se o arquivo 'update_full_config.php' existe na pasta API.", variant: "destructive" });
    } finally {
        setSaving(false);
    }
  };

  const handleProcessarFinanceiro = async () => {
    if (!window.confirm(`Confirma fechamento dia ${diaVencimento}?`)) return;
    setProcessingFin(true);
    setLastResultFin(null);
    try {
        const res = await axios.post(`${API_BASE}/admin/rotina_vencimento.php`, {
            dia_limite: diaVencimento,
            executar: true
        });
        if (res.data.status === 'sucesso') {
            setLastResultFin(res.data.mensagem);
            toast({ title: "Sucesso", className: "bg-green-600 text-white" });
        } else {
            throw new Error(res.data.mensagem);
        }
    } catch (error: any) {
        setLastResultFin("Erro: " + (error.response?.data?.mensagem || error.message));
        toast({ title: "Erro", variant: "destructive" });
    } finally {
        setProcessingFin(false);
    }
  };

  if (authLoading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600 h-12 w-12"/></div>;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />

      <main className="flex-grow pt-32 pb-16 px-4 max-w-7xl mx-auto w-full">

        <div className="mb-8 border-b border-slate-200 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-900 uppercase flex items-center gap-3">
                    <Settings className="h-8 w-8 text-slate-600" />
                    Configurações do Sistema
                </h1>
                <p className="text-slate-500 mt-1">Gestão centralizada de parâmetros (Tabelas: site_settings, config_menu).</p>
            </div>
            <Button onClick={handleSaveConfig} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-bold shadow-lg h-12 px-8">
                {saving ? <Loader2 className="animate-spin mr-2 h-5 w-5"/> : <Save className="mr-2 h-5 w-5"/>}
                SALVAR TUDO
            </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="space-y-8 lg:col-span-1">
                <Card className="border-slate-200 shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-blue-700"><Globe className="h-5 w-5"/> Dados da Entidade</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label className="flex items-center gap-2"><Mail className="h-3 w-3"/> Email Oficial</Label><Input value={settings.email_official} onChange={e => setSettings({...settings, email_official: e.target.value})} /></div>
                        <div><Label className="flex items-center gap-2"><MapPin className="h-3 w-3"/> Endereço da Sede</Label><Textarea value={settings.endereco_sede} onChange={e => setSettings({...settings, endereco_sede: e.target.value})} className="resize-none h-20"/></div>
                        <div><Label className="flex items-center gap-2"><MessageCircle className="h-3 w-3 text-green-600"/> WhatsApp Oficial</Label><Input value={settings.whatsapp_official} onChange={e => setSettings({...settings, whatsapp_official: e.target.value})} placeholder="5592..." /></div>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 shadow-sm">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-pink-700"><Instagram className="h-5 w-5"/> Redes Sociais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><Label>Instagram URL</Label><Input value={settings.instagram_url} onChange={e => setSettings({...settings, instagram_url: e.target.value})} /></div>
                        <div><Label>Facebook URL</Label><Input value={settings.facebook_url} onChange={e => setSettings({...settings, facebook_url: e.target.value})} /></div>
                        <div><Label>YouTube URL</Label><Input value={settings.youtube_url} onChange={e => setSettings({...settings, youtube_url: e.target.value})} /></div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8 lg:col-span-1">
                <Card className="border-slate-200 shadow-md h-full flex flex-col">
                    <CardHeader className="bg-blue-50/50 border-b border-blue-100 shrink-0">
                        <CardTitle className="flex items-center gap-2 text-slate-800"><Menu className="h-5 w-5 text-blue-600"/> Estrutura do Menu</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow overflow-hidden">
                        <div className="h-full overflow-y-auto p-4 space-y-6 custom-scrollbar">
                            {menuStructure.map((group, idx) => (
                                <div key={idx} className="space-y-2">
                                    <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b pb-1 mb-2">{group.label}</h4>
                                    {group.items.map((item) => {
                                        const isVisible = menuLocal[item.key] !== false;
                                        return (
                                            <div key={item.key} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-blue-200 bg-white transition-all">
                                                <div className="flex items-center gap-3">
                                                    {isVisible ? <Eye className="h-4 w-4 text-blue-600" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                                    <span className={`text-sm ${isVisible ? 'font-bold text-slate-700' : 'text-slate-400'}`}>{item.label}</span>
                                                </div>
                                                <Switch checked={isVisible} onCheckedChange={() => handleToggleMenu(item.key)} className="data-[state=checked]:bg-blue-600"/>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-8 lg:col-span-1">
                <Card className="border-slate-200 shadow-sm bg-slate-50/50">
                    <CardHeader><CardTitle className="flex items-center gap-2 text-purple-700"><Crown className="h-5 w-5"/> Módulos Especiais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-white shadow-sm">
                            <div className="space-y-0.5"><Label className="text-sm font-bold">Eleições</Label><p className="text-xs text-slate-500">Habilita menu e votação.</p></div>
                            <Switch checked={eleicoesAtivas} onCheckedChange={setEleicoesAtivas} />
                        </div>
                        <div className={`flex items-center justify-between p-3 border rounded-lg shadow-sm transition-colors ${modoManutencao ? 'bg-amber-100 border-amber-300' : 'bg-white'}`}>
                            <div className="space-y-0.5"><Label className={`text-sm font-bold flex items-center gap-2 ${modoManutencao ? 'text-amber-800' : 'text-slate-700'}`}><Hammer className="h-3 w-3" /> Modo Manutenção</Label><p className="text-xs text-slate-500">Bloqueia acesso público.</p></div>
                            <Switch checked={modoManutencao} onCheckedChange={setModoManutencao} className="data-[state=checked]:bg-amber-600"/>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-100 shadow-md bg-white">
                    <CardHeader className="bg-red-50/50 border-b border-red-100"><CardTitle className="flex items-center gap-2 text-red-700"><DollarSign className="h-5 w-5"/> Financeiro</CardTitle></CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0" /><p className="text-[10px] text-amber-800 font-medium leading-tight">Altera status para <strong>PENDENTE</strong> após data limite.</p></div>
                        <div><Label>Dia Limite</Label><div className="flex gap-2 mt-1"><CalendarClock className="h-10 w-10 text-slate-400 p-2 bg-slate-100 rounded-md" /><Input type="number" min="1" max="31" value={diaVencimento} onChange={e => setDiaVencimento(e.target.value)} className="text-lg font-bold"/></div></div>
                        {lastResultFin && <Alert className="bg-white border-green-200"><CheckCircle2 className="h-4 w-4 text-green-600"/><AlertTitle className="text-green-800">Resultado</AlertTitle><AlertDescription className="text-xs text-green-700">{lastResultFin}</AlertDescription></Alert>}
                        <Button onClick={handleProcessarFinanceiro} disabled={processingFin} className="w-full h-12 font-bold bg-red-600 hover:bg-red-700 shadow-lg">{processingFin ? <Loader2 className="animate-spin mr-2"/> : "PROCESSAR AGORA"}</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
// linha 380 client/src/pages/admin/ConfiguracoesPage.tsx