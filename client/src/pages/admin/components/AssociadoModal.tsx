// Nome: AssociadoModal.tsx
// Caminho: client/src/pages/admin/components/AssociadoModal.tsx
// Função: Modal Híbrido (Ver/Editar)
// Versão: v1.0 Module

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Save, PenSquare, User, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AssociadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
  setData: (data: any) => void;
  isEditing: boolean;
  toggleEdit: () => void;
  onSave: () => void;
  isProcessing: boolean;
  isSuperUser: boolean;
}

export function AssociadoModal({ isOpen, onClose, data, setData, isEditing, toggleEdit, onSave, isProcessing, isSuperUser }: AssociadoModalProps) {
  if (!data) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-0 gap-0">
        <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
          <div>
            <DialogTitle className="text-xl font-bold text-slate-800">
              {isEditing ? 'Editando Registro' : 'Ficha do Associado'}
            </DialogTitle>
            <DialogDescription>ID: {data.id}</DialogDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="ghost" onClick={toggleEdit}>Cancelar</Button>
                <Button onClick={onSave} disabled={isProcessing} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />} Salvar
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={toggleEdit}>
                <PenSquare className="mr-2 h-4 w-4" /> Editar
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* PESSOAL */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-400 text-xs uppercase border-b pb-2 mb-4 flex items-center gap-2">
                <User size={14} /> Dados Pessoais
              </h4>
              <div className="space-y-3">
                <div><Label>Nome Completo</Label><Input value={data.nome_completo || ''} disabled={!isEditing} onChange={e => setData({...data, nome_completo: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label>CPF</Label><Input value={data.cpf || ''} disabled={!isEditing} onChange={e => setData({...data, cpf: e.target.value})} /></div>
                  <div><Label>RG</Label><Input value={data.rg || ''} disabled={!isEditing} onChange={e => setData({...data, rg: e.target.value})} /></div>
                </div>
                <div><Label>Nascimento</Label><Input type="date" value={data.data_nascimento || ''} disabled={!isEditing} onChange={e => setData({...data, data_nascimento: e.target.value})} /></div>
                <div><Label>Filiação</Label><Input value={data.filiacao || ''} disabled={!isEditing} onChange={e => setData({...data, filiacao: e.target.value})} /></div>
                <div className="grid grid-cols-2 gap-2">
                    <div><Label>Nacionalidade</Label><Input value={data.nacionalidade || ''} disabled={!isEditing} onChange={e => setData({...data, nacionalidade: e.target.value})} /></div>
                    <div><Label>Naturalidade</Label><Input value={data.naturalidade || ''} disabled={!isEditing} onChange={e => setData({...data, naturalidade: e.target.value})} /></div>
                </div>
              </div>
            </div>

            {/* SISTEMA */}
            <div className="space-y-4">
              <h4 className="font-bold text-slate-400 text-xs uppercase border-b pb-2 mb-4 flex items-center gap-2">
                <ShieldCheck size={14} /> Sistema & Contato
              </h4>
              <div className="space-y-3">
                <div><Label>Email</Label><Input value={data.email || ''} disabled={!isEditing} onChange={e => setData({...data, email: e.target.value})} /></div>
                <div><Label>WhatsApp</Label><Input value={data.telefone_whatsapp || ''} disabled={!isEditing} onChange={e => setData({...data, telefone_whatsapp: e.target.value})} /></div>
                <div><Label>Endereço</Label><Input value={data.endereco || ''} disabled={!isEditing} onChange={e => setData({...data, endereco: e.target.value})} /></div>

                <div className="bg-slate-50 p-4 rounded border mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <Label>Cadastro</Label>
                    <Select disabled={!isEditing} value={data.status_cadastro?.toLowerCase() || 'pendente'} onValueChange={v => setData({...data, status_cadastro: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">pendente</SelectItem>
                        <SelectItem value="aprovado">aprovado</SelectItem>
                        <SelectItem value="rejeitado">rejeitado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Financeiro</Label>
                    <Select disabled={!isEditing} value={data.status_financeiro?.toLowerCase() || 'pendente'} onValueChange={v => setData({...data, status_financeiro: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">pendente</SelectItem>
                        <SelectItem value="adimplente">adimplente</SelectItem>
                        <SelectItem value="bloqueado">bloqueado</SelectItem>
                        <SelectItem value="isento">isento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 mt-2">
                    <Label>Cargo</Label>
                    <Select disabled={!isEditing || !isSuperUser} value={data.role?.toLowerCase() || 'atleta'} onValueChange={v => setData({...data, role: v})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="atleta">atleta</SelectItem>
                        <SelectItem value="admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
// linha 90 AssociadoModal.tsx