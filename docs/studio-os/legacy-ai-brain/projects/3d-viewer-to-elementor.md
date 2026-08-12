# Project Dossier: 3d-viewer-to-elementor

## Source

GitHub: `https://github.com/KingDonRush/3d-viewer-to-wordpress`

Local target: `wordpress/wp-content/plugins/3d-viewer-to-elementor`

## Value Signal

This is the dense proof-of-work project:
- complex JavaScript;
- 3D rendering;
- Elementor widget integration;
- WordPress asset loading;
- editor/frontend behavior;
- performance tradeoffs.

## Current Understanding

The viewer had poor behavior in Elementor edit mode. It also needs more
customization controls. Auto-optimization may be overengineered and sometimes
creates heavy files or hardcoded optimization behavior.

## Quadro de investigação — Estabilização funcional

Estado: apenas coleta de evidências. Nenhuma correção autorizada ainda.

### Sintomas relatados

1. O botão/controle do Elementor precisa ser atualizado ou substituído por uma
   interação mais confiável para seleção de mídia.
2. O preview do widget fica instável durante as interações no editor do
   Elementor, especialmente ao editar, rotacionar, alterar configurações ou
   reconstruir o widget.
3. Depois de selecionar um modelo, o editor não permite trocar o arquivo de
   forma confiável.
4. Remover e adicionar novamente o modelo, incluindo interações parecidas com
   desfazer/refazer, não restaura o estado esperado de forma confiável.
5. Ao limpar o modelo 3D no controle do widget, o viewer nem sempre para de
   renderizar no editor do Elementor.
6. Crítico: ativar o plugin afeta os uploads globalmente no WordPress. Uploads
   fora do controle de mídia 3D — incluindo fluxos normais de mídia do
   Elementor e a Biblioteca de Mídia do WordPress — são rejeitados ou limitados
   pelos tipos de arquivo aceitos pelo viewer.

### Mapa inicial de evidências

- `plugin.php` registra filtros de MIME e validação de upload globalmente
  durante a inicialização do plugin. Esta é a principal pista atual para o
  sintoma 6.
- `ViewerMediaControl.php` define o controle de dados personalizado do
  Elementor, enquanto `assets/js/admin-upload.js` controla a janela de mídia,
  seleção, limpeza, valores dinâmicos e comportamento parecido com desfazer.
  Esta é a área principal dos sintomas 1, 3 e 4.
- `assets/js/viewer-editor.js` deriva a configuração do preview a partir das
  configurações do Elementor e chama montagem/desmontagem durante alterações
  no elemento. Esta é a área principal do sintoma 5 e parte do sintoma 2.
- `assets/js/viewer-core.js` controla criação e destruição das instâncias,
  descarte do renderer, observação de mutações e leitura de
  `data-viewer-config`. Esta é a fronteira do ciclo de vida para verificar se
  um modelo limpo foi realmente removido.
- `Widget3DViewer.php` serializa a configuração do frontend no atributo HTML
  `data-viewer-config`. O problema histórico de HTML deve ser testado como um
  problema de contrato de dados/escape, sem assumir que seja a causa de todas
  as falhas do editor.

### Hipóteses de trabalho — ainda não comprovadas

- Os filtros globais de upload não estão limitados ao controle do viewer nem a
  uma ação explícita de upload do viewer.
- O controle de mídia, o modelo de configurações do Elementor e o handler do
  preview podem estar usando fontes de verdade concorrentes para
  `model_file` e `model_url`.
- Limpar a configuração pode remover o atributo de configuração, mas deixar
  uma instância antiga do preview ou permitir que outro observador/handler a
  inicialize novamente.
- Reconstruções podem competir com o carregamento assíncrono do modelo, fazendo
  com que um carregamento antigo termine depois de uma operação de limpar ou
  trocar o arquivo.
- O caminho de codificação/leitura do atributo HTML pode continuar frágil, mas
  deve ser investigado separadamente do estado do editor e do escopo de upload.

### Ordem da investigação

1. Estabelecer uma reprodução confiável do bloqueio global de uploads.
2. Rastrear as transições do controle de mídia: selecionar, substituir, limpar,
   desfazer, usar URL/valor dinâmico e recarregar.
3. Rastrear o ciclo de vida do preview: criar, substituir, limpar, remover,
   adicionar novamente e destruir enquanto há um carregamento assíncrono em
   andamento.
4. Validar o contrato HTML/de configuração com evidências reais do DOM do
   preview do Elementor.
5. Somente depois da estabilidade funcional, definir o backlog de
   profissionalização: controles, padrões, acabamento de UX, documentação,
   matriz de QA e comportamento de produto.

## Polish Direction

1. Stabilize Elementor editor behavior.
2. Separate editor preview, frontend render, and asset optimization concerns.
3. Add customization controls only where they map to real user value.
4. Replace hardcoded optimization guesses with explicit settings and safe
   defaults.
5. Add clear docs, screenshots, and demo assets.
6. Add a QA matrix for editor, frontend, mobile, and common 3D file types.

## Portfolio Case Study Angle

"I built an Elementor widget that lets non-technical editors place interactive
3D assets inside WordPress pages while keeping editor behavior and frontend
performance under control."
