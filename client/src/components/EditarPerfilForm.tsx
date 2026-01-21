// Nome: EditarPerfilForm.tsx
// Caminho: client/src/components/EditarPerfilForm.tsx
// Data: 2026-01-20
// Hora: 22:15 (America/Sao_Paulo)
// Função: Formulário Completo de Edição de Perfil (Todos os Campos da Base)
// Versão: v3.0 Full Fields Restoration
// Alteração: Restauração de telefone, filiação, naturalidade e lógica de loading robusta.

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Save, Loader2, RefreshCw } from 'lucide-react';

const API_UPDATE_URL = 'https://www.ambamazonas.com.br/api/admin/admin_update_associado.php';
const API_GET_PROFILE = 'https://www.ambamazonas.com.br/api/get_profile.php';

export function EditarPerfilForm() {
  const { atleta, token, login } = useAuth();
  const { toast } = useToast();

  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Estado inicial mapeando TODOS os campos da tabela 'atletas'
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    cpf: '',
    rg: '',
    data_nascimento: '',
    telefone_whatsapp: '',
    nacionalidade: 'Brasileira',
    naturalidade: '',
    filiacao: '',
    endereco: '',
    autoriza_imagem: false,
    preferencia_newsletter: 'email'
  });

  // Busca dados frescos do banco ao montar o componente
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
      setIsLoadingData(true);
      try {
        // Tenta buscar do endpoint dedicado primeiro
        const res = await axios.get(API_GET_PROFILE, { headers: { Authorization: token } });
        if (res.data.status === 'sucesso') {
            const d = res.data.dados;
            setFormData({
                nome_completo: d.nome_completo || '',
                email: d.email || '',
                cpf: d.cpf || '',
                rg: d.rg || '',
                data_nascimento: d.data_nascimento || '',
                telefone_whatsapp: d.telefone_whatsapp || '',
                nacionalidade: d.nacionalidade || 'Brasileira',
                naturalidade: d.naturalidade || '',
                filiacao: d.filiacao || '',
                endereco: d.endereco || '',
                autoriza_imagem: d.autoriza_imagem == 1,
                preferencia_newsletter: d.preferencia_newsletter || 'email'
            });
        } else {
            // Fallback para o contexto se a API falhar
            loadFromContext();
        }
      } catch (error) {
        console.error("Erro ao carregar perfil, usando cache local.", error);
        loadFromContext();
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchProfile();
  }, [token]);

  const loadFromContext = () => {
      if (atleta) {
          setFormData(prev => ({
              ...prev,
              nome_completo: atleta.nome_completo || '',
              email: atleta.email || '',
              cpf: atleta.cpf || '',
              // Outros campos podem não estar no contexto leve do login
          }));
      }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
    setFormData(prev => ({ ...prev, autoriza_imagem: checked === true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        id: atleta?.id,
        token: token,
        ...formData,
        autoriza_imagem: formData.autoriza_imagem ? 1 : 0
      };

      const res = await axios.post(API_UPDATE_URL, payload);

      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso", description: "Perfil atualizado com sucesso!", className: "bg-green-600 text-white" });
        // Atualiza contexto global para refletir mudança na UI (ex: Nome no menu)
        if (atleta) login({ ...atleta, ...formData } as any, token!);
      } else {
        throw new Error(res.data.mensagem);
      }
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao salvar.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) return <div className="p-10 text-center flex flex-col items-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/><span className="mt-2 text-slate-500">Carregando seus dados...</span></div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Bloco 1: Identificação */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs uppercase">1</span> Dados Pessoais
        </h3>

        <div className="grid gap-5">
            <div className="space-y-2">
                <Label>Nome Completo</Label>
                <Input name="nome_completo" value={formData.nome_completo} onChange={handleChange} className="font-bold text-slate-700" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>CPF <span className="text-xs text-slate-400">(Fixo)</span></Label>
                    <Input value={formData.cpf} disabled className="bg-slate-50 text-slate-500 font-mono" />
                </div>
                <div className="space-y-2">
                    <Label>RG</Label>
                    <Input name="rg" value={formData.rg} onChange={handleChange} placeholder="Número do RG" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Data de Nascimento</Label>
                    <Input type="date" name="data_nascimento" value={formData.data_nascimento} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label>Telefone / WhatsApp</Label>
                    <Input name="telefone_whatsapp" value={formData.telefone_whatsapp} onChange={handleChange} placeholder="(92) 90000-0000" />
                </div>
            </div>
        </div>
      </div>

      {/* Bloco 2: Origem e Filiação */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs uppercase">2</span> Origem
        </h3>
        <div className="grid gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                    <Label>Nacionalidade</Label>
                    <Input name="nacionalidade" value={formData.nacionalidade} onChange={handleChange} />
                </div>
                <div className="space-y-2">
                    <Label>Naturalidade (Cidade/Estado)</Label>
                    <Input name="naturalidade" value={formData.naturalidade} onChange={handleChange} placeholder="Ex: Manaus - AM" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Filiação (Nome do Pai e da Mãe)</Label>
                <Input name="filiacao" value={formData.filiacao} onChange={handleChange} placeholder="Nome dos pais" />
            </div>
        </div>
      </div>

      {/* Bloco 3: Endereço */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 border-b pb-2 mb-4 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs uppercase">3</span> Localização
        </h3>
        <div className="space-y-2">
            <Label>Endereço Completo</Label>
            <Textarea name="endereco" value={formData.endereco} onChange={handleChange} rows={3} placeholder="Rua, Número, Bairro, Cidade, CEP" />
        </div>
      </div>

      {/* Bloco 4: Privacidade */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex items-start space-x-3">
            <Checkbox id="terms" checked={formData.autoriza_imagem} onCheckedChange={handleCheckboxChange} className="mt-1" />
            <div className="grid gap-1.5 leading-none">
                <Label htmlFor="terms" className="text-sm font-bold text-slate-700 cursor-pointer">Autorização de Imagem</Label>
                <p className="text-xs text-slate-500">
                    Autorizo a AMB Amazonas a utilizar minha imagem em fotos e vídeos de eventos esportivos para divulgação no site e redes sociais oficiais.
                </p>
            </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" className="w-full h-14 text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-5 w-5"/>}
            {isSubmitting ? 'Salvando...' : 'SALVAR ALTERAÇÕES'}
        </Button>
      </div>
    </form>
  );
}
// linha 195 EditarPerfilForm.tsx