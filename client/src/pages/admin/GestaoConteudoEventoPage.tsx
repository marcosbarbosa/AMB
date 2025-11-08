/*
 * ==========================================================
 * PORTAL AMB DO AMAZONAS
 * ==========================================================
 *
 * Copyright (c) 2025 Marcos Barbosa @mbelitecoach
 * Todos os direitos reservados.
 *
 * Data: 5 de novembro de 2025
 * Hora: 18:30
 * Versão: 1.0 (Plano B - Modularizado)
 * Tarefa: 283 (Módulo 29)
 *
 * Descrição: Página de Gestão de CONTEÚDO de um Evento Específico.
 * (Formulários de Posts e Boletins).
 * Rota: /admin/eventos/conteudo/:eventoId
 *
 * ==========================================================
 */
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/context/AuthContext'; 
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { Loader2, ArrowLeft, FileText } from 'lucide-react'; 
import axios from 'axios'; 
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// --- APIs ---
const LISTAR_EVENTOS_API_URL = 'https://www.ambamazonas.com.br/api/listar_eventos.php'; 
const CRIAR_POST_EVENTO_API_URL = 'https://www.ambamazonas.com.br/api/admin_criar_post_evento.php';
const CRIAR_BOLETIM_API_URL = 'https://www.ambamazonas.com.br/api/admin_criar_boletim.php';
// TODO: Adicionar APIs para listar/apagar posts e boletins

// --- Interfaces ---
interface Evento {
  id: number; nome_evento: string;
}

