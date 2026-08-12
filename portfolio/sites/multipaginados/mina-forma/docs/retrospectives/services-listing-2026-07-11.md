# Retrospectiva: Services Listing

Data: 2026-07-11
Projeto: Mina Forma
Rota: Services listing
Resultado aprovado: `assets/mockups/routes/services-listing/02-approved/services-listing__desktop__approved.png`
Alias de compatibilidade: `assets/mockups/mina-forma-services-listing-mockup-final.png`
Checksum: `bcad265a8f8a03add9835fb32efda06228d7af7ec969d7a9652df5ac1ca45316`

## Resumo executivo

A página final ficou forte, coerente com a Home v2 e implementável no Elementor.
O custo para chegar nela, porém, foi alto demais: 24 versões numeradas, dois
rascunhos paralelos, uma referência intermediária e seis estudos por seção.

O problema não foi simplesmente baixa qualidade do imagegen. O fluxo misturou
camadas que deveriam ter owners e gates diferentes:

- estratégia da rota;
- estrutura de página;
- linguagem visual compartilhada;
- geometria e orçamento vertical;
- fotografia e materialidade;
- copy e widgets Elementor;
- feedback, diagnóstico e geração;
- aprovação, promoção e arquivamento.

Quando uma dessas camadas falhava, a próxima versão frequentemente reabria as
outras. Isso criou uma sequência reativa: cada imagem resolvia o pedido literal
mais recente, mas não necessariamente a causa do desconforto.

O aprendizado central é:

> O mockup não precisa de menos criatividade. Ele precisa de estados claros,
> invariantes explícitos e liberdade delimitada por camada.

Com o fluxo proposto nesta retrospectiva, a página provavelmente teria exigido
quatro candidatos externos, não 24:

1. correção da arquitetura da rota;
2. composição material/humana;
3. aplicação da referência visual exata;
4. correção geométrica e freeze.

## Evidências usadas

- chat original `019f06a4-fae0-7713-bbe2-d6cf730ee796`;
- conversa de revisão que produziu v14-v24;
- 26 PNGs numerados ou paralelos da rota Services;
- seis frames do experimento `services-taste-skill-test`;
- Home v2 e o crop exato do CTA acima do footer;
- `docs/studio-os/workflows/02-visual-reality-loop.md`;
- skills `image-first-web-design`, `visual-image-prompting`,
  `ux-ui-design-director` e `guilherme-collaborative-agent`;
- dimensões e checksums dos arquivos locais.

## O que a página precisava fazer

A Services listing precisava:

- parecer uma rota interna de oferta, não uma segunda Home;
- compartilhar o DNA da Home v2 sem copiar sua fórmula de hero;
- colocar os três serviços no primeiro plano;
- preservar o quadro externo e os rails laterais;
- usar borda como estrutura e sombra como exceção;
- alternar momentos editoriais densos e momentos de respiro;
- manter texto, ações, header e footer editáveis;
- mapear com clareza para Containers, Heading, Text Editor, Image e Button no
  Elementor;
- usar fotografia como evidência material, não decoração genérica;
- manter o bloco de serviços dentro de um orçamento vertical fixo.

Essas necessidades só ficaram simultaneamente explícitas perto do final.

## Linha do tempo das versões

### Fase 0 — baseline legado

| Versão | Mudança | Valor produzido | Falha principal |
| --- | --- | --- | --- |
| v1 | Mock original de Services | Conteúdo e universo visual iniciais | Estrutura genérica e pouco alinhada à Home v2 aprovada depois |

### Fase 1 — Services como variação da Home

| Versão | Mudança | Valor produzido | Falha principal |
| --- | --- | --- | --- |
| v2 | Home v2 como referência direta | Header/footer e linguagem aproximados | Repetiu a fórmula `headline à esquerda + foto à direita + cards`; parecia uma segunda Home |
| v3 | Intro compacta e serviços no primeiro viewport | Primeira correção estratégica real | Ainda dependia de cards e de um sistema visual herdado antes de a rota ter contrato próprio |

