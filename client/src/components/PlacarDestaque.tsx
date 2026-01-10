/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 8 de novembro de 2025
 * Hora: 00:45
 * Versão: 1.0
 * Tarefa: 309 (Módulo 29-E - Placar Público)
 *
 * Descrição: Componente público para exibir o "Placar ao Vivo"
 * (Jogo em Destaque) na Homepage.
 *
 * ==========================================================
 */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CalendarClock } from "lucide-react";

// API
const JOGO_DESTAQUE_API_URL = 'https://www.ambamazonas.com.br/api/public_obter_jogo_destaque.php';

// Interface (deve corresponder ao PHP)
interface JogoDestaque {
  id: number;
  nome_evento: string;
  nome_time_a: string;
  logo_time_a: string | null;
  nome_time_b: string;
  logo_time_b: string | null;
  placar_q1_a: number; placar_q1_b: number;
  placar_q2_a: number; placar_q2_b: number;
  placar_q3_a: number; placar_q3_b: number;
  placar_q4_a: number; placar_q4_b: number;
  placar_final_a: number; placar_final_b: number;
  periodo_atual: string;
  status_jogo: 'agendado' | 'ao_vivo' | 'finalizado';
  data_jogo: string;
  horario_jogo: string;
}

// Componente para exibir um logo de time
const TimeLogo = ({ logo, nome }: { logo: string | null, nome: string }) => {
  const logoUrl = logo ? `https://www.ambamazonas.com.br${logo}` : '/favicon.png'; // Fallback
  return (
    <img 
      src={logoUrl} 
      alt={`Logo ${nome}`} 
      className="h-16 w-16 md:h-20 md:w-20 object-contain mx-auto"
    />
  );
};

export function PlacarDestaque() {
  const [jogo, setJogo] = useState<JogoDestaque | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJogoDestaque = async () => {
      try {
        const response = await axios.get(JOGO_DESTAQUE_API_URL);
        if (response.data.status === 'sucesso') {
          setJogo(response.data.jogo_destaque);
        } else {
          setError(response.data.mensagem);
        }
      } catch (err) {
        setError('Não foi possível conectar ao servidor de placar.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJogoDestaque();

    // Polling: Atualiza a cada 30 segundos
    const interval = setInterval(fetchJogoDestaque, 30000);

    return () => clearInterval(interval);
  }, []);

  // Renderização do Loading
  if (isLoading) {
    return (
      <section id="placar-destaque" className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              <p className="mt-2">A carregar placar...</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Renderização de Erro ou "Nenhum Jogo"
  if (error || !jogo) {
    return (
       <section id="placar-destaque" className="py-12 lg:py-16 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center text-muted-foreground">
              <CalendarClock className="h-6 w-6 mx-auto mb-2" />
              <p>Nenhum jogo em destaque no momento.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  // Helpers para calcular placar total (se não estiver finalizado)
  const placarTotalA = jogo.status_jogo === 'finalizado' ? jogo.placar_final_a : (jogo.placar_q1_a + jogo.placar_q2_a + jogo.placar_q3_a + jogo.placar_q4_a);
  const placarTotalB = jogo.status_jogo === 'finalizado' ? jogo.placar_final_b : (jogo.placar_q1_b + jogo.placar_q2_b + jogo.placar_q3_b + jogo.placar_q4_b);

  return (
    <section id="placar-destaque" className="py-12 lg:py-16 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg overflow-hidden">
          <CardContent className="p-6">

            {/* Cabeçalho do Jogo (NBA Style) */}
            <div className="flex justify-between items-center mb-4 text-sm text-muted-foreground">
              <span>{jogo.nome_evento}</span>
              <span className="font-medium text-primary uppercase">
                {jogo.status_jogo === 'ao_vivo' ? `AO VIVO - ${jogo.periodo_atual}` : jogo.periodo_atual}
              </span>
              <span>{new Date(jogo.data_jogo).toLocaleDateString('pt-BR', {timeZone: 'UTC', day: '2-digit', month: '2-digit'})} - {jogo.horario_jogo.substring(0, 5)}</span>
            </div>

            {/* Placar Principal */}
            <div className="grid grid-cols-3 items-center text-center mb-6">
              <div className="space-y-2">
                <TimeLogo logo={jogo.logo_time_a} nome={jogo.nome_time_a} />
                <h3 className="text-lg md:text-xl font-semibold">{jogo.nome_time_a}</h3>
              </div>

              <div className="flex items-center justify-center space-x-4">
                 <span className="text-4xl md:text-6xl font-bold">{placarTotalA}</span>
                 <span className="text-2xl md:text-4xl text-muted-foreground">-</span>
                 <span className="text-4xl md:text-6xl font-bold">{placarTotalB}</span>
              </div>

               <div className="space-y-2">
                <TimeLogo logo={jogo.logo_time_b} nome={jogo.nome_time_b} />
                <h3 className="text-lg md:text-xl font-semibold">{jogo.nome_time_b}</h3>
              </div>
            </div>

            {/* Tabela de Períodos (NBA Style) */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-sm">
                <thead className="text-muted-foreground">
                  <tr>
                    <th className="text-left font-normal p-2">Equipe</th>
                    <th className="font-normal p-2">Q1</th>
                    <th className="font-normal p-2">Q2</th>
                    <th className="font-normal p-2">Q3</th>
                    <th className="font-normal p-2">Q4</th>
                    <th className="font-bold text-foreground p-2">T</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="text-left font-medium p-2">{jogo.nome_time_a}</td>
                    <td className="p-2">{jogo.placar_q1_a}</td>
                    <td className="p-2">{jogo.placar_q2_a}</td>
                    <td className="p-2">{jogo.placar_q3_a}</td>
                    <td className="p-2">{jogo.placar_q4_a}</td>
                    <td className="font-bold text-foreground p-2">{placarTotalA}</td>
                  </tr>
                  <tr>
                    <td className="text-left font-medium p-2">{jogo.nome_time_b}</td>
                    <td className="p-2">{jogo.placar_q1_b}</td>
                    <td className="p-2">{jogo.placar_q2_b}</td>
                    <td className="p-2">{jogo.placar_q3_b}</td>
                    <td className="p-2">{jogo.placar_q4_b}</td>
                    <td className="font-bold text-foreground p-2">{placarTotalB}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TODO: Adicionar Mídia (Posts) (Módulo 29-F) */}

          </CardContent>
        </Card>
      </div>
    </section>
  );
}