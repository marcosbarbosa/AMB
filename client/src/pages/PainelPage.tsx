/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ARQUIVO: PainelPage.tsx
 * VERSÃO: 1.4 Prime (Blindagem contra Crash de Status)
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Edit, CalendarDays, Loader2 } from 'lucide-react'; 
import axios from 'axios'; 

const EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php';

interface Evento {
  id: number;
  nome_evento: string;
  genero: 'masculino' | 'feminino' | 'misto';
  data_inicio: string;
  data_fim: string | null;
  descricao: string | null;
}

export default function PainelPage() {
  const { isAuthenticated, atleta } = useAuth();
  const navigate = useNavigate(); 

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]); 

  useEffect(() => {
    if (isAuthenticated) {
      const fetchEventos = async () => {
        setIsLoadingEventos(true);
        setErroEventos(null);
        try {
          const response = await axios.get(EVENTOS_API_URL);
          if (response.data.status === 'sucesso') {
            setEventos(response.data.eventos);
          } else {
            throw new Error(response.data.mensagem || 'Erro ao buscar eventos');
          }
        } catch (error) {
          console.error("Erro ao buscar eventos:", error);
          setErroEventos('Não foi possível carregar os eventos.');
        } finally {
          setIsLoadingEventos(false);
        }
      };

      fetchEventos();
    }
  }, [isAuthenticated]); 

  if (!isAuthenticated || !atleta) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">A carregar dados do associado...</p> 
      </div>
    );
  }

  const formatarData = (data: string | null) => {
    if (!data) return 'Data a definir';
    try {
      return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'UTC', 
      });
    } catch (e) {
      return data; 
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        {/* Secção de Boas-Vindas */}
        <section className="py-16 lg:py-20 bg-card">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <h1 className="text-3xl font-semibold font-accent text-foreground mb-4">
               Painel do Associado 
             </h1>
             <p className="text-xl text-muted-foreground mb-8">
               Bem-vindo(a), {atleta.nome_completo}! 
             </p>
           </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-3 gap-12">

            {/* Coluna da Esquerda: Informações do Cadastro */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">
                  Informações do Cadastro
                </h2>
                <Button variant="outline" asChild>
                  <Link to="/painel/editar">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Perfil
                  </Link>
                </Button>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">
                <p><strong>Nome:</strong> {atleta.nome_completo}</p>
                <p><strong>Email:</strong> {atleta.email}</p>
                <p><strong>Status do Cadastro:</strong> 
                  <span className={`font-medium ${
                    atleta.status_cadastro === 'aprovado' ? 'text-green-600' :
                    atleta.status_cadastro === 'rejeitado' ? 'text-red-600' :
                    'text-yellow-600' 
                  }`}>
                    {/* --- A CORREÇÃO DE BLINDAGEM ESTÁ AQUI EMBAIXO --- */}
                    {atleta?.status_cadastro ? atleta.status_cadastro.toUpperCase() : 'AGUARDANDO...'}
                  </span>
                </p>
                <p><strong>Categoria Atual (calculada):</strong> {atleta.categoria_atual || 'Não definida'}</p>
              </div>
            </div>

            {/* Coluna da Direita: Eventos Futuros */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Próximos Eventos
              </h2>
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border space-y-4">

                {isLoadingEventos && (
                  <div className="flex items-center justify-center text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    A carregar eventos...
                  </div>
                )}
                {erroEventos && (
                  <p className="text-red-600">{erroEventos}</p>
                )}
                {!isLoadingEventos && !erroEventos && eventos.length === 0 && (
                  <p className="text-muted-foreground">Nenhum evento cadastrado no momento.</p>
                )}
                {!isLoadingEventos && !erroEventos && eventos.length > 0 && (
                  <ul className="space-y-4">
                    {eventos.map((evento) => (
                      <li key={evento.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-foreground">{evento.nome_evento}</h4>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Início: {formatarData(evento.data_inicio)}
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">{evento.descricao}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}