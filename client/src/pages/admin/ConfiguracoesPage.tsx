// Nome: ConfiguracoesPage.tsx
// Caminho: client/src/pages/admin/ConfiguracoesPage.tsx
// Data: 2026-01-20
// Hora: 23:55
// Função: Painel de Configurações Gerais e Processamento Financeiro

import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Save, CalendarClock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const API_BASE = 'https://www.ambamazonas.com.br/api';

export default function ConfiguracoesPage() {
  const { atleta, token, isAuthenticated, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [diaVencimento, setDiaVencimento] = useState('10');
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Carrega configs ao abrir
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || atleta?.role !== 'admin')) {
        navigate('/');
        return;
    }

    const loadConfig = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/config_manager.php`, { headers: { Authorization: token } });
            if (res.data.status === 'sucesso') {
                setDiaVencimento(res.data.configs.dia_vencimento || '10');
            }
        } catch (e) { console.error(e); }
    };
    if (token) loadConfig();
  }, [token, isAuthenticated, authLoading]);

  // Salva o Dia
  const handleSaveConfig = async () => {
      setLoading(true);
      try {
          const res = await axios.post(`${API_BASE}/admin/config_manager.php`, { 
              token, dia_vencimento: diaVencimento 
          });
          if (res.data.status === 'sucesso') {
              toast({ title: "Salvo", description: "Data de vencimento atualizada.", className: "bg-green-600 text-white" });
          }
      } catch (e) { toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" }); }
      finally { setLoading(false); }
  };

  // Processa a Inadimplência
  const handleProcessar = async () => {
      if (!window.confirm("ATENÇÃO: Isso mudará o status de todos os associados que não pagaram neste mês para 'Pendente'. Deseja continuar?")) return;

      setProcessing(true);
      setLastResult(null);
      try {
          const res = await axios.post(`${API_BASE}/admin/processar_vencimentos.php`, { token });
          if (res.data.status === 'sucesso') {
              setLastResult(`Sucesso! ${res.data.afetados} associados atualizados para Pendente.`);
              toast({ title: "Processamento Concluído", description: res.data.mensagem, className: "bg-blue-600 text-white" });
          } else {
              setLastResult("Erro: " + res.data.mensagem);
          }
      } catch (e: any) {
          setLastResult("Erro Crítico: " + e.message);
      } finally {
          setProcessing(false);
      }
  };

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navigation />
      <main className="flex-grow pt-32 pb-16 px-4 max-w-4xl mx-auto w-full">

        <h1 className="text-3xl font-black text-slate-900 mb-8 uppercase flex items-center gap-3">
            <CalendarClock className="h-8 w-8 text-blue-600"/> Configurações do Portal
        </h1>

        <div className="grid gap-8">
            {/* CARD 1: Configuração de Data */}
            <Card className="shadow-md border-slate-200">
                <CardHeader>
                    <CardTitle>Financeiro</CardTitle>
                    <CardDescription>Defina as regras de cobrança automática.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-end gap-4">
                        <div className="space-y-2 flex-1">
                            <Label>Dia Oficial de Vencimento</Label>
                            <Input 
                                type="number" 
                                min="1" max="31" 
                                value={diaVencimento} 
                                onChange={(e) => setDiaVencimento(e.target.value)} 
                                className="font-bold text-lg"
                            />
                            <p className="text-xs text-slate-500">O sistema usará este dia como base para calcular atrasos.</p>
                        </div>
                        <Button onClick={handleSaveConfig} disabled={loading} className="mb-0.5 h-10 font-bold bg-slate-800">
                            {loading ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>} Salvar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* CARD 2: Processamento Manual (Zona de Perigo) */}
            <Card className="shadow-md border-red-100 bg-red-50/50">
                <CardHeader>
                    <CardTitle className="text-red-700 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5"/> Rotina de Fechamento de Mês
                    </CardTitle>
                    <CardDescription className="text-red-600/80">
                        Esta ação verifica todos os associados e altera o status para <strong>PENDENTE</strong> caso não tenham pagamento registrado no mês atual após a data de vencimento.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {lastResult && (
                        <Alert className="mb-4 bg-white border-blue-200">
                            <CheckCircle2 className="h-4 w-4 text-blue-600"/>
                            <AlertTitle>Resultado</AlertTitle>
                            <AlertDescription>{lastResult}</AlertDescription>
                        </Alert>
                    )}

                    <Button 
                        onClick={handleProcessar} 
                        disabled={processing} 
                        className="w-full h-14 text-lg font-black bg-red-600 hover:bg-red-700 shadow-xl"
                    >
                        {processing ? <Loader2 className="animate-spin mr-2"/> : "PROCESSAR VENCIMENTOS AGORA"}
                    </Button>
                    <p className="text-center text-xs text-red-500 mt-2 font-bold uppercase">Ação Irreversível. Use com cautela.</p>
                </CardContent>
            </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}