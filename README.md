
# 🌳 Huffman Game - Frontend

> Uma aplicação web interativa e gamificada para ensinar o **Algoritmo de Codificação de Huffman**.

## 📖 Sobre o Projeto

Este projeto é o **Frontend** de um sistema educacional desenvolvido para auxiliar estudantes de Ciência da Computação a entenderem estruturas de dados e algoritmos de compressão. 

Através de uma interface "Drag & Drop" (Arrastar e Soltar), o usuário deve construir a Árvore de Huffman perfeita, conectando nós baseados em suas frequências. O sistema valida matematicamente a eficiência da árvore em tempo real.

## 🚀 Funcionalidades

- **🎮 Modo Campanha:** Níveis progressivos de dificuldade (Fácil, Normal, Difícil).
- **🎨 Modo Livre:** Desbloqueado após zerar a campanha, permite inserir qualquer texto para jogar.
- **✨ Interface Interativa:** Uso da biblioteca `React Flow` para manipulação visual de nós e arestas.
- **🧠 Validação Inteligente:** Comunicação com Backend Java para verificar se a árvore é ótima.
- **🏆 Sistema de Pontuação:** Contador de acertos e erros em tempo real.
- **🛠 Ferramentas de UX:** Dark Mode, Desfazer/Refazer (Undo/Redo) e Histórico de ações.
- **🎓 Tutorial Integrado:** Modal interativo ensinando as regras do algoritmo.

## 🛠 Tech Stack

O projeto foi construído utilizando as tecnologias mais modernas do ecossistema React:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Visualização de Grafos:** [@xyflow/react](https://reactflow.dev/) (React Flow)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI:** [Shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Http Client:** [Axios](https://axios-http.com/)
- **Feedback Visual:** `sonner` (Toasts) e `canvas-confetti`.

## 📂 Estrutura do Projeto

O código foi arquitetado visando escalabilidade e separação de responsabilidades:

```bash
src/
├── app/                 # Next.js App Router
├── components/
│   ├── game/            # Componentes específicos do jogo
│   │   ├── GameControls.js   # Painel esquerdo
│   │   ├── GameInfo.js       # Painel direito (Regras/Score)
│   │   ├── Modals/           # Tutoriais e diálogos
│   │   └── ...
│   ├── ui/              # Componentes genéricos (Botões, Cards)
│   └── HuffmanBoard.js  # Componente "Gerente" da View
├── data/
│   └── gameLevels.js    # Configuração das fases
├── hooks/
│   └── useHuffmanGame.js # Custom Hook (Toda a lógica/cérebro do jogo)
└── ...

```

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* [Node.js](https://nodejs.org/) (Versão 18 ou superior)
* **Backend Java:** Este frontend depende de uma API rodando em `http://localhost:8080`. Certifique-se de que o servidor Spring Boot esteja ativo.
* **Link do Backend:** https://github.com/jaugustosf/HuffmanGameAPI

## 📦 Como Rodar

1. **Clone o repositório:**
```bash
git clone [https://github.com/jaugustosf/huffman-game-frontend.git](https://github.com/jaugustosf/huffman-game-frontend.git)
cd huffman-game-frontend
```
2. **Instale as dependências:**
```bash
npm install
# ou
yarn install
```


3. **Rode o servidor de desenvolvimento:**
```bash
npm run dev
```


4. **Acesse:**
Abra [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) no seu navegador.

## 🎮 Como Jogar

1. **Regra de Ouro:** Observe os nós (caixinhas) na mesa. Identifique os dois que possuem os **menores números** de frequência.
2. **Conectar:** Arraste um nó sobre o outro para uni-los. Isso criará um novo nó "Pai" com a soma das frequências.
3. **Repetir:** Continue unindo os menores valores disponíveis até sobrar apenas um nó (a Raiz da árvore).
4. **Validar:** Clique em "Validar Árvore". Se estiver matematicamente perfeita, você avança de nível!
