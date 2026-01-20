// Nome: AssociadosTable.tsx
// Caminho: client/src/pages/admin/components/AssociadosTable.tsx
// Função: Tabela Pura para Listagem
// Versão: v1.0 Module

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Shield, ShieldOff, PenSquare } from 'lucide-react';

interface AssociadosTableProps {
  data: any[];
  isSuperUser: boolean;
  onView: (assoc: any) => void;
  onEdit: (assoc: any) => void;
  onToggleRole: (assoc: any, e: any) => void;
}

export function AssociadosTable({ data, isSuperUser, onView, onEdit, onToggleRole }: AssociadosTableProps) {
  if (data.length === 0) {
    return <div className="p-8 text-center text-slate-500">Nenhum registro encontrado.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left font-bold text-slate-600 text-xs uppercase">Associado</th>
            <th className="px-6 py-3 text-left font-bold text-slate-600 text-xs uppercase">Documento</th>
            <th className="px-6 py-3 text-left font-bold text-slate-600 text-xs uppercase">Status Banco</th>
            <th className="px-6 py-3 text-left font-bold text-slate-600 text-xs uppercase">Acesso</th>
            <th className="px-6 py-3 text-center font-bold text-slate-600 text-xs uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {data.map((assoc) => {
            const isAdmin = assoc.role === 'admin';
            // Exibição exata do banco (lowercase)
            const statusCad = assoc.status_cadastro || 'pendente';
            const statusFin = assoc.status_financeiro || 'pendente';

            return (
              <tr key={assoc.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{assoc.nome_completo}</div>
                  <div className="text-xs text-slate-500">{assoc.email}</div>
                </td>
                <td className="px-6 py-4 text-slate-600 font-mono text-xs">
                  {assoc.cpf || '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1 items-start">
                    <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-600 lowercase">
                      cad: {statusCad}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] border-0 lowercase ${statusFin === 'adimplente' ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
                      fin: {statusFin}
                    </Badge>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-1 rounded lowercase ${isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                      {assoc.role || 'atleta'}
                    </span>
                    {isSuperUser && (
                      <button onClick={(e) => onToggleRole(assoc, e)} className="p-1 hover:bg-slate-200 rounded" title="Trocar Cargo">
                        {isAdmin ? <ShieldOff size={14} className="text-red-400" /> : <Shield size={14} className="text-slate-400" />}
                      </button>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 bg-blue-50" onClick={() => onView(assoc)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-600 bg-orange-50" onClick={() => onEdit(assoc)}>
                      <PenSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
// linha 85 AssociadosTable.tsx