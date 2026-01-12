/*
 * ==========================================================
 * ARQUIVO: MapCarousel.tsx
 * DATA: 12 de Janeiro de 2026
 * HORA: 14:30
 * FUNÇÃO: Carrossel dinâmico de localizações (Sede + Ginásios).
 * VERSÃO: 1.0
 * ==========================================================
 */
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Location {
  titulo: string;
  endereco: string;
}

export function MapCarousel({ sede }: { sede: string }) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Inicializa com a sede vinda das configurações
    const list = [{ titulo: "Sede AMB", endereco: sede }];

    // Aqui no futuro você pode dar um fetch nos endereços dos ginásios dos jogos ativos
    // list.push({ titulo: "Arena Amadeu Teixeira", endereco: "R. Lóris Cordovil, Manaus - AM" });

    setLocations(list);
  }, [sede]);

  const next = () => setCurrentIndex((prev) => (prev + 1) % locations.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + locations.length) % locations.length);

  if (!locations.length || !sede) return <div className="h-full bg-slate-200 animate-pulse rounded-2xl" />;

  const currentMapUrl = `https://www.google.com/maps/embed/v1/place?key=SUA_API_KEY_AQUI&q=${encodeURIComponent(locations[currentIndex].endereco)}`;

  return (
    <div className="relative h-full w-full group">
      <iframe
        title={locations[currentIndex].titulo}
        src={currentMapUrl}
        className="w-full h-full border-0"
        allowFullScreen
        loading="lazy"
      />

      {/* Overlay de Informação */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" style={{ color: 'var(--primary-bg)' }} />
              {locations[currentIndex].titulo}
            </h4>
            <p className="text-xs text-slate-500 mt-1">{locations[currentIndex].endereco}</p>
          </div>

          {locations.length > 1 && (
            <div className="flex gap-2">
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={prev}><ChevronLeft className="h-4 w-4" /></Button>
              <Button size="icon" variant="outline" className="h-8 w-8 rounded-full" onClick={next}><ChevronRight className="h-4 w-4" /></Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}