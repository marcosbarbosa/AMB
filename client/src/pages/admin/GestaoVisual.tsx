/*
 * ==========================================================
 * ARQUIVO: GestaoVisual.tsx
 * DATA: 12 de Janeiro de 2026
 * FUNÇÃO: Interface para upload de Logo e Endereço da Sede.
 * ==========================================================
 */
import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, MapPin, Save, CheckCircle2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export default function GestaoVisual({ temaId }: { temaId: string }) {
  const { toast } = useToast();
  const [endereco, setEndereco] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Salvar Endereço da Sede
  const handleSaveEndereco = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('acao', 'update_sede');
      formData.append('endereco_sede', endereco);

      const res = await axios.post('https://www.ambamazonas.com.br/api/update_config_tema.php', formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Sucesso!", description: "Endereço da sede atualizado." });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao salvar endereço." });
    } finally {
      setLoading(false);
    }
  };

  // 2. Salvar Nova Logo
  const handleUploadLogo = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('acao', 'update_logo_tema');
      formData.append('tema_id', temaId);
      formData.append('logo_file', file);

      const res = await axios.post('https://www.ambamazonas.com.br/api/update_config_tema.php', formData);
      if (res.data.status === 'sucesso') {
        toast({ title: "Logo Atualizada!", description: "A nova imagem já está aplicada ao tema." });
        // Força recarregamento da página para atualizar o CSS global
        window.location.reload();
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Erro", description: "Falha no upload da imagem." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">

      {/* CARD: LOGO DO TEMA */}
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ImagePlus className="h-5 w-5 text-blue-600" /> Logomarca do Tema
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept="image/*"
            />
            {file ? (
              <div className="text-center">
                <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
              </div>
            ) : (
              <div className="text-center">
                <ImagePlus className="h-10 w-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-500">Clique para selecionar a Logo</p>
                <p className="text-xs text-slate-400">PNG ou SVG (Fundo transparente recomendado)</p>
              </div>
            )}
          </div>
          <Button 
            className="w-full" 
            disabled={!file || loading} 
            onClick={handleUploadLogo}
          >
            {loading ? "Enviando..." : "Confirmar Nova Logo"}
          </Button>
        </CardContent>
      </Card>

      {/* CARD: ENDEREÇO DA SEDE (MAPA) */}
      <Card className="border-2 border-slate-100 shadow-sm">
        <CardHeader className="bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-red-600" /> Localização da Sede
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço Completo</Label>
            <Input 
              id="endereco" 
              placeholder="Rua, Número, Bairro, CEP..." 
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
          </div>
          <p className="text-xs text-slate-500 italic">
            * Este endereço será usado pelo Google Maps na página inicial.
          </p>
          <Button 
            variant="outline" 
            className="w-full gap-2" 
            disabled={loading || !endereco}
            onClick={handleSaveEndereco}
          >
            <Save className="h-4 w-4" /> Salvar Localização
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}