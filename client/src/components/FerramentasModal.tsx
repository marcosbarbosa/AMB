/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: FerramentasModal.tsx
 * CAMINHO: client/src/components/FerramentasModal.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Modal de Controle (BI Removido da Lista)
 * VERSÃO: 7.0 Prime
 * ==========================================================
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Settings, Save, Loader2, Eye, EyeOff, MessageCircle, Smartphone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FerramentasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FerramentasModal({ isOpen, onClose }: FerramentasModalProps) {
  const { menuConfig, whatsappNumber, emailContact, updateConfig, updateWhatsapp, updateEmail } = useSiteConfig();

  const [localMenuConfig, setLocalMenuConfig] = useState(menuConfig);
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsappNumber);
  const [localEmail, setLocalEmail] = useState(emailContact);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setLocalMenuConfig(menuConfig);
      setLocalWhatsapp(whatsappNumber);
      setLocalEmail(emailContact);
    }
  }, [isOpen, menuConfig, whatsappNumber, emailContact]);

  const handleToggle = (key: string) => {
    setLocalMenuConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);

    // Executa as três atualizações em paralelo
    const results = await Promise.all([
        updateConfig(localMenuConfig),
        updateWhatsapp(localWhatsapp),
        updateEmail(localEmail)
    ]);

    setIsSaving(false);

    // Verifica se todos tiveram sucesso (true)
    if (results.every(Boolean)) {
        toast({ 
            title: "Sistema Atualizado", 
            description: "Menus e canais de contato atualizados com sucesso.", 
            className: "bg-green-600 text-white border-none" 
        });
        onClose();
    } else {
        toast({ title: "Erro Parcial", description: "Verifique se todas as alterações foram salvas.", variant: "destructive" });
    }
  };

  // --- LISTA DE MENUS (BI REMOVIDO) ---
  const menuItems = [
    { key: 'inicio', label: 'Início (Home)', isPai: false },
    { key: 'eleicoes', label: 'Módulo Eleições 2026', isPai: false }, 
    { key: 'institucional', label: 'MENU INSTITUCIONAL (PAI)', isPai: true },
    { key: 'sobre', label: '↳ Sobre a AMB', isPai: false },
    { key: 'estatuto', label: '↳ Estatuto', isPai: false },
    { key: 'transparencia', label: '↳ Transparência', isPai: false },
    // { key: 'bi', label: '↳ Inteligência (BI)', isPai: false }, <--- REMOVIDO
    { key: 'parceiros', label: '↳ Parceiros', isPai: false },
    { key: 'cadastro', label: '↳ Quero ser Associado', isPai: false },
    { key: 'campeonatos', label: 'MENU CAMPEONATOS (PAI)', isPai: true },
    { key: 'eventos', label: '↳ Eventos & Inscrições', isPai: false },
    { key: 'blog', label: 'Blog / Notícias', isPai: false },
    { key: 'contato', label: 'Fale Conosco', isPai: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-xl font-black">
            <Settings className="h-6 w-6 text-blue-600" />
            Configurações do Portal
          </DialogTitle>
          <DialogDescription className="text-slate-500">
             Gerencie a visibilidade dos módulos e canais de contato.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-6 max-h-[70vh] overflow-y-auto pr-2">

            {/* SEÇÃO 1: CANAIS DE ATENDIMENTO */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-sm uppercase tracking-wide">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    Canais de Atendimento
                </div>

                {/* WHATSAPP */}
                <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="text-xs font-bold text-slate-500">WhatsApp Oficial</Label>
                    <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            id="whatsapp"
                            value={localWhatsapp}
                            onChange={(e) => setLocalWhatsapp(e.target.value)}
                            placeholder="Ex: 5592999999999"
                            className="pl-9 bg-white border-slate-200 focus:border-green-500 focus:ring-green-500"
                        />
                    </div>
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-slate-500">Email Oficial</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input 
                            id="email"
                            type="email"
                            value={localEmail}
                            onChange={(e) => setLocalEmail(e.target.value)}
                            placeholder="Ex: contato@ambamazonas.com.br"
                            className="pl-9 bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* SEÇÃO 2: MENUS */}
            <div>
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-sm uppercase tracking-wide px-1">
                    <Eye className="h-4 w-4 text-blue-600" />
                    Visibilidade de Módulos
                </div>
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const isVisible = !!localMenuConfig[item.key];
                        return (
                            <div 
                                key={item.key} 
                                onClick={() => handleToggle(item.key)} 
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                                    item.isPai ? 'bg-slate-100 border-slate-200 mt-4' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    {isVisible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                    <span className={`select-none ${item.isPai ? 'font-black uppercase text-xs tracking-wide text-slate-700' : 'font-medium text-sm text-slate-600'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                <Switch checked={isVisible} onCheckedChange={() => {}} className="data-[state=checked]:bg-green-600" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-bold">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
                Salvar Alterações
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// linha 160