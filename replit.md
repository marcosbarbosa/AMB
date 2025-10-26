# AMB Portal - Site Institucional

## Visão Geral
O AMB Portal é um site institucional moderno e profissional construído com React, oferecendo soluções institucionais de alta qualidade para organizações. O site apresenta informações sobre serviços, cases de sucesso, e permite contato direto através de formulário funcional.

## Status do Projeto
✅ **MVP COMPLETO E TESTADO** - Todos os componentes implementados, integração frontend-backend funcionando, testes end-to-end validados.

## Última Atualização
- **Data**: 26 de outubro de 2025
- **Status**: MVP completo com todos os testes passando
- **Alterações Recentes**:
  - ✅ Configuração completa do design system (Inter + Space Grotesk)
  - ✅ Implementação de todos os componentes visuais (Navigation, Hero, About, Services, Stats, CTABanner, Testimonials, ContactPreview, Footer)
  - ✅ Sistema de navegação com scroll suave para seções
  - ✅ Geração de 5 imagens profissionais para hero, about e services
  - ✅ Backend API implementado com validação Zod
  - ✅ Formulário de contato funcional com React Hook Form + validação
  - ✅ Estados de loading, sucesso e erro implementados
  - ✅ Correção de navegação footer (hash links funcionando)
  - ✅ Correção de acessibilidade (Button asChild pattern)
  - ✅ Testes end-to-end completos e aprovados

## Arquitetura do Projeto

### Frontend
- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite (configurado para Replit - 0.0.0.0:5000)
- **Roteamento**: Wouter
- **Estilização**: Tailwind CSS + Shadcn UI
- **Tipografia**: Inter (primary), Space Grotesk (accent)
- **Gerenciamento de Estado**: TanStack Query v5
- **Validação de Formulários**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js
- **Storage**: In-memory (MemStorage) - pronto para migração para PostgreSQL
- **Validação**: Zod schemas com mensagens em português
- **API Routes**: `/api/contact` (POST, GET, GET/:id)

### Estrutura de Páginas
1. **Home (`/`)**: Página principal completa
   - Hero section com imagem profissional
   - Seção "Sobre Nós" (id="sobre")
   - Seção "Serviços" (id="servicos") com 6 cards
   - Estatísticas destacadas (4 métricas)
   - Depoimentos de clientes (3 testemunhos)
   - CTA Banner "Solicitar Consulta"
   - Contact Preview
   - Footer completo

2. **Contato (`/contato`)**: Página dedicada
   - Formulário de contato funcional
   - Informações de contato (email, telefone, endereço)
   - Placeholder para mapa

### Componentes Principais
- **Navigation**: Header fixo com blur effect, menu mobile responsivo, smooth scroll
- **Hero**: Full viewport com imagem de fundo, título, descrição, 2 CTAs
- **About**: Missão, visão, valores com imagem
- **Services**: Grid responsivo com 6 serviços (cada um com ícone e imagem)
- **Stats**: 4 estatísticas com animação de contadores
- **CTABanner**: Call-to-action destacado com gradiente
- **Testimonials**: 3 depoimentos em cards
- **ContactPreview**: Preview na home com CTA
- **ContactForm**: Formulário completo com validação, loading states, toast notifications
- **Footer**: Links rápidos (Empresa, Suporte), redes sociais, copyright

## Design System

### Cores (configuradas em index.css)
- Primary: Blue (221 83% 53%) - CTAs e destaques principais
- Background: White (light mode), Dark (dark mode)
- Card: Elevação sutil do background
- Text: Hierarquia de 3 níveis (foreground, muted-foreground, tertiary)
- Borders: Sutis e consistentes

### Tipografia
- Headlines: Space Grotesk (4xl-6xl, bold, tracking tight)
- Section Titles: Space Grotesk (3xl-4xl, semibold)
- Body: Inter (base-lg, regular, leading relaxed)
- Subtext: Inter (sm-base, muted-foreground)

### Espaçamento
- Sections: py-20 lg:py-24 (consistente)
- Component padding: p-6 to p-8
- Gaps: gap-6 to gap-12 (hierárquico)
- Container: max-w-7xl mx-auto px-4

