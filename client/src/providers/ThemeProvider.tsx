/*
 * ==========================================================
 * ARQUIVO: ThemeProvider.tsx
 * DATA: 12 de Janeiro de 2026
 * HORA: 14:45
 * FUNÇÃO: Injeção dinâmica de cores e LOGO via variáveis CSS.
 * VERSÃO: 1.8 (Suporte a Logo Dinâmica)
 * ==========================================================
 */
import React, { createContext, useEffect } from 'react';
import axios from 'axios';

export const ThemeContext = createContext({});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  const getContrastColor = (hex: string) => {
    if (!hex) return '#ffffff';
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    // Cálculo de brilho YIQ para precisão de acessibilidade
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 150) ? '#0f172a' : '#ffffff'; 
  };

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await axios.get('https://www.ambamazonas.com.br/api/get_tema_ativo.php');
        if (res.data.status === 'sucesso') {
          const c = res.data.cores;
          const root = document.documentElement;

          // Aplicação das Cores
          root.style.setProperty('--primary-bg', c.cor_primaria);
          root.style.setProperty('--secondary-bg', c.cor_secundaria);
          root.style.setProperty('--accent-bg', c.cor_accent);

          root.style.setProperty('--primary-txt', getContrastColor(c.cor_primaria));
          root.style.setProperty('--secondary-txt', getContrastColor(c.cor_secundaria));
          root.style.setProperty('--accent-txt', getContrastColor(c.cor_accent));

          // --- ATUALIZAÇÃO: LOGO DINÂMICA ---
          // Injeta a URL da logo na variável CSS para o Navigation consumir
          if (c.url_logo) {
            root.style.setProperty('--url-logo', `url("${c.url_logo}")`);
          } else {
            root.style.setProperty('--url-logo', 'none');
          }
        }
      } catch (error) {
        console.error("Erro ao carregar tema dinâmico:", error);
      }
    };

    loadTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{}}>
      {children}
    </ThemeContext.Provider>
  );
};