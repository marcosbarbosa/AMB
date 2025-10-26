# Design Guidelines: AMB Portal

## Design Approach

**Selected Approach:** Reference-Based Design drawing inspiration from modern institutional platforms like Stripe, Linear, and Vercel - balancing professional credibility with contemporary visual sophistication.

**Core Principles:**
- Clean, spacious layouts that convey professionalism and trust
- Strategic use of whitespace to create breathing room
- Typography-driven hierarchy with confident scale contrasts
- Purposeful imagery that reinforces brand credibility

---

## Typography System

**Font Families:**
- Primary: Inter (via Google Fonts) - headings, UI elements, body text
- Accent: Space Grotesk (via Google Fonts) - hero headlines, section titles

**Scale & Hierarchy:**
- Hero Headline: 4xl to 6xl (64-96px desktop), bold weight
- Section Titles: 3xl to 4xl (48-64px desktop), semibold weight
- Subsection Headers: xl to 2xl (24-32px), medium weight
- Body Text: base to lg (16-18px), regular weight
- Captions/Meta: sm (14px), regular weight

**Line Heights:**
- Headlines: tight (1.1 to 1.2)
- Body text: relaxed (1.6 to 1.75)
- UI elements: normal (1.5)

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 consistently
- Component internal spacing: p-4 to p-8
- Section vertical spacing: py-16 to py-24 (desktop), py-12 to py-16 (mobile)
- Content gaps: gap-6 to gap-12

**Container Strategy:**
- Full-width sections: w-full with max-w-7xl centered container
- Content sections: max-w-6xl for standard content
- Text-heavy areas: max-w-4xl for optimal readability

**Grid Patterns:**
- Features/Services: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Stats/Metrics: 4-column grid (grid-cols-2 lg:grid-cols-4)
- Contact section: 2-column layout (form + info)
- Always stack to single column on mobile

---

## Component Library

### Navigation
- Fixed header with blur backdrop effect (backdrop-blur-xl)
- Logo left-aligned, navigation items center/right
- Mobile: Hamburger menu with slide-in drawer
- Smooth scroll-to-section behavior
- Active state indicators for current page/section

### Hero Section (Home Page)
- Full viewport height (min-h-screen) with large background image
- Centered content with headline + subheadline + dual CTAs
- Primary CTA: Solid button with blur background
- Secondary CTA: Ghost button style with blur background
- Trust indicator below CTAs: "Trusted by X+ organizations" with small logos

### Feature Cards
- Card-based layout with subtle border or shadow
- Icon at top (from Heroicons - solid variant)
- Bold title (text-xl semibold)
- Description text (2-3 lines)
- Hover: Subtle lift effect (translate-y-1)

### Service/Product Showcase
- Alternating image-text layout (left-right pattern)
- Large image areas (50% width on desktop)
- Accompanying text with title, description, bullet points
- Clear visual hierarchy separating each service

### Statistics Section
- 4-column grid with large numbers
- Number: Extra large (text-5xl bold)
- Label: Small text below (text-sm)
- Centered alignment for each stat

### Contact Form
- Two-column layout: Form on left, contact info/map placeholder on right
- Form fields: Name, Email, Phone, Message (textarea)
- Full-width input fields with proper spacing (mb-4)
- Large submit button spanning full form width
- Contact info includes: Address, Phone, Email, Business Hours

### Footer
- Multi-column layout (4 columns on desktop)
- Column 1: Logo + brief description
- Column 2-3: Quick links (About, Services, Contact)
- Column 4: Newsletter signup + social media icons
- Bottom bar: Copyright + legal links
- Social icons from Heroicons

---

## Page Structure: Home Page

1. **Hero Section** - Full viewport with large hero image
2. **About Preview** - Brief company introduction (2 columns: text + supporting image)
3. **Services Grid** - 3-column feature cards showcasing main services
4. **Statistics Section** - 4-column stats highlighting achievements
5. **Call-to-Action Banner** - Full-width section with centered CTA
6. **Testimonials** - 3-column grid with client quotes
7. **Contact Preview** - Invitation to contact with button linking to contact page

---

## Page Structure: Contact Page

1. **Page Header** - Title + subtitle explaining contact options
2. **Contact Form + Info** - Two-column split layout
3. **Location Map Placeholder** - Full-width section with map placeholder

---

## Images

**Hero Image (Home):**
- Professional office environment or team collaboration scene
- High-quality, bright, modern aesthetic
- Subtle overlay to ensure text readability
- Positioned: background covering full hero section

**About Section Image:**
- Corporate office space or team meeting
- Professional but approachable
- Aspect ratio: 4:3 or 16:9

**Service Showcase Images:**
- Each service gets dedicated imagery
- Mix of: technology interfaces, professional settings, results-oriented visuals
- Consistently styled (same aspect ratio: 16:9)

**Testimonial Avatars:**
- Placeholder circular avatars for client testimonials
- Implement using placeholder service or simple colored circles with initials

---

## Icons

**Library:** Heroicons (via CDN) - use outline variant for most UI, solid for emphasis

**Usage:**
- Feature cards: 32px icons in outline style
- Navigation: 24px icons
- Social media footer: 20px icons
- Form inputs: 16px leading icons

---

## Interactions & Microanimations

**Minimal Animation Strategy:**
- Smooth scroll navigation between sections
- Card hover: Subtle lift (transform: translateY(-4px))
- Button hover: Scale-up to 1.02
- Page transitions: Simple fade-in on load
- Form validation: Shake animation on error

**No Complex Animations:**
- Avoid scroll-triggered animations
- No parallax effects
- No elaborate entrance animations

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked layout)
- Tablet: 768px - 1024px (2 columns where appropriate)
- Desktop: > 1024px (full multi-column layouts)

**Key Adaptations:**
- Hero text scales down significantly on mobile (text-3xl vs text-6xl)
- Navigation collapses to hamburger menu on mobile
- Multi-column grids stack to single column
- Section padding reduces by ~50% on mobile
- Form layout stacks vertically on mobile

---

This design creates a polished, professional institutional website that balances visual impact with content clarity, ensuring AMB Portal presents as credible, modern, and trustworthy.