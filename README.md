# Recife Quiz Rush

Reconstrução independente do site publicado. O jogo escolhe 10 perguntas entre 20, usa 15 segundos por pergunta e tem dois modos de ranking: local, pronto para funcionar sem configuração, e global com Firebase Firestore, ativado quando `firebase.js` recebe a configuração do seu app Web.

## VS Code

1. Descompacte e abra a pasta no VS Code.
2. No terminal, rode `python3 -m http.server 4173` (Windows: `python -m http.server 4173`).
3. Abra `http://localhost:4173`.

Use um servidor local; abrir o HTML por duplo clique pode bloquear `data/questions.json`.

## Ranking global com Firebase

1. Crie um projeto em [Firebase Console](https://console.firebase.google.com/).
2. Adicione um app Web e copie o objeto `firebaseConfig` mostrado pelo Firebase.
3. Cole os valores no arquivo `firebase.js`, substituindo `COLE_SUA_API_KEY`, `SEU_PROJETO` etc.
4. No Firebase Console, abra **Authentication > Sign-in method** e ative **Anonymous**.
5. Abra **Firestore Database**, crie o banco em modo de produção e publique o conteúdo de `firestore.rules` na aba **Rules**.
6. Rode o site novamente. O rodapé do ranking deve mudar para `Firebase global`.

A configuração Web do Firebase não é uma senha de servidor; ainda assim, as regras do Firestore são obrigatórias. O exemplo impede update/delete e valida nome e pontuação. Como a pontuação é calculada no navegador, um usuário técnico ainda pode falsificar uma pontuação; para um ranking competitivo, mova a validação para uma API/Cloud Function.

## Adicionar perguntas

Edite `data/questions.json`. Cada item precisa deste formato:

```json
{
  "id": "ponte-nova",
  "prompt": "Qual rio atravessa Recife?",
  "options": ["Capibaribe", "Amazonas", "Tietê", "Paraná"],
  "correctIndex": 0,
  "fact": "O Capibaribe é um dos rios que marcam a paisagem do Recife.",
  "category": "Geografia"
}
```

`correctIndex` começa em zero: `0` é a primeira alternativa, `1` a segunda, `2` a terceira e `3` a quarta. Mantenha `id` único, quatro opções e JSON válido. O jogo carrega o arquivo a cada abertura; não existe uma segunda cópia de perguntas no banco do Firebase.

Depois de salvar, teste localmente. Em seguida, faça commit e push:

```bash
git add data/questions.json
git commit -m "Adiciona novas perguntas"
git push
```

O GitHub Pages e a Vercel atualizarão o arquivo publicado conforme a integração configurada.

## GitHub

```bash
git init
git add .
git commit -m "Adiciona Recife Quiz Rush"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/recife-quiz-rush.git
git push -u origin main
```

Para GitHub Pages: Settings > Pages > Deploy from a branch > `main` > `/ (root)`.

## Vercel

Em [vercel.com/new](https://vercel.com/new), importe o repositório do GitHub. Não configure build command nem output directory. O `vercel.json` já está incluído. A integração da Vercel cria deployments de preview para mudanças e publica a branch de produção configurada.

## Arquivos principais

- `index.html`: estrutura da página.
- `styles.css`: visual responsivo.
- `app.js`: jogo, timer e fallback local.
- `firebase.js`: integração opcional com Firebase.
- `firestore.rules`: regras de segurança do ranking.
- `data/questions.json`: banco editorial de perguntas.
