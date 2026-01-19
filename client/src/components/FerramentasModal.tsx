// Nome: FerramentasModal.tsx
// Caminho: client/src/components/FerramentasModal.tsx
// Data: 2026-01-18
// Hora: 21:38 (America/Sao_Paulo)
// Função: Modal de Controle com Chaves Sincronizadas
// Versão: v9.2 Sync Strict
// Alteração: Chaves (keys) alinhadas estritamente com Navigation.tsx

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

  const [localMenu, setLocalMenu] = useState(menuConfig);
  const [localWhatsapp, setLocalWhatsapp] = useState(whatsappNumber);
  const [localEmail, setLocalEmail] = useState(emailContact);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setLocalMenu(menuConfig || {});
      setLocalWhatsapp(whatsappNumber || '');
      setLocalEmail(emailContact || '');
    }
  }, [isOpen, menuConfig, whatsappNumber, emailContact]);

  const handleToggle = (key: string) => {
    setLocalMenu(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    let hasError = false;
    let successCount = 0;

    // 1. WhatsApp
    if (localWhatsapp !== whatsappNumber) {
        const res = await updateWhatsapp(localWhatsapp);
        if (!res.success) {
            toast({ title: "Erro WhatsApp", description: res.msg, variant: "destructive" });
            hasError = true;
        } else successCount++;
    }

    // 2. Email
    if (localEmail !== emailContact) {
        const res = await updateEmail(localEmail);
        if (!res.success) {
            toast({ title: "Erro Email", description: res.msg, variant: "destructive" });
            hasError = true;
        } else successCount++;
    }

    // 3. Menu
    const resMenu = await updateConfig(localMenu);
    if (!resMenu.success) {
        // Se houver mensagem detalhada de erro, mostramos
        const msg = resMenu.msg || "Falha ao salvar menu.";
        toast({ title: "Aviso do Menu", description: msg, variant: "warning" });
        // Se status for 'alerta', ainda consideramos sucesso parcial
        if (msg.includes("Alguns itens")) successCount++;
        else hasError = true;
    } else successCount++;

    setIsSaving(false);

    if (!hasError) {
        toast({ title: "Configurações Salvas", description: "Portal atualizado.", className: "bg-green-600 text-white border-none" });
        onClose();
    }
  };

  // KEYS DEVEM SER IDENTICAS A Navigation.tsx
  const menuItems = [
    { key: 'inicio', label: 'Início (Home)', isPai: false },
    { key: 'institucional', label: 'MENU INSTITUCIONAL (PAI)', isPai: true },
    { key: 'sobre', label: '↳ Sobre a AMB', isPai: false },
    { key: 'historico', label: '↳ Histórico', isPai: false },
    { key: 'diretoria', label: '↳ Diretoria', isPai: false },
    { key: 'transparencia', label: '↳ Secretaria Digital', isPai: false },
    { key: 'bi', label: '↳ Inteligência (BI)', isPai: false },
    { key: 'noticias', label: 'Notícias', isPai: false },
    { key: 'parceiros', label: 'Parceiros', isPai: false },
    { key: 'eventos', label: 'Eventos', isPai: false },
    { key: 'contato', label: 'Contato', isPai: false },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900 text-xl font-black">
            <Settings className="h-6 w-6 text-blue-600" />
            Configurações do Portal
          </DialogTitle>
          <DialogDescription>Gerencie visibilidade e contatos.</DialogDescription>
        </DialogHeader>

        <div className="py-2 space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-widest">
                    <MessageCircle className="h-4 w-4 text-green-600" /> Canais Oficiais
                </div>
                <div className="space-y-3">
                    <div>
                        <Label className="text-xs font-bold text-slate-500">WhatsApp</Label>
                        <div className="relative mt-1">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input value={localWhatsapp} onChange={(e) => setLocalWhatsapp(e.target.value)} placeholder="5592..." className="pl-9" />
                        </div>
                    </div>
                    <div>
                        <Label className="text-xs font-bold text-slate-500">Email</Label>
                        <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /><Input value={localEmail} onChange={(e) => setLocalEmail(e.target.value)} placeholder="contato@..." className="pl-9" />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-xs uppercase tracking-widest px-1">
                    <Eye className="h-4 w-4 text-blue-600" /> Menus & Navegação
                </div>
                <div className="space-y-2">
                    {menuItems.map((item) => {
                        const isVisible = localMenu[item.key] !== false; 
                        return (
                            <div key={item.key} onClick={() => handleToggle(item.key)} className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border ${item.isPai ? 'bg-blue-50 border-blue-100 mt-4' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'}`}>
                                <div className="flex items-center gap-3">
                                    {isVisible ? <Eye className={`h-4 w-4 ${item.isPai ? 'text-blue-600' : 'text-green-600'}`} /> : <EyeOff className="h-4 w-4 text-slate-300" />}
                                    <span className={`select-none ${item.isPai ? 'font-black uppercase text-xs tracking-wide text-blue-900' : 'font-medium text-sm text-slate-600'}`}>{item.label}</span>
                                </div>
                                <Switch checked={isVisible} className="data-[state=checked]:bg-green-600" />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 hover:bg-black text-white font-bold">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <Save className="h-4 w-4 mr-2"/>} Salvar Tudo
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
// linha 144 FerramentasModal.tsx