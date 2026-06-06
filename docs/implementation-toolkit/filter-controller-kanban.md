# Filter Controller Kanban

Atualizado em: 2026-06-06

Fonte: `.agentic-ops/tasks/TASK-FC-*.json`

## Resumo

| Estado operacional | Quantidade |
| --- | ---: |
| Concluido | 51 |
| Pronto para QA visual do Guilherme | 10 |
| Em implementacao | 0 |
| Backlog real | 0 |
| Bloqueado | 0 |
| Total | 61 |

Os arquivos `TASK-FC-007` e `TASK-FC-008` nao existem. Eles foram removidos da
sequencia e nao entram na contagem.

## Backlog

Nenhuma task de implementacao esta aguardando inicio.

A taxonomia de tipos futuros existe em
`docs/implementation-toolkit/filter-controller-type-taxonomy.md`, mas seus
itens sao candidatos classificados, nao tasks aprovadas para implementacao.

## Em Implementacao

Nenhuma task esta atualmente em implementacao.

## Pronto Para QA Do Guilherme

Essas tasks ainda possuem `status: pending` no JSON, mas a implementacao
mecanica ja foi concluida, commitada e publicada. O estado operacional correto
e `ready_for_guilherme_visual_qa`.

| Task | Componente | Commit | Evidencia | Foco do QA |
| --- | --- | --- | --- | --- |
| `TASK-FC-053` | Rating | `b72af3a` | `TEST-FC-ROBUSTNESS-008` | Reconhecimento visual, icones/estrelas, estados selecionado e nao selecionado, espacamento, labels e clareza de threshold. |
| `TASK-FC-054` | Range | `b5acb82` | `TEST-FC-ROBUSTNESS-006` | Labels on/off, vertical sem centralizacao forcada, alinhamento, handles, inputs, ticks e containment em larguras reais. |
| `TASK-FC-055` | Search | `05456ca` | `TEST-FC-ROBUSTNESS-011` | Icone, clear, foco, digitacao/debounce, source percebido e containment sem afetar filtros vizinhos. |
| `TASK-FC-056` | Select | `80bc2ad` | `TEST-FC-ROBUSTNESS-012` | Campo fechado, seta, labels longas, largura estreita, picker nativo desktop/mobile e limites visuais do navegador. |
| `TASK-FC-057` | Checkbox | `3bb5502` | `TEST-FC-ROBUSTNESS-013` | Indicador, multiplos selecionados, foco por teclado, counts, labels longas, wrapping e mobile. |
| `TASK-FC-058` | Radio | `14fc555` | `TEST-FC-ROBUSTNESS-014` | Escolha unica clara, modo segmented, opcao All, setas do teclado, foco e wrapping mobile. |
| `TASK-FC-059` | Chips | `85a1bfa` | `TEST-FC-ROBUSTNESS-015` | Aparencia de token, multi-select evidente, foco do input oculto, labels longas, scroll row, grid e mobile. |
| `TASK-FC-060` | Toggle | `edee229` | `TEST-FC-ROBUSTNESS-016` | Clareza off/on, posicao da label, texto de estado, foco, reset, restauracao por URL e full-row mobile. |
| `TASK-FC-061` | Swatch | `2f3f939` | `TEST-FC-ROBUSTNESS-017` | Cor/imagem, fallback invalido, labels, contraste do selected ring, teclado e touch target mobile. |
| `TASK-FC-062` | Date | `74fcfb2` | `TEST-FC-ROBUSTNESS-018` | Picker nativo, labels From/To, intervalo invertido, clear, active chip, stacking mobile e diferencas entre navegadores. |

### Ordem Sugerida De Puxada

1. `TASK-FC-054` Range: maior densidade visual e historico de regressao.
2. `TASK-FC-053` Rating: valida a nova profundidade de iconografia e estados.
3. `TASK-FC-055` Search e `TASK-FC-056` Select: familia de campos.
4. `TASK-FC-057` ate `TASK-FC-061`: familia de opcoes.
5. `TASK-FC-062` Date: comportamento nativo varia por navegador.

Uma task sai desta coluna apenas depois do QA visual. Se houver defeito:

1. registrar o caso concreto;
2. separar bug mecanico de decisao visual;
3. abrir task de correcao focada;
4. nao reabrir toda a auditoria do componente.

## Concluido

### Presets E Widget

- `TASK-FC-001` a `TASK-FC-005`
- Inventario do contrato, seguranca, salvar preset pelo Elementor, biblioteca
  administrativa e reutilizacao no widget.

### Auditorias Iniciais Por Componente

- `TASK-FC-006`
- `TASK-FC-009` a `TASK-FC-017`
- Range, Checkbox, Radio, Chips, Toggle, Swatch, Search, Select, Date e Rating.

### Estabilizacao Inicial

- `TASK-FC-018` a `TASK-FC-026`
- Range slices, inputs, track, Style cadence, reatividade, Sort separado,
  fallback de compatibilidade e customizacao de handle.

### Auditoria De Robustez

- `TASK-FC-027` a `TASK-FC-044`
- Protocolo, ownership map, containment, dynamic tags, CPT fields, neutralidade,
  layout percentages, auditoria profunda de cada tipo e sintese.

### Fundacao E Modularizacao

- `TASK-FC-045` a `TASK-FC-052`
- Type registry, field-source contract, CPT dynamic tags, harness mecanico,
  line-budget guard, StyleControls modular, renderers modulares e CSS modular.

### Gate De Tipos Futuros

- `TASK-FC-063`
- Taxonomia para decidir se uma ideia e tipo real, variante, subdominio, modulo
  compartilhado, configuracao ou escopo adiado.

## Politica Do Quadro

- `done`: artefato ou implementacao concluida e verificada.
- `ready_for_guilherme_visual_qa`: codigo pronto; depende de julgamento visual,
  multiplas interacoes ou comportamento do editor/navegador.
- `in_progress`: existe alteracao ativa ainda nao commitada/publicada.
- `backlog`: task aprovada, mas ainda nao iniciada.
- `blocked`: impedimento externo ou dependencia ausente.

O campo bruto `status` dos JSONs nao deve ser usado sozinho. Para as tasks
recentes, `implementation_status` e `qa_owner` definem o estado operacional real.
