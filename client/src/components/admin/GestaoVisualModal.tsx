/*
 * ==========================================================
 * ARQUIVO: GestaoVisualModal.tsx
 * DATA: 12 de Janeiro de 2026
 * FUNÇÃO: Modal para upload de Logo e Endereço da Sede.
 * ==========================================================
 */
import React, { useState } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImagePlus, MapPin, Save, CheckCircle2, Settings2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"; // Caminho corrigido conforme estrutura do projeto

interface GestaoVisualProps {
  temaId: string;
  trigger?: React.ReactNode;
}

export function GestaoVisualModal({ temaId, trigger }: GestaoVisualProps) {
  const { toast } = useToast();
  const [endereco, setEndereco] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Lógica de salvamento mantida conforme especificações anteriores
  const handleSaveEndereco = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('acao', 'update_sede');
      formData.append('endereco_sede', endereco);
      await axios.post('https://www.ambamazonas.com.br/api/update_config_tema.php', formData);
      toast({ title: "Sucesso!", description: "Endereço atualizado." });
    } catch (e) { toast({ variant: "destructive", title: "Erro ao salvar." }); }
    finally { setLoading(false); }
  };

  const handleUploadLogo = async () => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('acao', 'update_logo_tema');
      formData.append('tema_id', temaId);
      formData.append('logo_file', file);
      await axios.post('https://www.ambamazonas.com.br/api/update_config_tema.php', formData);
      toast({ title: "Sucesso!", description: "Logo atualizada." });
      setOpen(false);
      setTimeout(() => window.location.reload(), 500);
    } catch (e) { toast({ variant: "destructive", title: "Erro no upload." }); }
    finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Settings2 className="h-4 w-4" /> Personalizar Identidade
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajustes de Identidade</DialogTitle>
          <DialogDescription>Gerencie a logo do tema #{temaId}.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="logo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="logo" className="gap-2"><ImagePlus className="h-4 w-4" /> Logo</TabsTrigger>
            <TabsTrigger value="sede" className="gap-2"><MapPin className="h-4 w-4" /> Sede</TabsTrigger>
          </TabsList>

          <TabsContent value="logo" className="space-y-4 pt-4 text-center">
            <div className="border-2 border-dashed rounded-xl p-8 bg-slate-50 relative cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              {file ? <p className="font-bold">{file.name}</p> : <p className="text-slate-500">Clique para selecionar nova logo</p>}
            </div>
            <Button className="w-full" disabled={!file || loading} onClick={handleUploadLogo}>Salvar</Button>
          </TabsContent>

          <TabsContent value="sede" className="space-y-4 pt-4">
            <Input placeholder="Endereço da sede..." value={endereco} onChange={(e) => setEndereco(e.target.value)} />
            <Button className="w-full" onClick={handleSaveEndereco}>Salvar Localização</Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}