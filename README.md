# Symbols Starter Kit
Example dev setup (boilerplate) to use [DOMQL](https://github.com/domql/domql). You can also check out [Symbols developers documentation](https://symbols.app/developers) for advanced use.

### Setup

1. Clone the repo
```
git clone git@github.com:symbo-ls/starter-kit.git
```

2. Install scripts
```
npm install
```

3. Run the project
```
npm start
```

4. Deploy
```
npm run deploy
```

This will interactively ask you to choose a deploy target (Symbols, Cloudflare Pages, Vercel, Netlify, or GitHub Pages). Your choice is saved to `symbols.json` for subsequent deploys.

To initialize deployment config without deploying:
```
npx smbls deploy --init
```

5. Ask AI
```
npx smbls ask "how do I add a dark theme?"
```

Start an interactive chat with `npx smbls ask`. On first run it will guide you through AI provider setup and auto-configure [symbols-mcp](https://github.com/symbo-ls/symbols-mcp) for your editors.
