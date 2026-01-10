import React, { useState, useEffect } from "react";
import axios from "axios";
import { ShieldCheck, User, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UPLOADS_URL = "https://www.ambamazonas.com.br/uploads/diretoria/";

export default function PaginaDiretoriaPublica() {
  const [diretoria, setDiretoria] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://www.ambamazonas.com.br/api/get_diretoria.php")
      .then(res => setDiretoria(res.data.dados || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" /></div>;

  return (
    <div className="min-h-screen bg-white pb-20">
      <section className="bg-slate-900 py-20 text-center text-white">
        <ShieldCheck size={48} className="text-orange-600 mx-auto mb-4" />
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Diretoria <span className="text-orange-600">Executiva</span></h1>
        <p className="text-slate-400 mt-4 max-w-xl mx-auto font-medium">Liderança dedicada ao basquetebol master do Amazonas.</p>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {diretoria.map((m) => (
            <div key={m.id} className="flex flex-col items-center group">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-orange-600 rounded-2xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                <Avatar className="w-44 h-52 rounded-2xl border-2 border-white relative z-10 shadow-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500">
                  <AvatarImage src={m.url_foto ? `${UPLOADS_URL}${m.url_foto}` : ""} className="object-cover" />
                  <AvatarFallback><User size={40} /></AvatarFallback>
                </Avatar>
              </div>
              <h3 className="text-xl font-black italic uppercase text-slate-900">{m.nome}</h3>
              <p className="text-orange-600 font-bold uppercase text-xs tracking-widest">{m.cargo}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase">Gestão {m.inicio_gestao?.split('-')[0]} - {m.fim_gestao?.split('-')[0]}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}