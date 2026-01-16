/*
 * ==========================================================
 * PROJETO: Portal AMB Amazonas
 * ARQUIVO: FerramentasModal.tsx
 * CAMINHO: client/src/components/FerramentasModal.tsx
 * DATA: 15 de Janeiro de 2026
 * FUNÇÃO: Modal de Controle de Menus (Com opção BI)
 * VERSÃO: 4.0 Prime
 * ==========================================================
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Settings, Save, Loader2, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FerramentasModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FerramentasModal({ isOpen, onClose }: FerramentasModalProps) {
  const { menuConfig, updateConfig } = useSiteConfig();
  const [localConfig, setLocalConfig] = useState(menuConfig);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setLocalConfig(menuConfig);
    }
  }, [isOpen, menuConfig]);

  const handleToggle = (key: string) => {
    setLocalConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateConfig(localConfig);
    setIsSaving(false);

    if (success) {
        toast({ title: "Sistema Atualizado", description: "Configurações salvas.", className: "bg-green-600 text-white border-none" });
        onClose();
    } else {
        toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
    }
  };

  // --- LISTA DE MENUS (ATUALIZADA) ---
  const menuItems = [
    { key: 'inicio', label: 'Início (Home)', isPai: false },
    { key: 'eleicoes', label: 'Módulo Eleições 2026', isPai: false },
    { key: 'institucional', label: 'MENU INSTITUCIONAL (PAI)', isPai: true },
    { key: 'sobre', label: '↳ Sobre a AMB', isPai: false },
    { key: 'estatuto', label: '↳ Estatuto', isPai: false },
    { key: 'transparencia', label: '↳ Transparência', isPai: false },
    { key: 'bi', label: '↳ Inteligência (BI)', isPai: false }, // <--- BI
    { key: 'parceiros', label: '↳ Parceiros', isPai: false },
    { key: 'cadastro', label: '↳ Quero ser Associado', isPai: false },
    { key: 'campeonatos', label: 'MENU CAMPEONATOS (PAI)', isPai: true },
    { key: 'eventos', label: '↳ Eventos & Inscrições', isPai: false },
    { key: 'blog', label: 'Blog / Notícias', isPai: false },
    { key: 'contato', label: 'Fale Conosco', isPai: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-xl font-black">
            <Settings className="h-6 w-6 text-blue-600" />
            Ferramentas do Sistema
          </DialogTitle>
          <DialogDescription className="text-slate-500">
             Controle a visibilidade dos módulos públicos.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto pr-2">
            {menuItems.map((item) => {
                const isVisible = !!localConfig[item.key];
                return (
                    <div 
                        key={item.key} 
                        onClick={() => handleToggle(item.key)} 
                        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
                            item.isPai ? 'bg-slate-100 border-slate-200 mt-4' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            {isVisible ? <Eye className="h-5 w-5 text-green-600" /> : <EyeOff className="h-5 w-5 text-slate-300" />}
                            <span className={`select-none ${item.isPai ? 'font-black uppercase text-xs tracking-wide text-slate-700' : 'font-medium text-sm text-slate-600'}`}>
                                {item.label}
                            </span>
                        </div>
                        <Switch checked={isVisible} onCheckedChange={() => {}} className="data-[state=checked]:bg-green-600" />
                    </div>
                );
            })}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-bold">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>}
                Salvar
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}