Aprendizado: compartilhar linguagem visual não significa compartilhar a mesma
arquitetura de hero.

### Fase 2 — experimento por seção

O teste com o método upstream gerou seis imagens independentes:

- intro;
- serviços;
- material logic;
- processo;
- entregáveis;
- CTA.

O teste foi útil como pesquisa, mas não tinha um contrato de síntese. As seções
foram geradas como boas peças individuais, sem uma regra forte para voltar a ser
uma página única. O experimento deveria ter sido registrado como `exploration`,
não como um caminho implícito para a próxima versão.

### Fase 3 — oscilação de bordas e sombras

| Versão | Mudança | Valor produzido | Falha principal |
| --- | --- | --- | --- |
| v4 | Retorno ao full-page com mais estrutura | Reuniu os estudos | Borda insuficiente fora das áreas principais |
| v5 | Menos bordas técnicas | Mais respiro | Seções ainda pareciam soltas |
| v6 | Frames adicionais | Tornou os blocos legíveis | Virou wireframe técnico; cantos ciano demais |
| v7 | Gramática da Home v2 | Recuperou materialidade editorial | Copiou frame + sombra em grupos demais |
| v8 draft | Copy e implementação | Melhor legibilidade | Suavizou a força da referência |
| v8 | Recuperou frames e processo | Direção gráfica mais clara | Consolidou sombra como solução global |
| v9 shadow study | Estudo determinístico de sombra | Separou styling de rerender | Passou do ponto e virou tarja preta |
| v9 | Sombra balanceada | Melhor controle local | Ainda não havia contrato de ownership da sombra |
| v10 | Frame no footer | Fechou o rodapé | Corrigiu o lugar errado; o problema era rail lateral contínuo |
| v11 | Rails laterais | Descoberta estrutural importante | Sombras antigas passaram a competir com o quadro-mãe |
| v12 | Removeu sombra do topo | Hierarquia mais coerente | Restavam sombras espalhadas nos blocos internos |
| v13 | Sombras mais orgânicas | Melhor acabamento local | Continuou tratando flood de sombra como problema de estilo |

Essa fase contém o maior desperdício. O feedback “sombra” foi interpretado como
pedido de refinamento de sombra, quando o sintoma real era excesso de objetos
destacados. A regra correta apareceu tarde:

```text
borda = estrutura obrigatória
sombra = exceção hierárquica
```

O stop condition deveria ter disparado após a segunda correção no mesmo sistema
visual, antes de v7-v13.

### Fase 4 — reset de arquitetura da rota

| Versão | Mudança | Valor produzido | Falha principal |
| --- | --- | --- | --- |
| v14 | Services como índice editorial horizontal | Segundo salto estratégico real; eliminou o hero de Home | Ficou seco: muito papel, regra e repetição |
| v15 | Material spine, processo humano, deliverables assimétricos | Trouxe calor e evidência | Introduziu gramáticas demais na mesma página |
| v16 | Tentativa de contrato de first fold | Expôs a limitação geométrica do imagegen | O modelo não respeitou o orçamento vertical |
| v17 | Correção do rail direito em deliverables | Resolveu hierarquia lateral | Ainda carregava acúmulo visual da v15 |
| v18 | Recomposição a partir da v14 | Terceiro salto real; estrutura limpa e página coerente | Bloco de serviços ainda podia ganhar evidência visual |

O movimento certo foi voltar à v14 e carregar apenas três decisões aprovadas:

- fotografia humana;
- deliverables corrigidos;
- CTA escuro.

Esse padrão deve virar regra: quando uma versão acumula soluções locais demais,
recompor a partir do último milestone estrutural, não continuar polindo o
acúmulo.

### Fase 5 — imagem nos serviços e correção de referência

