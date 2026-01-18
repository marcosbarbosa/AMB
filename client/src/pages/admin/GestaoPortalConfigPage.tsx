/*
// Nome: GestaoPortalConfigPage.tsx
// Caminho: client/src/pages/admin/GestaoPortalConfigPage.tsx
// Data: 2026-01-18
// Hora: 00:15 (America/Sao_Paulo)
// Função: Gestão Centralizada (Menus, Contatos, Social)
// Versão: v1.0.0 Prime
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigation } from '@/components/Navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Save, Globe, Share2, Menu, ArrowLeft } from 'lucide-react';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function GestaoPortalConfigPage() {
  const { token, isAuthenticated, atleta } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estados de Configuração
  const [geral, setGeral] = useState({
    whatsapp_official: '',
    email_official: '',
    endereco_sede: ''
  });

  const [social, setSocial] = useState({
    facebook_url: '',
    instagram_url: '',
    youtube_url: ''
  });

  const [menus, setMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isAuthenticated && atleta?.role === 'admin') {
      fetchConfigs();
    }
  }, [isAuthenticated]);

  const fetchConfigs = async () => {
    try {
      const res = await axios.get(`${API_BASE}/get_site_config.php`);
      if (res.data.status === 'sucesso') {
        setGeral({
          whatsapp_official: res.data.whatsapp || '',
          email_official: res.data.email || '',
          endereco_sede: res.data.endereco || ''
        });
        setSocial({
          facebook_url: res.data.social.facebook || '',
          instagram_url: res.data.social.instagram || '',
          youtube_url: res.data.social.youtube || ''
        });
        setMenus(res.data.menu || {});
      }
    } catch (error) {
      console.error("Erro ao carregar configs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    // Unifica tudo num payload plano para a site_settings
    const payloadGeral = {
        ...geral,
        ...social
    };

    try {
        // 1. Salva Configurações Gerais e Social
        await axios.post(`${API_BASE}/admin_configuracoes.php`, {
            acao: 'salvar_configs',
            configs: payloadGeral,
            token
        });

        // 2. Salva Visibilidade dos Menus
        await axios.post(`${API_BASE}/update_menu_config.php`, {
            config: menus,
            token
        });

        toast({ title: "Sucesso", description: "Portal atualizado!", className: "bg-green-600 text-white" });

    } catch (error) {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    } finally {
        setSaving(false);
    }
  };

  const toggleMenu = (key: string) => {
      setMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />

      <main className="pt-32 pb-16 px-4 max-w-5xl mx-auto">

        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Configurações do Portal</h1>
                <p className="text-slate-500">Gerencie contatos, redes sociais e visibilidade dos menus.</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/admin/painel')}><ArrowLeft className="mr-2 h-4 w-4"/> Voltar</Button>
        </div>

        <Tabs defaultValue="geral" className="w-full">
            <TabsList className="mb-6 bg-white p-1 rounded-xl border border-slate-200">
                <TabsTrigger value="geral" className="gap-2"><Globe className="h-4 w-4"/> Contatos</TabsTrigger>
                <TabsTrigger value="social" className="gap-2"><Share2 className="h-4 w-4"/> Redes Sociais</TabsTrigger>
                <TabsTrigger value="menus" className="gap-2"><Menu className="h-4 w-4"/> Menus do Site</TabsTrigger>
            </TabsList>

            {/* ABA GERAL */}
            <TabsContent value="geral">
                <Card>
                    <CardHeader><CardTitle>Canais de Atendimento</CardTitle><CardDescription>Dados exibidos no rodapé e fale conosco.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>WhatsApp Oficial (Apenas números)</Label>
                            <Input value={geral.whatsapp_official} onChange={e => setGeral({...geral, whatsapp_official: e.target.value})} placeholder="55929..." />
                        </div>
                        <div className="space-y-2">
                            <Label>E-mail Oficial</Label>
                            <Input value={geral.email_official} onChange={e => setGeral({...geral, email_official: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Endereço da Sede</Label>
                            <Input value={geral.endereco_sede} onChange={e => setGeral({...geral, endereco_sede: e.target.value})} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ABA SOCIAL */}
            <TabsContent value="social">
                <Card>
                    <CardHeader><CardTitle>Redes Sociais</CardTitle><CardDescription>Links dos ícones no topo do site.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Facebook URL</Label>
                            <Input value={social.facebook_url} onChange={e => setSocial({...social, facebook_url: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>Instagram URL</Label>
                            <Input value={social.instagram_url} onChange={e => setSocial({...social, instagram_url: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label>YouTube URL</Label>
                            <Input value={social.youtube_url} onChange={e => setSocial({...social, youtube_url: e.target.value})} />
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* ABA MENUS */}
            <TabsContent value="menus">
                <Card>
                    <CardHeader><CardTitle>Visibilidade do Menu</CardTitle><CardDescription>Ligue ou desligue módulos inteiros do site.</CardDescription></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        {Object.keys(menus).map((key) => (
                            <div key={key} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
                                <div className="space-y-0.5">
                                    <Label className="text-base capitalize">{key.replace(/_/g, ' ')}</Label>
                                    <p className="text-xs text-slate-500">Exibir no topo do site</p>
                                </div>
                                <Switch checked={menus[key]} onCheckedChange={() => toggleMenu(key)} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
            <Button size="lg" onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 font-bold">
                {saving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                SALVAR ALTERAÇÕES
            </Button>
        </div>

      </main>
    </div>
  );
}
// linha 160 GestaoPortalConfigPage.tsx