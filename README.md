# RMA Shqip Community

## Rreth Projektit

RMA Shqip është një platformë komuniteti për dashamirësit shqiptarë të Real Madrid. Ky projekt ofron një hapësirë për përdoruesit për të ndarë mendimet, të shohin ndeshjet, të marrin pjesë në ngjarje dhe të lidhen me anëtarët e tjerë të komunitetit.

## Teknologjitë e Përdorura

Ky projekt është ndërtuar me:

- **Vite** - Build tool i shpejtë
- **TypeScript** - Tipizim statik për JavaScript
- **React** - Library për ndërtimin e UI
- **shadcn/ui** - Komponentë të gatshëm dhe të bukur
- **Tailwind CSS** - Framework CSS utility-first
- **Supabase** - Backend-as-a-Service për autentifikim dhe bazë të dhënash
- **React Router** - Routing për aplikacionin
- **React Query** - Menaxhimi i gjendjes dhe cache

## Si të Instaloni dhe Ekzekutoni

### Kërkesat
- Node.js (version 18 ose më i ri)
- npm ose yarn

### Hapat e Instalimit

```bash
# Hapi 1: Klononi repository-n
git clone <YOUR_GIT_URL>

# Hapi 2: Navigoni në direktorinë e projektit
cd rma-shqip-community

# Hapi 3: Instaloni varësitë e nevojshme
npm install

# Hapi 4: Ekzekutoni serverin e zhvillimit
npm run dev
```

Aplikacioni do të hapet në `http://localhost:8080`

## Funksionalitetet

- **Autentifikim**: Regjistrim dhe hyrje përmes Supabase
- **Postime**: Krijimi dhe ndarja e postimeve
- **Profil**: Menaxhimi i profilit të përdoruesit
- **Anëtarët**: Lista e anëtarëve të komunitetit
- **Ngjarjet**: Menaxhimi i ngjarjeve të komunitetit
- **Ndeshjet**: Orari i ndeshjeve të Real Madrid
- **Trending**: Postimet më të njohura
- **Admin Panel**: Menaxhimi i komunitetit (për administratorët)

## Struktura e Projektit

```
src/
├── components/     # Komponentët e UI
├── pages/         # Faqet e aplikacionit
├── hooks/         # Custom React hooks
├── lib/           # Utilities dhe konfigurime
└── assets/        # Imazhe dhe resurse statike
```

## Si të Kontribuoni

1. Fork repository-n
2. Krijoni një branch të ri (`git checkout -b feature/amazing-feature`)
3. Commit ndryshimet tuaja (`git commit -m 'Add some amazing feature'`)
4. Push në branch (`git push origin feature/amazing-feature`)
5. Hapni një Pull Request

## Deploy

Për të deployuar projektin:

```bash
# Build për produksion
npm run build

# Preview build-in
npm run preview
```

## Kontakti

Për pyetje ose sugjerime, ju lutemi të hapni një issue në repository.

---

**Hala Madrid y nada más!** ⚽🤍