export default function GestaoConteudoEventoPage() {
  const { isAuthenticated, atleta, token, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate(); 
  const { toast } = useToast();
  const { eventoId } = useParams(); // <-- Lê o ID do evento da URL

  const [evento, setEvento] = useState<Evento | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Estados para formulários
  const [postTitulo, setPostTitulo] = useState('');
  const [postTipo, setPostTipo] = useState('jogo_do_dia');
  const [postImagem, setPostImagem] = useState<File | null>(null);
  const [boletimTitulo, setBoletimTitulo] = useState('');
  const [boletimPdf, setBoletimPdf] = useState<File | null>(null);

  // 1. Busca os detalhes do Evento (para sabermos o nome)
  useEffect(() => {
    if (isAuthLoading) return; 
    if (!isAuthenticated || (atleta?.role !== 'admin')) { 
      toast({ title: 'Acesso Negado', description: 'Você não tem permissão para ver esta página.', variant: 'destructive' });
      navigate('/'); 
      return;
    }

    const fetchEventoInfo = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(LISTAR_EVENTOS_API_URL);
        if (response.data.status === 'sucesso' && response.data.eventos) {
          const eventoEncontrado = response.data.eventos.find((e: Evento) => e.id === Number(eventoId));
          if (eventoEncontrado) {
            setEvento(eventoEncontrado);
          } else {
            toast({ title: 'Erro', description: `Evento com ID ${eventoId} não encontrado.`, variant: 'destructive' });
            navigate('/admin/eventos');
          }
        }
      } catch (error) {
        toast({ title: 'Erro', description: 'Não foi possível carregar os dados do evento.', variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventoInfo();
  }, [isAuthenticated, atleta, isAuthLoading, navigate, toast, eventoId]); 


  // --- Handlers Módulo 29 (Posts e Boletins) ---

  const handleCriarPostEvento = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !eventoId) return;

    if (postTipo !== 'placar_live' && (!postTitulo)) { 
       toast({ title: 'Erro', description: 'Título é obrigatório para este tipo de post.', variant: 'destructive' });
       return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('token', token);
    formData.append('id_evento', eventoId);
    formData.append('tipo_post', postTipo);
    formData.append('titulo', postTitulo);
    if (postImagem) {
      formData.append('url_imagem', postImagem);
    }

    try {
      const response = await axios.post(CRIAR_POST_EVENTO_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Post do evento enviado!' });
        setPostTitulo('');
        setPostImagem(null);
        (event.target as HTMLFormElement).reset(); 
        // TODO: Recarregar lista de posts
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível criar o post.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCriarBoletim = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!token || !eventoId || !boletimPdf) {
       toast({ title: 'Erro', description: 'Título e Ficheiro PDF são obrigatórios.', variant: 'destructive' });
       return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('token', token);
    formData.append('id_evento', eventoId);
    formData.append('titulo_boletim', boletimTitulo);
    formData.append('url_pdf', boletimPdf);

    try {
      const response = await axios.post(CRIAR_BOLETIM_API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.status === 'sucesso') {
        toast({ title: 'Sucesso!', description: 'Boletim PDF enviado!' });
        setBoletimTitulo('');
        setBoletimPdf(null);
        (event.target as HTMLFormElement).reset(); 
        // TODO: Recarregar lista de boletins
      } else {
        throw new Error(response.data.mensagem);
      }
    } catch (error: any) {
      let msg = error.response?.data?.mensagem || 'Não foi possível enviar o boletim.';
      toast({ title: 'Erro', description: msg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Estado de Carregamento Principal
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="mr-2 h-8 w-8 animate-spin" />
        <p className="text-muted-foreground">A carregar gestão de conteúdo...</p>
      </div>
    );
  }

  // Renderização (JSX)
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16"> 
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Link para Voltar */}
            <div className="mb-8">
              <Link 
                to="/admin/eventos" 
                className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para Gestão de Eventos
              </Link>
            </div>

            <h1 className="text-3xl font-semibold font-accent text-foreground mb-2">
              Gestão de Conteúdo
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Evento: <strong>{evento?.nome_evento}</strong>
            </p>

            {/* Grid 2: Gestão de Conteúdo (Posts e Boletins) */}
            <div className="grid lg:grid-cols-2 gap-12 mt-6">

              {/* Coluna 1: Formulário de Post de Evento */}
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Adicionar Post ao Evento
                </h3>
                <form onSubmit={handleCriarPostEvento} className="space-y-4">

                  {/* Selecionar Tipo de Post */}
                  <div className="space-y-2">
                    <Label htmlFor="post-tipo_post">Tipo de Post</Label>
                    <Select name="tipo_post" required
                            value={postTipo}
                            onValueChange={setPostTipo}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jogo_do_dia">Jogo do Dia (Foto + Título)</SelectItem>
                        <SelectItem value="cestinha">Cestinha (Foto + Título)</SelectItem>
                        <SelectItem value="foto_time">Foto de Time (Foto + Título)</SelectItem>
                        <SelectItem value="placar_live">Placar ao Vivo (Formulário Placar)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Formulário Condicional */}
                  {postTipo === 'placar_live' ? (
                    // TODO: Criar o formulário de Placar ao Vivo
                    <div className="text-muted-foreground text-sm p-4 bg-muted/50 rounded-md">
                      (O formulário para inputar placar em tempo real [Módulo 29-B] aparecerá aqui.)
                    </div>
                  ) : (
                    // Formulário Padrão (Jogo do Dia, Cestinha, Foto)
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="post-titulo">Título do Post</Label>
                        <Input id="post-titulo" name="titulo" required 
                               value={postTitulo} onChange={(e) => setPostTitulo(e.target.value)} />
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="post-imagem">Imagem do Post (Opcional)</Label>
                        <Input id="post-imagem" name="url_imagem" type="file" accept="image/png, image/jpeg, image/webp" 
                               onChange={(e) => setPostImagem(e.target.files ? e.target.files[0] : null)} />
                         <p className="text-sm text-muted-foreground">Ex: {postTipo === 'jogo_do_dia' ? "Arte do Jogo" : "Foto do Cestinha"}</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Adicionar Post
                      </Button>
                    </>
                  )}
                </form>
              </div>

              {/* Coluna 2: Formulário de Boletim PDF */}
              <div className="bg-card p-6 rounded-lg shadow-sm border border-border">
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Adicionar Boletim (PDF)
                </h3>
                <form onSubmit={handleCriarBoletim} className="space-y-4">
                  {/* Título do Boletim */}
                  <div className="space-y-2">
                    <Label htmlFor="boletim-titulo">Título do Boletim</Label>
                    <Input id="boletim-titulo" name="titulo_boletim" required 
                           placeholder="Ex: Boletim 9 - Classificação Geral"
                           value={boletimTitulo} onChange={(e) => setBoletimTitulo(e.target.value)} />
                  </div>
                  {/* Upload PDF */}
                  <div className="space-y-2">
                    <Label htmlFor="boletim-pdf">Ficheiro PDF</Label>
                    <Input id="boletim-pdf" name="url_pdf" type="file" accept=".pdf" required
                           onChange={(e) => setBoletimPdf(e.target.files ? e.target.files[0] : null)} />
                     <p className="text-sm text-muted-foreground">Ex: Boletim Estatístico</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enviar Boletim
                    <FileText className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}