/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS - Gestão de Placar
 * ==========================================================
 * Versão: 1.1 (Revisão de Importações e Estabilidade)
 * Descrição: Interface para atualização de resultados em tempo real.
 * ==========================================================
 */

import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
  Trophy, ArrowLeft, Home, Save, Loader2, 
  ShieldAlert, CheckCircle2, Swords 
} from "lucide-react";

// Importações de UI (Padrão Shadcn)
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

// CORREÇÃO: Importação do hook de mensagens da pasta correta
import { useToast } from "@/hooks/use-toast"; 

export default function GestaoPlacarPage() {
  const { eventoId, jogoId } = useParams(); // Pega os IDs da URL
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Estado para os dados do jogo
  const [jogo, setJogo] = useState<any>({
    time_a_nome: "Carregando...",
    time_b_nome: "Carregando...",
    placar_a: 0,
    placar_b: 0,
    status: "agendado"
  });

  // Carregar dados iniciais do jogo
  useEffect(() => {
    const carregarJogo = async () => {
      try {
        setFetching(true);
        const res = await axios.get(`https://www.ambamazonas.com.br/api/get_jogo.php?id=${jogoId}`);
        if (res.data.status === "sucesso") {
          setJogo(res.data.dados);
        }
      } catch (error) {
        console.error("Erro ao carregar jogo:", error);
      } finally {
        setFetching(false);
      }
    };
    carregarJogo();
  }, [jogoId]);

  // Função para salvar o novo placar
  const handleSalvarPlacar = async () => {
    try {
      setLoading(true);
      const response = await axios.post("https://www.ambamazonas.com.br/api/atualizar_placar.php", {
        id: jogoId,
        placar_a: jogo.placar_a,
        placar_b: jogo.placar_b,
        status: jogo.placar_a !== jogo.placar_b ? "finalizado" : jogo.status
      });

      if (response.data.status === "sucesso") {
        toast({
          title: "Placar Atualizado!",
          description: "O resultado foi sincronizado com o portal.",
        });
      }
    } catch (error) {
      toast({
        title: "Erro na Conexão",
        description: "Não foi possível salvar o placar.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-orange-600 h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto">

        {/* NAVEGAÇÃO */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft size={18} /> Voltar
          </Button>
          <Button variant="ghost" asChild className="gap-2">
            <Link to="/"><Home size={18} /> Início</Link>
          </Button>
        </div>

        {/* HEADER */}
        <header className="mb-10 text-center">
          <div className="inline-flex p-3 bg-orange-100 rounded-full text-orange-600 mb-4">
            <Trophy size={32} />
          </div>
          <h1 className="text-3xl font-black italic uppercase text-slate-900 tracking-tighter">
            Gestão de <span className="text-orange-600">Placar</span>
          </h1>
          <p className="text-slate-500 font-medium uppercase text-xs tracking-widest mt-2">
            Evento ID: {eventoId} | Jogo ID: {jogoId}
          </p>
        </header>

        <Card className="border-none shadow-2xl overflow-hidden">
          <div className="bg-slate-900 py-4 px-6 flex justify-between items-center text-white">
             <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
               <Swords size={14} className="text-orange-500" /> Confronto Oficial
             </span>
             <span className="text-xs font-bold uppercase bg-orange-600 px-3 py-1 rounded-full">
               Ao Vivo / Final
             </span>
          </div>

          <CardContent className="p-10">
            <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8">

              {/* TIME A */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center border-2 border-slate-200 shadow-inner text-slate-400">
                   <ShieldAlert size={48} />
                </div>
                <h3 className="font-black uppercase italic text-lg leading-tight text-slate-800">
                  {jogo.time_a_nome}
                </h3>
                <Input 
                  type="number" 
                  value={jogo.placar_a} 
                  onChange={(e) => setJogo({...jogo, placar_a: parseInt(e.target.value) || 0})}
                  className="text-center text-4xl font-black h-20 border-2 focus:border-orange-500"
                />
              </div>

              {/* VS */}
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black italic text-slate-200">VS</span>
                <Separator className="my-6" />
              </div>

              {/* TIME B */}
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-slate-100 rounded-2xl mx-auto flex items-center justify-center border-2 border-slate-200 shadow-inner text-slate-400">
                   <ShieldAlert size={48} />
                </div>
                <h3 className="font-black uppercase italic text-lg leading-tight text-slate-800">
                  {jogo.time_b_nome}
                </h3>
                <Input 
                  type="number" 
                  value={jogo.placar_b} 
                  onChange={(e) => setJogo({...jogo, placar_b: parseInt(e.target.value) || 0})}
                  className="text-center text-4xl font-black h-20 border-2 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="mt-12">
              <Button 
                onClick={handleSalvarPlacar} 
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 h-16 font-black text-xl uppercase italic shadow-lg shadow-orange-600/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin mr-2" />
                ) : (
                  <> <CheckCircle2 className="mr-2" /> ATUALIZAR PLACAR AGORA </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-slate-400 text-sm font-medium">
          * A alteração do placar é refletida instantaneamente no portal público da AMB.
        </p>
      </div>
    </div>
  );
}