### Responsividade
- Mobile: < 768px (single column, menu hamburger)
- Tablet: 768px - 1024px (2 columns, otimizado)
- Desktop: > 1024px (full multi-column, experiência completa)

## Schema de Dados

### ContactMessage
```typescript
{
  id: string (UUID gerado automaticamente)
  name: string (mínimo 2 caracteres, obrigatório)
  email: string (validação de email, obrigatório)
  phone: string (opcional)
  subject: string (obrigatório)
  message: string (mínimo 10 caracteres, obrigatório)
  createdAt: Date (timestamp automático)
}
```

## API Endpoints

### POST /api/contact
Envia uma mensagem de contato
- **Body**: `{ name, email, phone?, subject, message }`
- **Validação**: Zod schema com mensagens em português
- **Response**: `{ id, ...contactData }`
- **Status**: 200 (sucesso), 400 (validação falhou)

### GET /api/contact
Lista todas as mensagens de contato
- **Response**: `ContactMessage[]`

### GET /api/contact/:id
Obtém uma mensagem específica por ID
- **Response**: `ContactMessage`
- **Status**: 404 se não encontrado

## Assets Gerados
1. **hero-office-collaboration.png**: Office collaboration scene (hero background)
2. **about-modern-office.png**: Modern office interior (about section)
3. **service-consultation.png**: Professional consultation scene
4. **service-technology.png**: Technology and innovation
5. **service-team-success.png**: Team collaboration success

## Navegação e Interatividade

### Scroll Suave
- Links de header para #sobre e #servicos fazem scroll suave
- Links de footer para seções usam âncoras HTML com preventDefault
- Não altera a URL (design choice para UX limpa)

### Acessibilidade
- Todos os botões CTA usam pattern `<Button asChild><Link>...</Link></Button>`
- Data-testid em todos os elementos interativos
- Semantic HTML
- Keyboard navigation suportada

### Estados do Formulário
- **Loading**: Botão mostra "Enviando..." com spinner
- **Sucesso**: Toast notification, formulário limpo
- **Erro**: Mensagens de validação em português
- **Validação**: Client-side com Zod + React Hook Form

## Ambiente de Desenvolvimento
- **Host**: 0.0.0.0 (configurado para Replit)
- **Port**: 5000 (frontend + backend no mesmo servidor)
- **Hot Reload**: Ativado via Vite HMR
- **Workflow**: "Start application" executa `npm run dev`

## Testes Realizados

### E2E Tests (Playwright) - ✅ 100% Aprovados
1. ✅ Navegação completa (header, footer, páginas)
2. ✅ Scroll suave para seções (header e footer)
3. ✅ Formulário de contato (validação, submissão, sucesso)
4. ✅ Todos os CTAs redirecionando corretamente
5. ✅ Estados de loading e notificações
6. ✅ Validação de campos obrigatórios
7. ✅ Validação de email inválido
8. ✅ Responsividade e layout

### Verificações de Qualidade
- ✅ Sem warnings de DOM nesting
- ✅ Sem erros no console
- ✅ Navegação sem rotas 404
- ✅ Design consistente com guidelines
- ✅ Performance adequada

## Próximos Passos (Melhorias Futuras)
1. Migrar de MemStorage para PostgreSQL (database pronto)
2. Implementar dark mode toggle
3. Adicionar animações de scroll (reveal on scroll)
4. Integrar mapa real na página de contato
5. Adicionar cases de sucesso reais
6. Implementar newsletter subscription
7. SEO optimization (meta tags, sitemap)
8. Analytics integration
9. Performance optimization (lazy loading, code splitting)
10. Accessibility audit completo (WCAG AA)

## Notas Técnicas
- ⚠️ Vite config não deve ser modificado (configuração Replit otimizada)
- ⚠️ Package.json não deve ser editado manualmente (usar packager_tool)
- ✅ Design guidelines em design_guidelines.md devem ser seguidos
- ✅ Todos os componentes seguem Shadcn UI patterns
- ✅ Hover e active states usam utility classes do index.css
