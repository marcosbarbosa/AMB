# AMB Portal - Site Institucional

## Visão Geral
O AMB Portal é um site institucional moderno e profissional construído com React, oferecendo soluções institucionais de alta qualidade para organizações. O site apresenta informações sobre serviços, cases de sucesso, e permite contato direto através de formulário.

## Última Atualização
- **Data**: 26 de outubro de 2025
- **Alterações Recentes**:
  - Configuração inicial do projeto com React + Vite
  - Implementação completa do design system baseado em Inter e Space Grotesk
  - Criação de todos os componentes do site (Navigation, Hero, About, Services, Stats, CTABanner, Testimonials, ContactPreview, Footer)
  - Implementação das páginas Home e Contact
  - Configuração de schema para mensagens de contato
  - Instalação de axios e react-router-dom

## Arquitetura do Projeto

### Frontend
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **Roteamento**: Wouter
- **Estilização**: Tailwind CSS + Shadcn UI
- **Tipografia**: Inter (primary), Space Grotesk (accent)
- **Gerenciamento de Estado**: TanStack Query
- **Validação de Formulários**: React Hook Form + Zod

### Backend
- **Framework**: Express.js
- **Storage**: In-memory (MemStorage) - pronto para migração para PostgreSQL
- **Validação**: Zod schemas

### Estrutura de Páginas
1. **Home (`/`)**: Página principal com hero section, sobre, serviços, estatísticas, depoimentos e CTA
2. **Contato (`/contato`)**: Página dedicada com formulário de contato e informações

### Componentes Principais
- **Navigation**: Header fixo com blur effect e menu mobile responsivo
- **Hero**: Full viewport hero section com imagem de fundo e CTAs
- **About**: Seção sobre a empresa com missão, visão e valores
- **Services**: Grid de 6 serviços em cards
- **Stats**: 4 estatísticas destacadas
- **CTABanner**: Call-to-action para conversão
- **Testimonials**: 3 depoimentos de clientes
- **ContactPreview**: Preview de contato na home
- **ContactForm**: Formulário completo de contato
- **Footer**: Footer com links, newsletter e redes sociais

## Design System

### Cores
- Primary: Blue (HSL: 221 83% 53%) - usado para CTAs e destaques
- Background: White em light mode, dark em dark mode
- Card: Subtle elevation do background
- Text hierarchy: foreground, muted-foreground para hierarquia

### Tipografia
- Headlines: Space Grotesk (4xl-6xl, bold)
- Section titles: Space Grotesk (3xl-4xl, semibold)
- Body: Inter (base-lg, regular)
- Line-height: tight para headlines, relaxed para body

### Espaçamento
- Sections: py-20 lg:py-24
- Component padding: p-4 to p-8
- Gaps: gap-6 to gap-12

### Responsividade
- Mobile: < 768px (single column)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (full multi-column)

## Schema de Dados

### ContactMessage
```typescript
{
  id: string (UUID)
  name: string (min 2 chars)
  email: string (valid email)
  phone: string (optional)
  message: string (min 10 chars)
  createdAt: timestamp
}
```

## API Endpoints (A implementar)
- `POST /api/contact` - Enviar mensagem de contato

## Assets
- Hero image: Professional office collaboration scene
- About image: Modern office space
- Service images: Consultation, technology, team success

## Ambiente de Desenvolvimento
- Host: 0.0.0.0
- Port: 5000 (configurado no ambiente Replit)
- Hot reload: Ativado via Vite

## Próximos Passos
1. Implementar backend para formulário de contato
2. Integrar frontend com backend
3. Testes end-to-end
4. Otimizações de performance
