#!/bin/bash

# Função para criar árvore de diretórios
print_tree() {
    local dir="$1"
    local prefix="$2"
    local is_last="$3"
    
    # Pular diretórios ignorados
    case "$dir" in
        */node_modules|*/node_modules/*|*/.git|*/.git/*|*/dist|*/dist/*|*/.vite|*/.vite/*|*/.cache|*/.cache/*)
            return
            ;;
    esac
    
    local basename=$(basename "$dir")
    
    if [ "$is_last" = "true" ]; then
        echo "${prefix}└── ${basename}"
        local new_prefix="${prefix}    "
    else
        echo "${prefix}├── ${basename}"
        local new_prefix="${prefix}│   "
    fi
    
    if [ -d "$dir" ]; then
        local items=($(ls -A "$dir" 2>/dev/null))
        local count=${#items[@]}
        local i=0
        
        for item in "${items[@]}"; do
            i=$((i+1))
            local is_last_item="false"
            [ $i -eq $count ] && is_last_item="true"
            print_tree "$dir/$item" "$new_prefix" "$is_last_item"
        done
    fi
}

cat > leiame-pastas.txt << 'EOF'
================================================================================
                    PORTAL AMB DO AMAZONAS
                    Estrutura de Pastas e Arquivos
================================================================================

Projeto: AMB Portal - Site Institucional
Organização: Amazonas Basquete Master (AMB)
Data de Geração: $(date '+%d/%m/%Y às %H:%M:%S')
Versão: 1.0

================================================================================

ESTRUTURA DO PROJETO:

EOF

# Adicionar estrutura usando find com formatação
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.vite/*' -not -path '*/.cache/*' -not -name '*.log' | \
    grep -v '^\./\.' | \
    sed 's|^\./||' | \
    awk '
    BEGIN { FS = "/" }
    {
        depth = NF - 1
        for (i = 0; i < depth; i++) printf "│   "
        if (depth > 0) printf "├── "
        print $NF
    }
    ' | head -500 >> leiame-pastas.txt

cat >> leiame-pastas.txt << 'EOF'

================================================================================
ESTATÍSTICAS DO PROJETO:
================================================================================

EOF

echo "Total de arquivos: $(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.vite/*' | wc -l)" >> leiame-pastas.txt
echo "Total de diretórios: $(find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.vite/*' | wc -l)" >> leiame-pastas.txt
echo "" >> leiame-pastas.txt

cat >> leiame-pastas.txt << 'EOF'
================================================================================
DESCRIÇÃO DAS PRINCIPAIS PASTAS:
================================================================================

📁 client/              → Frontend React + TypeScript
   ├── src/
   │   ├── components/  → Componentes reutilizáveis (Navigation, Footer, etc.)
   │   ├── pages/       → Páginas da aplicação
   │   │   ├── admin/   → Páginas administrativas (gestão)
   │   │   └── public/  → Páginas públicas
   │   ├── context/     → Context API (autenticação)
   │   ├── hooks/       → Custom hooks
   │   └── lib/         → Utilitários e configurações

📁 server/              → Backend Express.js
   ├── routes.ts        → Rotas da API
   └── vite.ts          → Configuração Vite

📁 attached_assets/     → Imagens e assets do projeto
   └── generated_images/→ Imagens geradas para o site

📁 shared/              → Código compartilhado (schemas, tipos)

================================================================================
FIM DO ARQUIVO
================================================================================
EOF