| Versão | Mudança | Valor produzido | Falha principal |
| --- | --- | --- | --- |
| v19 | Board fotográfico em `How services connect` | Testou overlay e números | Editou a seção errada |
| v20 | Imagem atrás dos números | Aplicou o feedback na região certa | Virou uma faixa vertical fechada e azul |
| v21 | Três slabs inspirados na Home v2 | Tornou cada serviço um objeto editorial | Copiou a caixa, não a relação espacial da referência |
| v22 | Still lifes abertos e naturais | Quarto salto de direção; referência finalmente compreendida | Aumentou a altura das rows e empurrou a página |
| v23 | Compactação | Manteve a ideia e reduziu o dano | Ainda partiu da geometria já expandida |
| v24 | v18 como autoridade geométrica + v22 como autoridade visual | Resultado aprovado | Nenhuma falha impeditiva; vira nova autoridade |

O erro v19-v21 foi semântico: “igual ao bloco acima do footer” foi tratado como
estilo de caixa, quando a referência descrevia uma relação espacial:

- texto e imagem no mesmo campo de papel;
- imagem aberta, sem limite retangular aparente;
- objetos respirando no espaço negativo;
- número preservado em sua coluna original;
- fotografia sem overlay azul dominante.

O crop exato da referência resolveu em uma iteração o que três descrições
verbais não resolveram.

## Diagnóstico de causa-raiz

### 1. Não havia uma máquina de estados

Arquivos recebiam apenas `vN`. A numeração não dizia se o artefato era:

- exploração;
- candidato;
- correção cirúrgica;
- rejeitado;
- milestone estrutural;
- aprovado;
- canônico.

Sem estado, toda versão parecia igualmente válida e a próxima sempre parecia
uma continuação natural.

### 2. Não havia parentage explícito

Em vários momentos a melhor base não era a versão imediatamente anterior:

- v7 voltou à v5;
- v18 voltou conceitualmente à v14;
- v24 voltou geometricamente à v18 e visualmente à v22.

O filename linear escondeu esse grafo. Um manifest precisa registrar `parent`,
`visual_reference` e `geometry_reference` separadamente.

### 3. O feedback não selecionava a camada de correção

“Está seco”, “a sombra não bate”, “parece flutuando” e “igual à referência”
foram tratados como instruções de rendering. Antes da geração, o agente deveria
classificar a causa em uma camada:

- estratégia da rota;
- informação/hierarquia;
- geometria;
- sistema visual;
- fotografia/materialidade;
- copy;
- implementação Elementor;
- ambiente/browser.

Uma correção não pode reabrir camadas já congeladas sem declarar isso.

### 4. A referência verbal foi aceita como referência suficiente

Quando o feedback depende de uma relação visual específica, o agente deve
localizar ou solicitar o crop exato antes de gerar. O crop do CTA da Home v2
deveria ter entrado na primeira tentativa de imagem nos serviços.

### 5. A geometria entrou tarde

O primeiro contrato geométrico explícito apareceu na tentativa de first fold.
Depois, a altura das rows só virou autoridade na v24. Para regiões frágeis, a
geometria precisa ser registrada antes do styling:

- canvas;
- header;
- intro/hero;
- início e fim da seção;
- rows;
- início da próxima seção;
- imagem máxima;
- conteúdo que não pode empurrar o container.

### 6. Imagegen recebeu variáveis demais por vez

Alguns prompts tentaram preservar texto, refazer sombra, ajustar borda,
recompor seções e manter footer simultaneamente. Isso aumenta drift. Mudança de
estrutura, styling e conteúdo devem ser rodadas diferentes.

### 7. O gate interno aprovava intenção, não o bitmap

Comentários como “agora sim” apareceram antes de medir se o output realmente
preservava rails, primeira dobra e início da seção seguinte. O gate precisa
inspecionar a imagem salva e comparar contra autoridades específicas.

### 8. A organização em pasta plana eliminou contexto

