# Diario de Bordo de Exploradores

PWA mobile-first feito com React, Vite, TypeScript, Tailwind CSS, Dexie, Supabase e `vite-plugin-pwa`.

## Funcionalidades

- Registro de descobertas com titulo, descricao, categoria e raridade.
- Captura de ate 3 fotos por descoberta.
- Busca por titulo, descricao e categoria.
- Favoritos, tela de detalhe, exclusao com confirmacao e dashboard.
- Funcionamento offline com IndexedDB.
- Sincronizacao online com Supabase quando houver internet.
- Sincronizacao entre dispositivos ao abrir o app online.
- Upload das fotos para o Supabase Storage.

## Configurar Supabase

1. Crie um projeto no Supabase.
2. Abra o SQL Editor e execute o arquivo `supabase-schema.sql`.
3. Copie `.env.example` para `.env`.
4. Preencha as variaveis do `.env`:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

Com as chaves configuradas, o app salva primeiro offline no IndexedDB. Quando estiver online, registros criados, editados, favoritados ou excluidos sao sincronizados com a tabela `discoveries` do Supabase. Ao abrir o app em outro dispositivo, ele baixa os registros do Supabase e mescla no IndexedDB local. As fotos sao enviadas para o bucket `discovery-photos`, e a tabela guarda as URLs publicas em `photos`.

## Comandos

```bash
npm install
npm run dev
npm run build
```