Antes desta retrospectiva, a raiz de `assets/mockups/` tinha 37 PNGs, sendo 27
relacionados à Services. O nome carregava versão, mas não:

- run;
- hipótese;
- status;
- parent;
- motivo de rejeição;
- prompt;
- aprovação;
- checksum.

### 9. O agente acumulou papéis incompatíveis no mesmo instante

O mesmo agente atuava como:

- diretor;
- prompt engineer;
- gerador;
- revisor;
- defensor da própria saída;
- arquivista.

O problema não exige sempre subagentes, mas exige gates com papéis distintos.
O agente gerador não pode considerar a própria geração aprovada sem executar o
gate de direção e geometria.

## O que funcionou e deve ser preservado

- Diagnóstico explícito de que Services não deveria repetir o hero da Home.
- Header e footer tratados como contratos compartilhados/Theme Builder.
- Copy delicada bloqueada.
- Elementor build map antes da aprovação.
- Borda externa entendida como quadro-mãe.
- Sombra convertida de default para orçamento.
- Retorno a um milestone anterior quando o caminho acumulou ruído.
- Uso da Home v2 como linguagem, não como template literal.
- Imagens de processo e materiais como evidência real.
- Freeze por cópia byte-idêntica, checksum e registro documental.

## Fluxo contrafactual

Se o protocolo novo existisse, a sequência provável seria:

### Candidato A — arquitetura

- rejeitar v2 internamente por repetir a Home;
- definir Services como índice editorial;
- gerar uma direção equivalente à v14.

### Candidato B — materialidade

- receber “seco” como problema de ritmo/evidência;
- adicionar apenas uma imagem humana, deliverables assimétricos e CTA escuro;
- recompor diretamente para algo equivalente à v18.

### Candidato C — referência visual

- localizar o crop da Home v2 antes de gerar;
- manter número e texto;
- criar still lifes abertos, equivalente à v22.

### Candidato D — geometria

- usar v18 como authority geométrica e C como authority visual;
- fixar rows sem empurrar Material Logic;
- chegar à v24 e congelar.

## Decisões para o fluxo novo

1. Versão numerada não é estado.
2. Todo run registra hipótese e authority.
3. O agente mostra no máximo um candidato externo por estado.
4. Variantes internas podem existir, mas ficam dentro do run e não viram uma
   fila de decisões para Guilherme.
5. A segunda correção na mesma região dispara `diagnosis reset`.
6. A terceira geração externa sem avanço estrutural é proibida.
7. Referência relacional exige imagem/crop, não apenas descrição verbal.
8. Geometria frágil recebe box map antes do imagegen.
9. Estrutura, styling e fotografia são passadas diferentes.
10. Full-page continua sendo a unidade padrão; section study é ferramenta de
    diagnóstico, não substituto automático.
11. Aprovado vira checksum, manifest e canônico imediatamente.
12. Assetização começa somente depois do freeze.

## Métricas de melhoria

Para os próximos mocks:

- máximo de 3 candidatos externos antes de reset obrigatório;
- no máximo 2 correções externas da mesma região sem nova direção;
- 100% dos runs com manifest;
- 100% dos aprovados com checksum e arquivo canônico;
- 100% das regiões frágeis com geometry contract;
- 0 arquivos de exploração soltos na raiz de `assets/mockups/`;
- 0 regenerações que alterem conteúdo aprovado fora do escopo declarado;
- 0 assetizações antes de aprovação explícita.

## Resultado final

A v24 não deve ser tratada apenas como “a melhor imagem”. Ela é a evidência que
fechou o raciocínio:

- rota interna sem hero de Home;
- serviços como índice;
- números fixos;
- still lifes abertos;
- cores naturais;
- borda estrutural;
- shadow budget mínimo;
- rows com altura controlada;
- continuação de página coerente;
- implementação Elementor plausível.

O objetivo do novo fluxo é preservar essa qualidade sem exigir que Guilherme
dirija o agente microcorreção por microcorreção.
