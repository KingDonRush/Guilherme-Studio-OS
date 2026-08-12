# Playbook Operacional de Clean Code

> Fonte integral convertida de `/home/kingdonrush/Downloads/Playbook Operacional de Clean Code.pdf` em 2026-06-26.
> Conversao textual via `pdftotext -layout`; tabelas e quebras foram preservadas como texto sempre que possivel.

Finalidade
Este playbook estabelece critérios para desenvolvimento, revisão, refatoração e evolução de software.
Seu propósito é reduzir o custo de compreender, modificar, testar e operar o código sem transformar
preferências pessoais em regras universais.


Clean Code é tratado aqui como um conjunto de princípios, heurísticas e decisões contextuais. A
qualidade de uma solução não é determinada pela quantidade de abstrações, padrões, camadas,
módulos ou arquivos, mas pela capacidade de atender ao problema com clareza, segurança e custo
sustentável.


Como usar este playbook
Use o documento para:


     • Orientar decisões durante a implementação;
     • Revisar mudanças com critérios verificáveis;
     • Identificar riscos de manutenção e design;
     • Planejar refatorações;
     • Justificar exceções;
     • Alinhar expectativas técnicas;
     • Registrar dívidas técnicas aceitas;
     • Avaliar impactos arquiteturais.

O playbook não substitui julgamento técnico. Quando uma recomendação não for adequada, registre:


    1. Qual recomendação foi excepcionada;
    2. Por que ela não se aplica;
    3. Quais riscos foram aceitos;
    4. Como esses riscos serão controlados;
    5. Quando a decisão deverá ser reavaliada.


Classificação das orientações

 Classificação       Significado                                        Tratamento esperado

                     Orientação amplamente aplicável, cuja
 Princípio geral                                                        Aplicar por padrão.
                     violação normalmente exige justificativa.

                     Regra prática útil na maioria dos casos, mas       Aplicar quando reduzir risco
 Heurística
                     dependente de evidências locais.                   ou custo.

 Decisão             Escolha determinada por domínio, restrições,       Avaliar e registrar a
 contextual          escala, prazo ou risco.                            justificativa.

---

 Classificação        Significado                                        Tratamento esperado

                      Escolha de estilo sem impacto relevante e          Seguir convenção da equipe
 Preferência
                      demonstrável.                                      e evitar bloqueios.


Ordem de prioridade
Quando critérios entrarem em conflito, considere nesta ordem:


    1. Correção e integridade do comportamento;
    2. Segurança e proteção de dados;
    3. Previsibilidade operacional;
    4. Clareza e facilidade de diagnóstico;
    5. Facilidade de mudança;
    6. Testabilidade;
    7. Consistência;
    8. Reutilização;
    9. Elegância;
   10. Preferência pessoal.


1. Princípios fundamentais
1.1 Clareza de intenção
Diretriz: torne evidente o propósito de cada unidade, decisão e fluxo relevante.


Objetivo: permitir que uma pessoa compreenda o que o código pretende fazer sem reconstruir
mentalmente sua intenção a partir de detalhes dispersos.


Sinais de conformidade:


     • Nomes representam o significado no domínio;
     • A estrutura acompanha o fluxo do problema;
     • Decisões importantes são explícitas;
     • Entradas, saídas e efeitos são identificáveis;
     • O código pode ser explicado sem justificativas extensas.

Sinais de violação:


     • Nomes genéricos ou ambíguos;
     • Comportamento dependente de conhecimento implícito;
     • Regras importantes escondidas em detalhes técnicos;
     • Fluxos que exigem leitura repetida;
     • Comentários necessários para traduzir o que o código faz.

Riscos:


     • Alterações incorretas;

---

     • Revisões superficiais;
     • Defeitos causados por interpretações divergentes;
     • Dependência de conhecimento individual;
     • Maior tempo de diagnóstico.

Ações recomendadas:


     • Renomear elementos ambíguos;
     • Separar decisões conceituais de detalhes de execução;
     • Tornar condições e resultados explícitos;
     • Remover caminhos redundantes;
     • Registrar decisões não dedutíveis a partir do código.

Exceções e trade-offs:


     • Convenções consolidadas podem justificar nomes mais compactos;
     • Detalhes internos de escopo restrito podem exigir menos explicitação;
     • Clareza não exige verbosidade nem repetição de contexto já evidente.

Classificação: princípio geral.


1.2 Simplicidade
Diretriz: use a solução menos complexa que satisfaça os requisitos conhecidos e os riscos relevantes.


Objetivo: evitar custo presente baseado em necessidades hipotéticas.


Sinais de conformidade:


     • Cada elemento possui função identificável;
     • A solução responde ao problema atual;
     • Existem poucos mecanismos para produzir o mesmo resultado;
     • O número de conceitos necessários é proporcional ao problema;
     • Extensões futuras não dominam o design atual.

Sinais de violação:


     • Generalizações sem uso concreto;
     • Camadas sem responsabilidade clara;
     • Configurabilidade que não atende a cenários reais;
     • Múltiplos caminhos equivalentes;
     • Estrutura mais complexa do que o comportamento que representa.

Riscos:


     • Maior superfície de defeitos;
     • Manutenção de mecanismos inutilizados;
     • Aumento do custo de testes;
     • Dificuldade de remoção;
     • Lentidão na evolução.

---

Ações recomendadas:


     • Remover capacidades não utilizadas;
     • Consolidar caminhos equivalentes;
     • Adiar generalizações;
     • Reduzir estados, transições e dependências;
     • Substituir mecanismos genéricos por soluções explícitas quando apropriado.

Exceções e trade-offs:


     • Requisitos regulatórios, operacionais ou de segurança podem exigir estruturas adicionais;
     • Flexibilidade pode ser justificada quando existem variações concretas e frequentes;
     • Simplicidade local não deve criar complexidade sistêmica.

Classificação: princípio geral.


1.3 Coesão
Diretriz: mantenha juntas as partes que mudam pelas mesmas razões e cumprem o mesmo propósito.


Objetivo: reduzir dispersão e tornar responsabilidades identificáveis.


Sinais de conformidade:


     • Elementos de uma unidade compartilham propósito;
     • Mudanças relacionadas concentram-se em poucos pontos;
     • Dependências internas são mais fortes que dependências externas;
     • A unidade possui motivo claro para existir;
     • Seu nome descreve adequadamente seu conteúdo.

Sinais de violação:


     • Unidade descrita por várias responsabilidades desconectadas;
     • Mudanças distintas atingem o mesmo componente;
     • Dados e operações relacionadas estão dispersos;
     • Elementos internos quase não se relacionam;
     • Nomes genéricos como “utilidades”, “gerenciador” ou equivalentes.

Riscos:


     • Conflitos frequentes;
     • Testes abrangentes demais;
     • Efeitos colaterais durante mudanças;
     • Dificuldade de reutilização seletiva;
     • Crescimento descontrolado.

Ações recomendadas:


     • Agrupar comportamento por responsabilidade;
     • Separar motivos independentes de mudança;

---

     • Aproximar regras dos dados e decisões que utilizam;
     • Eliminar agrupamentos baseados apenas em conveniência;
     • Reavaliar fronteiras periodicamente.

Exceções e trade-offs:


     • Componentes de integração podem coordenar responsabilidades diferentes;
     • Agrupamentos pequenos podem ser aceitáveis quando a separação não reduz nenhum custo;
     • Coesão não significa fragmentar cada operação em uma unidade própria.

Classificação: princípio geral.


1.4 Baixo acoplamento
Diretriz: minimize o conhecimento e a dependência entre unidades que evoluem de forma
independente.


Objetivo: limitar o alcance das mudanças e das falhas.


Sinais de conformidade:


     • Dependências são explícitas;
     • Contratos são pequenos e estáveis;
     • Detalhes internos não vazam;
     • Componentes podem mudar sem coordenação excessiva;
     • Falhas são contidas por fronteiras conhecidas.

Sinais de violação:


     • Alterações simples exigem mudanças em vários pontos;
     • Componentes conhecem estruturas internas uns dos outros;
     • Ordem de inicialização implícita;
     • Estado global ou compartilhado sem controle;
     • Dependências transitivas influenciam consumidores.

Riscos:


     • Efeito cascata;
     • Testes frágeis;
     • Implantação coordenada desnecessária;
     • Maior chance de regressão;
     • Evolução lenta.

Ações recomendadas:


     • Reduzir contratos;
     • Tornar dependências explícitas;
     • Encapsular detalhes instáveis;
     • Separar políticas de mecanismos;
     • Remover acesso desnecessário a estado compartilhado.

---

Exceções e trade-offs:


     • Integração direta pode ser mais simples em escopos pequenos e estáveis;
     • Indireção criada apenas para eliminar qualquer dependência pode piorar a clareza;
     • Acoplamento é aceitável quando representa uma relação real e estável.

Classificação: princípio geral.


1.5 Responsabilidades bem definidas
Diretriz: atribua a cada unidade um propósito claro e um conjunto limitado de decisões.


Objetivo: permitir identificação rápida de onde cada comportamento pertence.


Sinais de conformidade:


     • A responsabilidade pode ser expressa em uma frase;
     • Entradas e resultados são coerentes com o propósito;
     • A unidade não coordena detalhes que não lhe pertencem;
     • Suas mudanças possuem causas relacionadas;
     • Limites são reconhecidos pela equipe.

Sinais de violação:


     • A descrição exige várias conjunções;
     • Uma unidade valida, transforma, persiste, comunica e apresenta sem necessidade;
     • Decisões de contextos distintos estão misturadas;
     • Não existe local evidente para uma nova regra;
     • Comportamentos são adicionados ao ponto mais conveniente.

Riscos:


     • Crescimento contínuo;
     • Dificuldade de teste;
     • Dependências excessivas;
     • Alterações imprevisíveis;
     • Perda de fronteiras arquiteturais.

Ações recomendadas:


     • Identificar os motivos de mudança;
     • Separar coordenação de execução;
     • Definir propriedade sobre decisões;
     • Mover comportamentos para fronteiras coerentes;
     • Impedir expansão por conveniência.

Exceções e trade-offs:


     • Orquestradores podem coordenar múltiplas etapas;
     • Uma unidade pequena não precisa ser dividida apenas por cumprir mais de uma operação;

---

     • Separação só é útil quando melhora compreensão, mudança ou teste.

Classificação: princípio geral.


1.6 Encapsulamento
Diretriz: exponha o necessário e proteja decisões, estados e invariantes internos.


Objetivo: permitir mudanças internas sem propagação desnecessária.


Sinais de conformidade:


     • Consumidores utilizam capacidades, não detalhes;
     • Invariantes são preservadas por uma fronteira;
     • Estado não pode ser alterado arbitrariamente;
     • Contratos expressam operações válidas;
     • Mudanças internas possuem impacto localizado.

Sinais de violação:


     • Estruturas internas são manipuladas externamente;
     • Consumidores precisam conhecer sequências internas;
     • Validações são repetidas em vários pontos;
     • Estado inválido pode ser criado facilmente;
     • Detalhes técnicos tornam-se parte do contrato.

Riscos:


     • Inconsistência;
     • Dependência de implementação;
     • Alterações amplas;
     • Duplicação de regras;
     • Dificuldade de substituir mecanismos.

Ações recomendadas:


     • Restringir superfícies públicas;
     • Centralizar invariantes;
     • Expor operações significativas;
     • Impedir transições inválidas;
     • Separar representação interna de contrato externo.

Exceções e trade-offs:


     • Estruturas simples e imutáveis podem não exigir fronteiras adicionais;
     • Encapsulamento excessivo pode esconder comportamento importante;
     • Proteção deve ser proporcional ao risco de uso incorreto.

Classificação: princípio geral.

---

1.7 Modularidade
Diretriz: organize o sistema em unidades com propósito, fronteira e dependências compreensíveis.


Objetivo: tornar o sistema navegável, substituível e evolutivo.


Sinais de conformidade:


     • Fronteiras correspondem a capacidades ou responsabilidades reais;
     • Dependências possuem direção definida;
     • Cada módulo possui contrato identificável;
     • Mudanças permanecem predominantemente dentro de uma fronteira;
     • O sistema pode ser compreendido por partes.

Sinais de violação:


     • Divisão baseada apenas em tipos técnicos;
     • Dependências circulares;
     • Módulos sem autonomia conceitual;
     • Fronteiras atravessadas continuamente;
     • Fragmentação que exige navegação excessiva.

Riscos:


     • Arquitetura apenas nominal;
     • Dependências difíceis de rastrear;
     • Coordenação excessiva;
     • Componentes inutilmente pequenos;
     • Mudanças transversais recorrentes.

Ações recomendadas:


     • Definir fronteiras por responsabilidade;
     • Tornar direção das dependências explícita;
     • Consolidar fragmentos que sempre mudam juntos;
     • Separar áreas com ritmos de mudança diferentes;
     • Eliminar módulos sem função arquitetural.

Exceções e trade-offs:


     • Sistemas pequenos podem exigir poucas fronteiras;
     • Separação física não garante modularidade;
     • Modularidade interna pode ser suficiente sem isolamento operacional.

Classificação: princípio geral.


1.8 Consistência
Diretriz: resolva problemas equivalentes de maneiras equivalentes, salvo justificativa explícita.

---

Objetivo: reduzir decisões incidentais e tornar o comportamento previsível.


Sinais de conformidade:


     • Convenções são reconhecíveis;
     • Casos semelhantes possuem estrutura semelhante;
     • Diferenças refletem necessidades reais;
     • Decisões recorrentes estão documentadas;
     • Novos integrantes conseguem antecipar padrões.

Sinais de violação:


     • Múltiplas soluções para o mesmo problema;
     • Exceções não justificadas;
     • Convenções locais conflitantes;
     • Estruturas diferentes por preferência individual;
     • Comportamento semelhante com semânticas distintas.

Riscos:


     • Maior curva de compreensão;
     • Erros por pressupostos incorretos;
     • Revisões baseadas em gosto;
     • Duplicação de mecanismos;
     • Operação inconsistente.

Ações recomendadas:


     • Consolidar convenções úteis;
     • Tornar diferenças intencionais;
     • Migrar padrões gradualmente;
     • Automatizar apenas verificações objetivas;
     • Registrar decisões recorrentes.

Exceções e trade-offs:


     • Contextos diferentes podem exigir soluções diferentes;
     • Consistência com uma prática ruim não justifica sua continuidade;
     • Migrações podem produzir coexistência temporária.

Classificação: heurística.


1.9 Previsibilidade
Diretriz: faça com que entradas, resultados, falhas e efeitos sigam contratos reconhecíveis.


Objetivo: reduzir surpresas durante uso, teste e operação.

---

Sinais de conformidade:


     • Resultados são compatíveis com o contrato;
     • Falhas seguem padrões conhecidos;
     • Efeitos colaterais são explícitos;
     • Ordem de execução necessária está documentada;
     • Estados inválidos são impedidos ou detectados.

Sinais de violação:


     • Operações aparentemente semelhantes se comportam de formas diferentes;
     • Falhas são omitidas ou convertidas silenciosamente;
     • Uma operação altera estado não relacionado;
     • Resultados dependem de condições invisíveis;
     • Comportamento varia sem sinalização.

Riscos:


     • Defeitos intermitentes;
     • Diagnóstico difícil;
     • Uso incorreto;
     • Corrupção de estado;
     • Testes não confiáveis.

Ações recomendadas:


     • Padronizar contratos de sucesso e falha;
     • Expor efeitos relevantes;
     • Eliminar dependências ocultas;
     • Tornar transições de estado explícitas;
     • Rejeitar entradas inválidas em fronteiras adequadas.

Exceções e trade-offs:


     • Operações probabilísticas ou distribuídas exigem contratos que expressem incerteza;
     • Recuperações automáticas são aceitáveis quando observáveis;
     • Previsibilidade não significa ausência de falhas, mas comportamento conhecido diante delas.

Classificação: princípio geral.


1.10 Testabilidade
Diretriz: estruture o código de modo que comportamentos relevantes possam ser verificados com
controle e confiança.


Objetivo: reduzir o custo e o risco de alteração.


Sinais de conformidade:


     • Entradas e resultados podem ser controlados;

---

     • Dependências externas podem ser delimitadas;
     • Regras importantes podem ser verificadas isoladamente;
     • Testes observam comportamento, não detalhes irrelevantes;
     • Falhas são reproduzíveis.

Sinais de violação:


     • Testes exigem ambientes amplos para comportamentos pequenos;
     • Dependências ocultas impedem controle;
     • Estado compartilhado produz interferência;
     • Pequenas alterações quebram muitos testes sem mudança de comportamento;
     • Testes dependem excessivamente da estrutura interna.

Riscos:


     • Regressões;
     • Refatoração evitada;
     • Testes lentos ou instáveis;
     • Falsa confiança;
     • Diagnóstico demorado.

Ações recomendadas:


     • Separar lógica de efeitos;
     • Tornar dependências explícitas;
     • Controlar tempo, aleatoriedade e estado externo;
     • Testar contratos relevantes;
     • Remover indireções criadas apenas para satisfazer testes frágeis.

Exceções e trade-offs:


     • Nem todo detalhe precisa de teste isolado;
     • Fluxos integrados exigem validação integrada;
     • Testabilidade não justifica arquitetura artificial ou excesso de interfaces.

Classificação: princípio geral.


1.11 Controle de complexidade
Diretriz: limite a quantidade de condições, estados, caminhos e conceitos que precisam ser
considerados simultaneamente.


Objetivo: manter o raciocínio necessário dentro de uma escala gerenciável.


Sinais de conformidade:


     • Fluxos possuem poucos caminhos relevantes;
     • Condições representam conceitos identificáveis;
     • Estados e transições são controlados;
     • Casos excepcionais estão isolados;

---

     • A complexidade está concentrada onde o domínio exige.

Sinais de violação:


     • Aninhamento excessivo;
     • Muitas condições combinadas;
     • Estados implícitos;
     • Dependência de sequência extensa;
     • Casos especiais espalhados.

Riscos:


     • Caminhos não testados;
     • Comportamento contraditório;
     • Defeitos em casos extremos;
     • Dificuldade de alteração;
     • Revisões incompletas.

Ações recomendadas:


     • Reduzir caminhos;
     • Tornar estados explícitos;
     • Separar regras independentes;
     • Eliminar condições redundantes;
     • Dividir fluxos por fases significativas.

Exceções e trade-offs:


     • Domínios complexos não se tornam simples por fragmentação;
     • Distribuir uma decisão por muitos arquivos pode aumentar a complexidade;
     • Métricas numéricas são indicadores, não veredictos.

Classificação: princípio geral.


1.12 Facilidade de mudança
Diretriz: organize o sistema para que mudanças prováveis ocorram com impacto localizado, verificável
e reversível.


Objetivo: reduzir o custo total de evolução.


Sinais de conformidade:


     • Mudanças frequentes atingem poucos pontos;
     • Contratos estáveis protegem detalhes voláteis;
     • Comportamentos podem ser alterados sem efeitos inesperados;
     • Testes e observabilidade permitem validar a mudança;
     • Decisões relevantes podem ser revertidas.

---

Sinais de violação:


     • Mudanças simples atravessam muitas fronteiras;
     • Regras semelhantes precisam ser atualizadas separadamente;
     • Dependências impedem evolução independente;
     • Não existe forma segura de validar o impacto;
     • Cada alteração exige conhecimento amplo do sistema.

Riscos:


     • Aumento progressivo do prazo;
     • Medo de alterar;
     • Soluções improvisadas;
     • Dívida técnica acumulativa;
     • Perda de capacidade de resposta.

Ações recomendadas:


     • Identificar e proteger pontos de variação reais;
     • Reduzir dependências desnecessárias;
     • Consolidar regras relacionadas;
     • Melhorar cobertura nos pontos de maior risco;
     • Favorecer mudanças pequenas e reversíveis.

Exceções e trade-offs:


     • Otimizar para toda mudança imaginável gera complexidade desnecessária;
     • Mudanças raras podem aceitar maior custo;
     • Flexibilidade deve ser baseada em histórico, probabilidade ou consequência.

Classificação: princípio geral.


2. Regras de decisão
                                                                Considere            Não faça apenas    Aceite a exceção
  Tema                    Faça quando...     Evite quando...
                                                                quando...            porque...          quando...

                                             Exigir             O termo fizer
                          O nome puder
                                             interpretação,     parte do             Um nome mais       A convenção for
                          expressar
                                             abreviação         vocabulário          longo parecer      amplamente
  Nomes                   propósito,
                                             obscura ou         estável da           automaticamente    conhecida e não
                          papel ou
                                             contexto           equipe ou do         mais “limpo”.      gerar ambiguida
                          resultado.
                                             externo.           domínio.

                          Houver uma         Misturar           A separação
                                                                                                        A operação maio
                          operação           decisões           reduzir              Funções devam
                                                                                                        representar um
  Funções e               identificável,     independentes      caminhos,            ser pequenas por
                                                                                                        fluxo coeso e ma
  operações               com entradas e     ou esconder        dependências         uma contagem
                                                                                                        compreensível em
                          resultados         efeitos            ou motivos de        arbitrária.
                                                                                                        conjunto.
                          coerentes.         relevantes.        mudança.

---

                                                            Considere         Não faça apenas    Aceite a exceção
Tema                Faça quando...      Evite quando...
                                                            quando...         porque...          quando...

                                                            Partes
                    A unidade tiver                         mudarem por                          A coordenação d
                                        Acumular                              Toda unidade
                    propósito e                             razões                               etapas fizer parte
                                        comportamento                         precise ter
Responsabilidades   motivo de                               diferentes ou                        uma
                                        por                                   apenas uma
                    mudança                                 exigirem                             responsabilidade
                                        conveniência.                         operação.
                    claros.                                 dependências                         legítima.
                                                            distintas.

                                                            Partes
                                                            possuírem                            A proximidade
                    Existir uma         Criar módulos                         Mais arquivos ou
                                                            ritmos de                            reduzir navegaçã
Módulos e           fronteira           apenas para                           diretórios
                                                            mudança,                             sem aumentar
componentes         conceitual ou       aumentar                              parecerem mais
                                                            riscos ou                            acoplamento
                    operacional útil.   separação física.                     organizados.
                                                            dependências                         problemático.
                                                            diferentes.

                                                            A mesma
                    A repetição
                                                            mudança           Toda repetição     As partes forem
                    representar a       Unificar trechos
                                                            precisar ser      de texto ou        conceitualmente
                    mesma regra e       apenas por
Duplicação                                                  aplicada          estrutura for      diferentes ou
                    precisar            semelhança
                                                            repetidamente     necessariamente    evoluírem
                    permanecer          superficial.
                                                            nos mesmos        um problema.       independenteme
                    sincronizada.
                                                            pontos.

                    Houver variação                         Existirem
                                        A abstração                                              A explicitude for
                    concreta,                               múltiplos         Um padrão
                                        depender de                                              mais clara e o cus
Abstrações          contrato estável                        casos reais       conhecido puder
                                        previsões                                                da duplicação for
                    ou conceito                             com semântica     ser aplicado.
                                        frágeis.                                                 baixo.
                    relevante.                              comum.

                    A relação for                           A dependência
                                        Introduzir                            Toda
                    necessária,                             mudar em                             O acoplamento
                                        dependência                           dependência
                    explícita e                             ritmo diferente                      direto representa
Dependências                            transitiva,                           precisar de uma
                    coerente com a                          ou possuir alto                      uma relação simp
                                        circular ou                           camada
                    direção                                 risco                                e estável.
                                        oculta.                               intermediária.
                    arquitetural.                           operacional.

                                                            Existirem
                                        Ocultar, ignorar                                         A falha puder ser
                    A falha puder                           recuperação,      Toda falha
                                        ou converter                                             propagada com
Tratamento de       ocorrer e exigir                        repetição,        precisar ser
                                        falhas sem                                               contrato claro pa
erros               resposta                                compensação       capturada em
                                        preservar                                                uma fronteira
                    definida.                               ou degradação     todos os níveis.
                                        contexto.                                                responsável.
                                                            possíveis.

                    O contexto, a                           Houver                               Uma explicação
                    restrição ou a      Repetir o           limitação         Comentários        externa for
                    decisão não         comportamento       externa,          aumentarem         necessária e não
Comentários
                    puder ser           ou justificar       decisão não       automaticamente    puder ser
                    deduzida do         código confuso.     óbvia ou dívida   a legibilidade.    representada
                    código.                                 aceita.                              estruturalmente.

---

                                                                Considere         Não faça apenas    Aceite a exceção
 Tema                     Faça quando...     Evite quando...
                                                                quando...         porque...          quando...

                          O
                                                                Dependências
                          comportamento                                                              Um teste integra
                                             Acoplar testes a   externas ou       Toda unidade
                          possuir risco,                                                             for mais confiáve
                                             detalhes           não               precisar ser
 Testabilidade            complexidade                                                               econômico que
                                             internos           determinísticas   testada
                          ou importância                                                             múltiplos testes
                                             irrelevantes.      precisarem ser    isoladamente.
                          que justifique                                                             artificiais.
                                                                controladas.
                          verificação.

                                             Misturar
                          Houver um                             O custo atual
                                             reestruturação                       O código não       A janela de muda
                          problema                              já estiver
                                             ampla com                            corresponder a     for restrita e a dív
 Refatoração              identificável e                       afetando
                                             mudança crítica                      uma preferência    estiver registrada
                          melhoria                              prazo, risco ou
                                             de                                   estética.          controlada.
                          verificável.                          diagnóstico.
                                             comportamento.

                                                                O custo de
                          A decisão afetar
                                                                reversão for      Toda decisão
                          fronteiras,        Criar estruturas                                        Uma solução loca
                                                                alto ou o         técnica precisar
                          dependências,      para escalas ou                                         for reversível e
 Arquitetura                                                    impacto           de um padrão
                          operação ou        requisitos                                              suficiente para o
                                                                atravessar        arquitetural
                          evolução           inexistentes.                                           risco atual.
                                                                equipes e         formal.
                          relevante.
                                                                componentes.


3. Critérios de qualidade
3.1 Clareza
O que observar:


     • Intenção;
     • Vocabulário;
     • Fluxo;
     • Contratos;
     • Visibilidade de efeitos.

Sinais positivos:


     • O comportamento pode ser resumido corretamente após uma leitura;
     • Os nomes correspondem ao papel dos elementos;
     • As decisões relevantes são localizáveis;
     • Casos excepcionais são identificáveis.

Sinais de alerta:


     • Interpretações possíveis e conflitantes;
     • Dependência de comentários explicativos;
     • Fluxo fragmentado;

---

     • Nomes que descrevem mecanismo, mas não propósito.

Perguntas de validação:


     • O propósito está evidente?
     • O leitor precisa inferir alguma regra importante?
     • Há termos com significados diferentes?
     • Os efeitos relevantes estão visíveis?

Ações corretivas:


     • Renomear;
     • Reorganizar o fluxo;
     • Explicitar contratos;
     • Remover caminhos redundantes;
     • Aproximar decisões relacionadas.


3.2 Complexidade
O que observar:


     • Número de caminhos;
     • Combinação de condições;
     • Estados possíveis;
     • Sequências obrigatórias;
     • Interações entre regras.

Sinais positivos:


     • Fluxos lineares quando possível;
     • Estados válidos limitados;
     • Condições representam conceitos;
     • Exceções estão isoladas.

Sinais de alerta:


     • Aninhamento;
     • Condições negativas ou combinadas em excesso;
     • Estado implícito;
     • Comportamento dependente de ordem não declarada;
     • Muitos casos especiais.

Perguntas de validação:


     • Quantos cenários precisam ser considerados simultaneamente?
     • Existem estados impossíveis ou contraditórios?
     • Algum caminho pode ser eliminado?
     • A complexidade é do domínio ou da implementação?

---

Ações corretivas:


     • Reduzir caminhos;
     • Declarar estados;
     • Separar decisões;
     • Eliminar redundâncias;
     • Concentrar a complexidade inevitável.


3.3 Coesão
O que observar:


     • Relação entre responsabilidades;
     • Motivos de mudança;
     • Uso das dependências;
     • Proximidade de dados e comportamento.

Sinais positivos:


     • A unidade possui propósito reconhecível;
     • Elementos internos colaboram para o mesmo resultado;
     • Mudanças relacionadas permanecem juntas.

Sinais de alerta:


     • Dependências usadas por apenas pequenas partes desconectadas;
     • Operações sem relação conceitual;
     • Unidade que cresce continuamente;
     • Nome incapaz de representar seu conteúdo.

Perguntas de validação:


     • Todas as partes existem pelo mesmo motivo?
     • O que mudaria junto?
     • A unidade pode ser nomeada sem termos genéricos?
     • Há grupos internos praticamente independentes?

Ações corretivas:


     • Separar motivos de mudança;
     • Reagrupar comportamento;
     • Eliminar agrupamentos de conveniência;
     • Definir propriedade sobre regras.


3.4 Acoplamento
O que observar:


     • Dependências diretas e transitivas;

---

     • Conhecimento de detalhes;
     • Compartilhamento de estado;
     • Coordenação necessária para mudanças.

Sinais positivos:


     • Contratos pequenos;
     • Dependências explícitas;
     • Direção arquitetural estável;
     • Mudanças localizadas.

Sinais de alerta:


     • Dependências circulares;
     • Acesso a estruturas internas;
     • Estado global;
     • Alterações em cascata;
     • Inicialização ou execução em ordem implícita.

Perguntas de validação:


     • Esta unidade conhece mais do que precisa?
     • Uma mudança interna afeta consumidores?
     • A dependência representa uma relação real?
     • Há uma fronteira que está sendo atravessada indevidamente?

Ações corretivas:


     • Reduzir contratos;
     • Encapsular detalhes;
     • Remover dependências desnecessárias;
     • Reorientar dependências;
     • Controlar estado compartilhado.


3.5 Duplicação
O que observar:


     • Regras repetidas;
     • Decisões equivalentes;
     • Mudanças sincronizadas;
     • Estruturas apenas visualmente semelhantes.

Sinais positivos:


     • Cada regra possui fonte identificável;
     • Repetições independentes podem evoluir separadamente;
     • Compartilhamento ocorre por significado.

---

Sinais de alerta:


     • Correções repetidas nos mesmos locais;
     • Variações acidentais da mesma regra;
     • Cópias que precisam permanecer sincronizadas;
     • Generalizações com muitos parâmetros e exceções.

Perguntas de validação:


     • A repetição representa a mesma decisão?
     • As partes devem sempre mudar juntas?
     • A abstração resultante teria contrato estável?
     • O custo da abstração é menor que o da repetição?

Ações corretivas:


     • Consolidar regras;
     • Compartilhar conceitos estáveis;
     • Manter duplicação quando os significados forem diferentes;
     • Remover abstrações que apenas ocultam semelhança superficial.


3.6 Previsibilidade
O que observar:


     • Contratos;
     • Efeitos;
     • Falhas;
     • Transições de estado;
     • Consistência entre operações semelhantes.

Sinais positivos:


     • Comportamento compatível com o nome e o contrato;
     • Falhas preservam contexto;
     • Efeitos são observáveis;
     • Casos equivalentes recebem tratamento equivalente.

Sinais de alerta:


     • Resultado silenciosamente parcial;
     • Falhas ignoradas;
     • Alterações em estado não relacionado;
     • Dependência de ambiente não declarada.

Perguntas de validação:


     • O consumidor consegue antecipar sucesso e falha?
     • Há efeitos que não aparecem no contrato?
     • O mesmo cenário pode produzir resultados incompatíveis?

---

     • O comportamento depende de condições invisíveis?

Ações corretivas:


     • Padronizar contratos;
     • Expor efeitos;
     • Tratar falhas em fronteiras responsáveis;
     • Remover dependências ocultas.


3.7 Testabilidade
O que observar:


     • Controle de entradas;
     • Observação de resultados;
     • Isolamento de dependências;
     • Determinismo;
     • Estabilidade dos testes.

Sinais positivos:


     • Regras podem ser verificadas diretamente;
     • Testes descrevem comportamento;
     • Falhas são reproduzíveis;
     • Pouca preparação é necessária para cenários simples.

Sinais de alerta:


     • Testes dependem de ordem;
     • Preparação desproporcional;
     • Dependências externas para regras locais;
     • Testes quebram com reorganizações internas.

Perguntas de validação:


     • O comportamento relevante pode ser controlado e observado?
     • O teste falha pela razão correta?
     • A estrutura foi alterada apenas para satisfazer testes?
     • O nível do teste corresponde ao risco?

Ações corretivas:


     • Separar lógica e efeitos;
     • Controlar fontes não determinísticas;
     • Testar contratos;
     • Reduzir dependência de estrutura interna;
     • Remover estado compartilhado entre testes.

---

3.8 Observabilidade
O que observar:


     • Sinais de falha;
     • Contexto disponível;
     • Correlação entre operações;
     • Estados operacionais;
     • Possibilidade de diagnóstico.

Sinais positivos:


     • Falhas relevantes podem ser localizadas;
     • Eventos possuem contexto suficiente;
     • Estados degradados são identificáveis;
     • Há sinais sobre volume, latência, erros e saturação quando pertinentes.

Sinais de alerta:


     • Falhas silenciosas;
     • Mensagens genéricas;
     • Ausência de contexto;
     • Dados excessivos sem utilidade diagnóstica;
     • Dependência de reprodução local.

Perguntas de validação:


     • Como saberemos que falhou?
     • Como localizar a origem?
     • Os sinais distinguem causa de consequência?
     • Alguma informação sensível está sendo exposta?
     • O nível de detalhe é proporcional ao risco?

Ações corretivas:


     • Melhorar contexto;
     • Padronizar identificação de operações;
     • Expor estados relevantes;
     • Reduzir ruído;
     • Proteger informações sensíveis.


3.9 Facilidade de mudança
O que observar:


     • Alcance das alterações;
     • Pontos de variação;
     • Reversibilidade;
     • Dependências;
     • Capacidade de validação.

---

Sinais positivos:


     • Mudanças frequentes são localizadas;
     • Decisões voláteis estão protegidas;
     • Alterações podem ser implantadas e revertidas com segurança;
     • Existe validação proporcional ao risco.

Sinais de alerta:


     • Mudanças pequenas atravessam muitas unidades;
     • Regras estão dispersas;
     • Contratos instáveis são amplamente expostos;
     • Alterações não podem ser isoladas.

Perguntas de validação:


     • Quantos pontos precisam mudar?
     • Os pontos variam pela mesma razão?
     • A mudança pode ser validada e revertida?
     • Estamos otimizando para uma mudança provável ou imaginária?

Ações corretivas:


     • Consolidar regras;
     • Proteger detalhes voláteis;
     • Reduzir contratos;
     • Introduzir variação apenas onde existe necessidade concreta;
     • Melhorar mecanismos de validação.


3.10 Integridade arquitetural
O que observar:


     • Fronteiras;
     • Direção de dependências;
     • Propriedade de responsabilidades;
     • Consistência de contratos;
     • Decisões transversais.

Sinais positivos:


     • Dependências respeitam a direção definida;
     • Regras permanecem na fronteira responsável;
     • Exceções são documentadas;
     • A arquitetura corresponde ao sistema real.

Sinais de alerta:


     • Atalhos atravessando fronteiras;
     • Dependências circulares;

---

     • Regras duplicadas em diferentes componentes;
     • Camadas existentes apenas nominalmente;
     • Decisões importantes sem proprietário.

Perguntas de validação:


     • Esta mudança pertence a esta fronteira?
     • A direção da dependência continua correta?
     • Alguma decisão está sendo duplicada?
     • O modelo arquitetural ainda descreve o sistema?
     • A exceção cria precedente perigoso?

Ações corretivas:


     • Reposicionar responsabilidades;
     • Restaurar fronteiras;
     • Consolidar contratos;
     • Remover camadas fictícias;
     • Registrar e limitar exceções.


4. Padrões recomendados
 Objetivo              Prática recomendada      Aplicar quando               Cuidado

                       Nomear pelo
                                                O comportamento não          Evitar nomes longos
 Tornar intenção       propósito e pelo
                                                for evidente pelo            que apenas repetem a
 explícita             significado no
                                                contexto.                    estrutura.
                       domínio.

                       Representar decisões
                                                                             Não criar uma
 Tornar intenção       importantes como         Uma condição carregar
                                                                             abstração para cada
 explícita             conceitos                regra relevante.
                                                                             expressão.
                       identificáveis.

                                                                             Não documentar
                       Definir contratos de     Uma unidade for
 Reduzir                                                                     promessas que a
                       entrada, resultado e     utilizada por vários
 ambiguidade                                                                 implementação não
                       falha.                   consumidores.
                                                                             garante.

                                                                             Manter
                       Usar uma única           Variações causarem
                                                                             representações
 Reduzir               representação para       conversões e
                                                                             diferentes quando os
 ambiguidade           cada conceito dentro     interpretações
                                                                             contextos realmente
                       da mesma fronteira.      frequentes.
                                                                             diferirem.

                       Separar coordenação,
                       regra e efeito quando                                 Não fragmentar fluxos
 Limitar                                        A mistura dificultar teste
                       possuírem motivos                                     coesos apenas por
 responsabilidades                              ou evolução.
                       de mudança                                            princípio.
                       distintos.

---

Objetivo            Prática recomendada      Aplicar quando              Cuidado

                                             Uma decisão estiver         Evitar proprietários
Limitar             Definir propriedade
                                             repetida ou sem             genéricos
responsabilidades   clara para cada regra.
                                             localização evidente.       responsáveis por tudo.

                                             O comportamento
                    Tornar dependências                                  Não introduzir
Organizar                                    depender de serviços,
                    necessárias                                          indireção sem
dependências                                 estado ou recursos
                    explícitas.                                          benefício.
                                             externos.

                                                                         Não criar contratos
                    Fazer dependências       Detalhes mudarem mais
Organizar                                                                artificiais para
                    apontarem para           frequentemente que a
dependências                                                             componentes estáveis
                    contratos estáveis.      política consumidora.
                                                                         e locais.

                    Concentrar                                           Não esconder o efeito
                                             O efeito puder falhar,
Isolar efeitos      interações externas                                  sob nomes que
                                             variar ou dificultar
colaterais          em fronteiras                                        pareçam operações
                                             testes.
                    reconhecíveis.                                       puras.

                    Separar decisão de
                                             A decisão puder ser         Não duplicar lógica
Isolar efeitos      execução quando
                                             verificada                  entre planejamento e
colaterais          isso permitir controle
                                             independentemente.          execução.
                    e validação.

                                                                         Não substituir estado
                    Reduzir escopo,
Controlar estado                             O estado for acessado       explícito por
                    duração e número de
compartilhado                                por múltiplas unidades.     comunicação indireta
                    escritores.
                                                                         igualmente complexa.

                    Definir transições
                                             Estados inválidos           Não modelar
Controlar estado    válidas e
                                             produzirem defeitos         formalmente estados
compartilhado       responsáveis por
                                             relevantes.                 triviais sem benefício.
                    alterá-las.

Melhorar            Preservar contexto ao    A origem puder ser          Não expor
diagnóstico         propagar falhas.         perdida entre fronteiras.   informações sensíveis.

                                             A operação precisar ser     Evitar excesso de
Melhorar            Emitir sinais
                                             acompanhada em              registros sem valor
diagnóstico         orientados a ação.
                                             produção.                   diagnóstico.

                                                                         Não esconder
                    Expor capacidades,       Consumidores não
Preservar                                                                informações
                    não estruturas           precisarem controlar o
fronteiras                                                               necessárias para
                    internas.                mecanismo.
                                                                         decisões legítimas.

                    Validar dados e                                      Evitar validações
                                             Entradas externas
Preservar           invariantes na                                       duplicadas sem
                                             puderem violar regras
fronteiras          fronteira que os                                     responsabilidades
                                             internas.
                    possui.                                              distintas.

---

 Objetivo               Prática recomendada      Aplicar quando               Cuidado

                        Controlar tempo,
                                                                              Não criar mecanismos
                        aleatoriedade,           Esses fatores
                                                                              de substituição mais
 Facilitar testes       ambiente e               influenciarem o
                                                                              complexos que o
                        dependências             resultado.
                                                                              comportamento.
                        externas.

                        Verificar
                        comportamento em         A mudança possuir            Não buscar
 Facilitar testes
                        nível proporcional ao    impacto observável.          isolamento absoluto.
                        risco.

                                                                              Não dividir mudanças
                        Fazer alterações
 Tornar mudanças                                 O risco ou a incerteza       de forma que produza
                        pequenas, reversíveis
 seguras                                         forem relevantes.            estados
                        e observáveis.
                                                                              inconsistentes.

                        Proteger pontos de       O histórico mostrar          Não projetar para
 Tornar mudanças
                        variação                 mudanças frequentes na       todas as possibilidades
 seguras
                        comprovados.             mesma dimensão.              futuras.


5. Antipadrões e sinais de alerta
5.1 Código difícil de explicar
Como identificar: a equipe não consegue resumir o propósito, as entradas, os resultados e os efeitos
sem percorrer detalhes internos.


Risco associado: mudanças incorretas e dependência de autores específicos.


Causa provável: intenção implícita, nomes inadequados, excesso de responsabilidades ou fluxo
fragmentado.


Ação recomendada: explicitar conceitos, reorganizar o fluxo e limitar responsabilidades.


Pode ser aceitável quando: a complexidade for inerente ao domínio e estiver concentrada,
documentada e adequadamente validada.


5.2 Responsabilidades misturadas
Como identificar: uma unidade muda por razões independentes ou utiliza grupos desconectados de
dependências.


Risco associado: regressões e crescimento contínuo.


Causa provável: adição por conveniência, fronteiras indefinidas ou falta de propriedade.

---

Ação recomendada: separar motivos de mudança e definir responsabilidades.


Pode ser aceitável quando: a unidade for um coordenador explícito e não incorporar as regras
internas de cada etapa.


5.3 Dependências ocultas
Como identificar: o comportamento depende de estado, ambiente, ordem ou recursos não visíveis no
contrato.


Risco associado: testes instáveis e falhas difíceis de reproduzir.


Causa provável: acesso global, inicialização implícita ou conveniência local.


Ação recomendada: tornar dependências explícitas e limitar o estado compartilhado.


Pode ser aceitável quando: a dependência fizer parte de uma convenção de infraestrutura estável,
bem documentada e inevitável.


5.4 Efeitos colaterais inesperados
Como identificar: uma operação altera estado externo ou não relacionado sem que isso seja evidente.


Risco associado: corrupção de estado e comportamento imprevisível.


Causa provável: contratos ambíguos, responsabilidades misturadas ou reaproveitamento inadequado.


Ação recomendada: expor, isolar ou remover o efeito.


Pode ser aceitável quando: o efeito fizer parte essencial e reconhecida do contrato.


5.5 Fluxos excessivamente complexos
Como identificar: muitos caminhos, condições combinadas, estados implícitos ou sequências
obrigatórias.


Risco associado: cenários não testados e defeitos em casos extremos.


Causa provável: crescimento incremental sem consolidação ou modelagem inadequada do estado.


Ação recomendada: reduzir caminhos, explicitar estados e separar fases.


Pode ser aceitável quando: o domínio exigir múltiplos cenários e a complexidade estiver centralizada,
observável e testada.

---

5.6 Abstrações prematuras
Como identificar: a abstração possui poucos usos, muitos parâmetros, extensões não utilizadas ou
conceitos vagos.


Risco associado: rigidez e custo de manutenção sem retorno.


Causa provável: antecipação de requisitos ou aplicação automática de padrões.


Ação recomendada: retornar à solução explícita e observar variações reais.


Pode ser aceitável quando: o custo de não preparar a extensão for alto e houver evidência concreta da
necessidade.


5.7 Generalizações frágeis
Como identificar: cada novo caso exige exceção, opção adicional ou conhecimento de detalhes
internos.


Risco associado: abstração difícil de compreender e modificar.


Causa provável: semelhança superficial tratada como conceito comum.


Ação recomendada: dividir os conceitos ou manter implementações independentes.


Pode ser aceitável quando: as exceções forem raras, estáveis e menos custosas que a duplicação
integral.


5.8 Duplicação problemática
Como identificar: a mesma regra precisa ser corrigida ou alterada em vários lugares.


Risco associado: divergência de comportamento.


Causa provável: ausência de propriedade, cópia por conveniência ou fronteiras inadequadas.


Ação recomendada: consolidar a decisão compartilhada.


Pode ser aceitável quando: os trechos possuem significados diferentes ou devem evoluir
separadamente.


5.9 Fragmentação excessiva
Como identificar: uma operação simples exige navegar por muitas unidades sem que cada fronteira
acrescente significado.

---

Risco associado: aumento do custo de compreensão.


Causa provável: interpretação mecânica de regras sobre tamanho ou responsabilidade.


Ação recomendada: reunir partes que sempre são compreendidas e alteradas juntas.


Pode ser aceitável quando: a separação proteger fronteiras, riscos ou dependências relevantes.


5.10 Camadas sem função clara
Como identificar: a camada apenas repassa chamadas, replica contratos ou muda nomes sem
proteger decisões.


Risco associado: indireção e manutenção duplicada.


Causa provável: adoção cerimonial de arquitetura ou preparação para substituições hipotéticas.


Ação recomendada: remover, consolidar ou atribuir responsabilidade real.


Pode ser aceitável quando: a camada estabelecer fronteira organizacional, operacional, de segurança
ou compatibilidade relevante.


5.11 Comentários compensando código confuso
Como identificar: o comentário traduz a implementação ou precisa ser atualizado a cada alteração
estrutural.


Risco associado: divergência entre comentário e comportamento.


Causa provável: nomes ruins, fluxo inadequado ou decisão escondida.


Ação recomendada: melhorar o código e manter apenas contexto não dedutível.


Pode ser aceitável quando: houver restrição externa, motivo histórico ou decisão contraintuitiva que
não possa ser expressa estruturalmente.


5.12 Testes difíceis de escrever ou manter
Como identificar: preparação extensa, muitos detalhes internos, dependências externas para cenários
simples ou instabilidade recorrente.


Risco associado: baixa cobertura útil e resistência a mudanças.


Causa provável: alto acoplamento, estado compartilhado ou fronteiras inadequadas.

---

Ação recomendada: melhorar o design do código e alinhar o nível do teste ao comportamento.


Pode ser aceitável quando: o comportamento só possuir significado em integração e o teste refletir
um cenário real.


5.13 Mudanças simples que exigem alterações em muitos pontos
Como identificar: a mesma mudança conceitual se propaga por unidades sem responsabilidades
próprias sobre ela.


Risco associado: regressões e alto custo de evolução.


Causa provável: regra dispersa, contratos amplos ou estrutura organizada por detalhes técnicos.


Ação recomendada: consolidar a regra e revisar fronteiras.


Pode ser aceitável quando: a mudança for genuinamente transversal e cada ponto possuir uma
responsabilidade distinta.


6. Trade-offs e exceções
Processo de decisão
Quando dois princípios entrarem em conflito:


    1. Defina a decisão concreta;
    2. Identifique os cenários reais afetados;
    3. Diferencie risco atual de possibilidade futura;
    4. Avalie impacto, probabilidade e reversibilidade;
    5. Compare o custo de implementar, manter, testar e operar;
    6. Escolha a opção mais simples que controle os riscos relevantes;
    7. Registre a exceção quando o custo de reversão ou o impacto forem altos;
    8. Defina um gatilho de reavaliação.


Matriz de trade-offs

                      Priorize um lado                                           Critério de
 Conflito                                         Priorize o outro quando
                      quando                                                     desempate

                                                  Existirem variações            Custo total dos
 Simplicidade         As variações forem
                                                  concretas, frequentes e        cenários reais, não
 versus               hipotéticas, raras ou
                                                  custosas de implementar        quantidade de
 flexibilidade        reversíveis.
                                                  separadamente.                 possibilidades.

---

                      Priorize um lado                                         Critério de
 Conflito                                         Priorize o outro quando
                      quando                                                   desempate

                      A forma mais curta
 Clareza versus                                   O contexto tornar a          Tempo e risco de
                      ocultar intenção, efeito
 concisão                                         forma curta inequívoca.      compreensão.
                      ou regra.

                                                  Os consumidores
 Reutilização         O compartilhamento
                                                  possuírem significados       Probabilidade de
 versus               reduzir duplicação de
                                                  ou ritmos de mudança         evolução conjunta.
 acoplamento          uma mesma regra.
                                                  diferentes.

 Abstração                                        A abstração exigir           Se a abstração reduz
                      Houver conceito estável
 versus                                           opções, exceções ou          decisões ou apenas
                      e variação comprovada.
 explicitude                                      navegação adicional.         as desloca.

 Testabilidade        A indireção controlar       A indireção existir apenas   Ganho real de
 versus               uma dependência             para permitir substituição   controle e
 indireção            relevante.                  artificial.                  diagnóstico.

                      Casos equivalentes          Restrições locais            Se a diferença é
 Padronização
                      puderem compartilhar        produzirem necessidades      essencial ou apenas
 versus contexto
                      uma convenção.              diferentes.                  preferência.

 Performance                                      O ganho for especulativo     Evidência de medição
                      A melhoria for medida,
 versus                                           ou irrelevante para o uso    e impacto
                      necessária e relevante.
 legibilidade                                     real.                        operacional.

                                                  O atalho comprometer
 Velocidade           O prazo tiver impacto                                    Custo esperado da
                                                  correção, segurança ou
 versus dívida        real e a dívida puder ser                                dívida e existência de
                                                  capacidade de evolução
 técnica              controlada.                                              plano de contenção.
                                                  próxima.


Critérios para aceitar uma exceção
Uma exceção é justificável quando:


     • Existe uma restrição concreta;
     • O risco de seguir a recomendação é maior que o de excepcioná-la;
     • A alternativa ideal possui custo desproporcional;
     • O impacto está delimitado;
     • A decisão é reversível ou possui plano de migração;
     • A equipe reconhece a dívida criada;
     • Existe um gatilho claro para revisão.

Uma exceção não é justificável apenas porque:


     • É mais rápida no momento;
     • É a preferência do autor;
     • Um padrão conhecido recomenda;
     • “Pode ser necessário no futuro”;
     • O código já está organizado dessa forma;
     • A correção posterior é presumida, mas não registrada.

---

7. Playbook de revisão de código
7.1 Processo de revisão

Etapa 1 — Verificar intenção e contexto

Confirme:


      • Qual problema está sendo resolvido;
      • Qual comportamento deve mudar;
      • O que deve permanecer inalterado;
      • Quais restrições existem;
      • Qual é o risco da mudança;
      • Como o resultado será validado.

Não revise a estrutura sem compreender a intenção.


Etapa 2 — Avaliar clareza

Verifique:


      • Nomes;
      • Fluxo;
      • Contratos;
      • Decisões implícitas;
      • Efeitos colaterais;
      • Casos excepcionais.

Pergunta central: uma pessoa não envolvida na implementação entenderia o comportamento
esperado?


Etapa 3 — Avaliar responsabilidades

Verifique:


      • Onde cada regra foi colocada;
      • Se a unidade possui propósito claro;
      • Se novos comportamentos foram adicionados por conveniência;
      • Se coordenação e execução estão adequadamente delimitadas.

Pergunta central: esta mudança está localizada na fronteira responsável por ela?


Etapa 4 — Avaliar complexidade

Verifique:


      • Caminhos;
      • Condições;
      • Estados;

---

      • Aninhamento;
      • Sequências obrigatórias;
      • Tratamento de casos extremos.

Pergunta central: algum caminho, estado ou conceito pode ser eliminado?


Etapa 5 — Avaliar dependências

Verifique:


      • Novas dependências;
      • Direção arquitetural;
      • Dependências transitivas;
      • Conhecimento de detalhes;
      • Estado compartilhado;
      • Possibilidade de falha externa.

Pergunta central: a unidade conhece apenas o necessário?


Etapa 6 — Avaliar tratamento de erros

Verifique:


      • Falhas esperadas;
      • Propagação;
      • Preservação de contexto;
      • Recuperação;
      • Repetição;
      • Compensação;
      • Observabilidade;
      • Proteção de informações sensíveis.

Pergunta central: o sistema se comportará de forma conhecida quando algo falhar?


Etapa 7 — Avaliar testabilidade

Verifique:


      • Comportamentos cobertos;
      • Cenários relevantes;
      • Controle de dependências;
      • Estabilidade dos testes;
      • Correspondência entre risco e nível de teste;
      • Dependência de detalhes internos.

Pergunta central: os testes demonstram o comportamento e falham por razões úteis?


Etapa 8 — Avaliar impacto arquitetural

Verifique:


      • Fronteiras;

---

      • Contratos;
      • Direção de dependências;
      • Responsabilidades;
      • Compatibilidade;
      • Impacto operacional;
      • Precedentes criados.

Pergunta central: a mudança preserva ou enfraquece decisões arquiteturais relevantes?


Etapa 9 — Avaliar custo de manutenção

Verifique:


      • Facilidade de diagnóstico;
      • Alcance de futuras mudanças;
      • Necessidade de sincronização;
      • Conhecimento especializado;
      • Reversibilidade;
      • Complexidade operacional.

Pergunta central: qual custo permanente está sendo criado para resolver o problema atual?


Etapa 10 — Classificar observações

Todo comentário deve indicar prioridade e razão.


7.2 Categorias de comentário

  Categoria         Quando usar                                         Efeito esperado

                    Há risco relevante de incorreção, segurança,
                                                                        Deve ser resolvido antes da
  Bloqueador        perda de dados, falha operacional, regressão ou
                                                                        aprovação.
                    violação arquitetural grave.

                    Há impacto significativo de manutenção,             Deve ser resolvido ou
  Importante
                    testabilidade, clareza ou evolução.                 explicitamente justificado.

                                                                        O autor decide,
                    Existe alternativa potencialmente melhor, mas a
  Sugestão                                                              considerando o
                    solução atual é aceitável.
                                                                        argumento.

                                                                        Não deve bloquear. Preferir
                    A observação é predominantemente estilística e
  Preferência                                                           convenções
                    não altera risco ou custo de forma relevante.
                                                                        automatizadas.

                                                                        Deve produzir
  Pergunta          Falta contexto ou a intenção não está evidente.     esclarecimento, não
                                                                        pressupor erro.

                    Existe problema conhecido, mas sua correção         Registrar risco,
  Dívida técnica
                    está fora do escopo ou possui custo                 responsável ou gatilho de
  aceita
                    desproporcional.                                    revisão.

---

7.3 Estrutura de um comentário útil
Um comentário de revisão deve conter, quando aplicável:


    1. O que foi observado;
    2. Qual risco ou custo isso cria;
    3. Qual princípio ou critério foi afetado;
    4. Qual resultado seria esperado;
    5. Uma alternativa possível, sem impor solução única quando houver várias.

Evite comentários como:


     • “Não gostei”;
     • “Não está clean”;
     • “Sempre fazemos assim”;
     • “Esse padrão é melhor”;
     • “Isso está feio”;
     • “Pode melhorar”.

Substitua por impactos verificáveis:


     • A intenção está ambígua;
     • A mesma regra aparece em mais de um ponto;
     • A mudança introduz dependência circular;
     • A falha perde o contexto necessário para diagnóstico;
     • O teste depende de detalhe interno irrelevante;
     • A abstração possui apenas um caso concreto e adiciona indireção.


7.4 Como evitar discussões improdutivas
Antes de insistir em uma alteração, classifique a questão:


 Questão                                             Tratamento

 Afeta correção, segurança ou operação               Resolver antes da aprovação.

 Afeta manutenção ou evolução de forma
                                                     Discutir com evidências e contexto.
 relevante

 Contraria convenção documentada                     Aplicar a convenção ou justificar exceção.

 Possui várias alternativas equivalentes             O autor escolhe.

 É apenas preferência estética                       Não bloquear.

 Pode ser automatizada                               Retirar da revisão humana.

                                                     Retirar da revisão local e tratar no fórum
 Exige decisão arquitetural mais ampla
                                                     apropriado.

---

8. Playbook de refatoração
8.1 Processo seguro

1. Identificar o problema

Descreva o problema em termos de impacto:


     • Dificuldade de compreensão;
     • Alto risco de regressão;
     • Mudanças repetitivas;
     • Testes instáveis;
     • Dependência excessiva;
     • Falhas difíceis de diagnosticar;
     • Complexidade desproporcional.

Não use “o código está feio” como justificativa.


2. Confirmar o comportamento atual

Determine:


     • Quais comportamentos são intencionais;
     • Quais são acidentais;
     • Quais consumidores dependem deles;
     • Quais efeitos e falhas existem;
     • Quais casos extremos precisam ser preservados.

Quando o comportamento atual não estiver claro, crie meios de caracterizá-lo antes de reestruturar.


3. Avaliar o risco

Considere:


     • Criticidade;
     • Alcance;
     • Frequência de uso;
     • Qualidade dos testes;
     • Observabilidade;
     • Facilidade de reversão;
     • Conhecimento disponível;
     • Dependências externas.

4. Limitar o escopo

Defina:


     • O que será melhorado;
     • O que não será alterado;
     • Quais comportamentos devem permanecer;

---

      • Qual melhoria será considerada suficiente;
      • Quais problemas serão registrados para depois.

5. Fazer mudanças pequenas

Prefira alterações:


      • Independentes;
      • Revisáveis;
      • Reversíveis;
      • Com propósito único;
      • Validadas a cada etapa.

Não divida artificialmente quando estados intermediários forem inválidos.


6. Validar o comportamento

Utilize evidências proporcionais ao risco:


      • Testes;
      • Comparação de resultados;
      • Verificação de contratos;
      • Observação operacional;
      • Validação manual controlada;
      • Análise de consumidores afetados.

7. Medir a melhoria

A refatoração deve reduzir pelo menos um custo observável:


      • Menos caminhos;
      • Menos pontos de alteração;
      • Menos dependências;
      • Contratos menores;
      • Melhor isolamento;
      • Testes mais estáveis;
      • Diagnóstico mais direto;
      • Menor risco de mudança.

8. Registrar decisões relevantes

Registre quando houver:


      • Alteração arquitetural;
      • Exceção;
      • Compatibilidade temporária;
      • Migração gradual;
      • Dívida remanescente;
      • Decisão difícil de reverter.

---

9. Interromper quando o custo superar o benefício

Pare quando:


     • O problema original estiver controlado;
     • A melhoria adicional for predominantemente estética;
     • O risco crescer sem benefício proporcional;
     • A refatoração começar a expandir o escopo indefinidamente;
     • O retorno depender de necessidades ainda hipotéticas.


8.2 Tipos de mudança

 Tipo              Definição                       Quando utilizar            Cuidado principal

                   Reestruturação exigida para
                                                   O design atual impedir     Limitar ao necessário
 Refatoração       reduzir risco imediato ou
                                                   ou tornar perigosa a       para viabilizar o
 necessária        permitir uma mudança
                                                   alteração.                 objetivo.
                   segura.

                                                   O problema estiver
                   Pequena melhoria realizada                                 Não ampliar
 Refatoração                                       próximo, for
                   durante uma mudança                                        significativamente o
 oportunista                                       compreendido e
                   relacionada.                                               escopo.
                                                   possuir baixo risco.

                                                   O comportamento
                                                                              Alto risco de perda de
                   Substituição substancial da     puder ser
 Reescrita                                                                    conhecimento e
                   implementação existente.        caracterizado e a
                                                                              regressão.
                                                   migração controlada.

                   Alteração                       Quando automatizada
                                                                              Não misturar com
 Melhoria          predominantemente               ou incluída em
                                                                              mudanças funcionais
 cosmética         estética, sem redução           manutenção
                                                                              amplas.
                   relevante de custo ou risco.    localizada.

                   Alteração de fronteiras,
                                                   O benefício justificar o   Exigir decisão
 Mudança           contratos, dependências ou
                                                   impacto e o custo de       explícita, plano e
 arquitetural      responsabilidades
                                                   migração.                  acompanhamento.
                   sistêmicas.


8.3 Condições mínimas para uma reescrita
Uma reescrita deve possuir:


     • Problema claramente delimitado;
     • Comportamento atual caracterizado;
     • Estratégia de migração;
     • Compatibilidade definida;
     • Critérios de equivalência;
     • Plano de reversão;
     • Observabilidade;
     • Marcos incrementais;
     • Responsável pela transição;

---

      • Critério objetivo para encerrar o sistema anterior.

“Começar do zero será mais fácil” não é justificativa suficiente.


9. Critérios de aceitação
Uma mudança é aceitável quando, considerando seu contexto e risco:


      • [ ] A intenção está clara;
      • [ ] O comportamento esperado está definido;
      • [ ] A complexidade é proporcional ao problema;
      • [ ] As responsabilidades estão bem delimitadas;
      • [ ] As dependências são necessárias e explícitas;
      • [ ] As fronteiras arquiteturais relevantes foram preservadas;
      • [ ] Os efeitos colaterais estão visíveis e controlados;
      • [ ] As falhas são tratadas ou propagadas de forma previsível;
      • [ ] O comportamento pode ser validado;
      • [ ] Os testes são proporcionais ao risco;
      • [ ] A mudança não cria acoplamento desnecessário;
      • [ ] Regras compartilhadas não foram duplicadas indevidamente;
      • [ ] Abstrações introduzidas possuem necessidade concreta;
      • [ ] O diagnóstico operacional é possível;
      • [ ] O custo futuro de alteração é aceitável;
      • [ ] Exceções estão justificadas;
      • [ ] Dívidas técnicas criadas estão registradas;
      • [ ] O escopo não contém alterações não relacionadas sem justificativa;
      • [ ] A mudança pode ser revertida ou possui estratégia de recuperação;
      • [ ] Não existem observações bloqueadoras pendentes.

Nem todos os critérios precisam ser aplicáveis a todas as mudanças. Itens não aplicáveis devem ser
marcados como tal, não ignorados silenciosamente.


10. Checklist operacional
Use as colunas Sim, Não e Não se aplica. Para qualquer resposta “Não”, registre a ação necessária ou a
justificativa da exceção.


10.1 Clareza

                                                                             Não se    Evidência ou
  Verificação                                                 Sim   Não
                                                                              aplica   ação

  A finalidade da mudança está explícita?

  O comportamento pode ser resumido sem
  reconstruir detalhes internos?

---

                                                                              Não se      Evidência ou
 Verificação                                                  Sim   Não
                                                                               aplica     ação

 Entradas, resultados e efeitos relevantes estão
 claros?

 As decisões importantes estão localizáveis?

 Casos excepcionais estão identificados?


10.2 Nomes

                                                                             Não se      Evidência ou
 Verificação                                              Sim       Não
                                                                              aplica     ação

 Os nomes representam propósito ou significado?

 Termos iguais possuem o mesmo significado?

 Termos diferentes representam conceitos
 diferentes?

 Abreviações e nomes genéricos foram evitados
 quando ambíguos?

 O vocabulário está consistente com o domínio e a
 equipe?


10.3 Responsabilidades

                                                                              Não se      Evidência ou
 Verificação                                                  Sim     Não
                                                                               aplica     ação

 Cada unidade possui propósito identificável?

 Comportamentos relacionados estão próximos?

 Motivos independentes de mudança estão
 separados quando necessário?

 Coordenação e execução estão adequadamente
 delimitadas?

 O comportamento foi colocado na fronteira
 responsável?


10.4 Complexidade

                                                                            Não se      Evidência ou
 Verificação                                            Sim     Não
                                                                             aplica     ação

 O número de caminhos é proporcional ao
 problema?

---

                                                                         Não se     Evidência ou
 Verificação                                              Sim     Não
                                                                          aplica    ação

 Condições representam conceitos
 compreensíveis?

 Estados e transições relevantes estão explícitos?

 Casos especiais estão limitados?

 Complexidade acidental foi removida?

 A complexidade inevitável está concentrada?


10.5 Duplicação

                                                                          Não se     Evidência ou
 Verificação                                               Sim     Não
                                                                           aplica    ação

 Cada regra importante possui fonte identificável?

 Repetições que precisam mudar juntas foram
 consolidadas?

 Semelhanças superficiais não foram abstraídas
 indevidamente?

 A duplicação mantida possui justificativa
 conceitual?


10.6 Abstrações

                                                                          Não se    Evidência ou
 Verificação                                               Sim     Não
                                                                           aplica   ação

 Cada abstração representa um conceito ou
 variação real?

 O contrato é menor e mais estável que os
 detalhes ocultados?

 A abstração reduz decisões ou duplicação
 significativa?

 Não existem extensões sem uso concreto?

 A explicitude não seria mais simples?


10.7 Dependências

                                                                          Não se     Evidência ou
 Verificação                                                Sim    Não
                                                                           aplica    ação

 As dependências necessárias estão explícitas?

---

                                                                      Não se     Evidência ou
 Verificação                                           Sim     Não
                                                                       aplica    ação

 A direção das dependências está correta?

 Dependências transitivas estão controladas?

 Não foram expostos detalhes internos
 desnecessários?

 Dependências externas possuem tratamento de
 falha adequado?


10.8 Coesão e acoplamento

                                                                      Não se     Evidência ou
 Verificação                                            Sim    Não
                                                                       aplica    ação

 Elementos que mudam juntos estão agrupados?

 Unidades independentes podem evoluir sem
 coordenação excessiva?

 Contratos são proporcionais às necessidades dos
 consumidores?

 Estado compartilhado foi minimizado?

 Não existem dependências circulares ou implícitas?


10.9 Tratamento de erros

                                                                     Não se     Evidência ou
 Verificação                                          Sim     Não
                                                                      aplica    ação

 Falhas esperadas foram identificadas?

 O responsável por tratar cada falha está
 definido?

 O contexto necessário é preservado?

 Recuperações e repetições são limitadas e
 observáveis?

 Falhas não são ignoradas silenciosamente?

 Informações sensíveis estão protegidas?

---

10.10 Comentários

                                                                      Não se    Evidência ou
 Verificação                                             Sim    Não
                                                                       aplica   ação

 Comentários explicam contexto ou decisão, não
 apenas comportamento?

 Comentários permanecem válidos após alterações
 estruturais?

 Código confuso não está sendo compensado apenas
 com comentários?

 Restrições externas relevantes estão registradas?

 Dívidas e soluções temporárias possuem contexto
 suficiente?


10.11 Testabilidade

                                                                      Não se    Evidência ou
 Verificação                                            Sim    Não
                                                                       aplica   ação

 Comportamentos relevantes podem ser
 controlados e observados?

 Dependências não determinísticas estão
 controladas?

 Os testes verificam contratos e resultados
 relevantes?

 Os testes evitam dependência desnecessária de
 detalhes internos?

 O nível dos testes corresponde ao risco?

 Os testes falham por razões úteis e
 diagnosticáveis?


10.12 Arquitetura

                                                                      Não se    Evidência ou
 Verificação                                            Sim    Não
                                                                       aplica   ação

 A mudança respeita as fronteiras existentes?

 A responsabilidade permanece em sua área
 proprietária?

 Novos contratos são necessários e sustentáveis?

---

                                                                        Não se     Evidência ou
 Verificação                                            Sim     Não
                                                                         aplica    ação

 A decisão evita precedentes arquiteturais
 indesejados?

 Exceções arquiteturais foram registradas?

 A arquitetura documentada ainda corresponde ao
 sistema real?


10.13 Operação

                                                                         Não se     Evidência ou
 Verificação                                              Sim     Não
                                                                          aplica    ação

 É possível detectar falhas relevantes?

 Existe contexto suficiente para diagnóstico?

 Estados degradados são identificáveis?

 A mudança possui estratégia de implantação e
 reversão proporcional ao risco?

 Repetições, recuperações e compensações são
 observáveis?

 O volume de sinais evita tanto ausência quanto ruído
 excessivo?


10.14 Facilidade de mudança

                                                                        Não se     Evidência ou
 Verificação                                            Sim     Não
                                                                         aplica    ação

 Uma futura alteração semelhante ficará
 localizada?

 Pontos de variação refletem necessidades reais?

 Regras voláteis não foram espalhadas?

 A mudança pode ser revertida ou substituída?

 O custo permanente criado é proporcional ao
 benefício?

 Não houve preparação excessiva para cenários
 hipotéticos?

---

11. Matriz de decisão
                                                  Ação
Situação            Risco            Impacto                          Exceção aceitável      Prioridade
                                                  recomendada

                                                                      Escopo
Nome admite                          Local        Renomear
                                                                      extremamente
múltiplas           Uso incorreto    ou           conforme                                   Importante
                                                                      restrito e convenção
interpretações                       amplo        propósito
                                                                      evidente

Operação possui                                                       Efeito for parte       Bloqueador
                    Comportamento                 Expor ou isolar
efeitos não                          Amplo                            reconhecida do         ou
                    inesperado                    efeitos
explícitos                                                            contrato               importante

Unidade acumula                                   Separar por         Coordenação
                    Regressão e      Médio a
responsabilidades                                 motivo de           explícita sem          Importante
                    crescimento      amplo
independentes                                     mudança             incorporar regras

Mudança simples
                                                  Consolidar regra    Mudança
exige muitos
                    Divergência      Amplo        ou revisar          genuinamente           Importante
pontos de
                                                  fronteira           transversal
alteração

Regra relevante                      Médio a      Criar fonte única   Contextos evoluem
                    Inconsistência                                                           Importante
está duplicada                       amplo        apropriada          independentemente

Trechos
semelhantes                                                           Compartilhamento
                    Abstração                     Manter
possuem                              Médio                            apenas de              Sugestão
                    inadequada                    separados
significados                                                          mecanismo estável
diferentes

Abstração possui                                                      Alto custo
                                                                                             Sugestão
um único caso e     Complexidade     Local a      Simplificar ou      comprovado de
                                                                                             ou
nenhuma             sem retorno      médio        remover             introdução
                                                                                             importante
variação concreta                                                     posterior

Abstração exige
opções e            Generalização    Médio a                          Exceções raras e
                                                  Dividir conceitos                          Importante
exceções            frágil           amplo                            estáveis
crescentes

Dependência é       Testes e                                          Infraestrutura
                                     Médio a
acessada            operação                      Tornar explícita    inevitável e bem       Importante
                                     amplo
implicitamente      imprevisíveis                                     controlada

Dependência                                       Redesenhar          Exceção temporária
                    Evolução
circular é                           Amplo        direção ou          com plano de           Bloqueador
                    bloqueada
introduzida                                       contrato            remoção

Componente                                                            Consumidor
                                                  Reduzir contrato
expõe detalhes      Acoplamento      Médio                            legítimo precisa do    Importante
                                                  e encapsular
internos                                                              detalhe

---

                                                   Ação
Situação           Risco              Impacto                           Exceção aceitável    Prioridade
                                                   recomendada

Estado                                             Reduzir
                                                                        Coordenação          Bloqueador
compartilhado      Corridas e                      escritores e
                                      Amplo                             externa segura e     ou
possui vários      inconsistência                  definir
                                                                        observável           importante
escritores                                         transições

                                                   Tratar, propagar     Falha
Falha é ignorada   Perda de           Médio a
                                                   ou registrar         comprovadamente      Bloqueador
silenciosamente    integridade        crítico
                                                   adequadamente        irrelevante

Falha perde                                                             Contexto contém
                   Diagnóstico                     Preservar
contexto durante                      Médio                             dados sensíveis e    Importante
                   difícil                         contexto útil
propagação                                                              deve ser filtrado

Recuperação
                   Degradação         Médio a      Emitir sinais e      Operação trivial e
automática não é                                                                             Importante
                   oculta             amplo        limitar tentativas   sem impacto
observável

                                                   Melhorar
Comentário
                   Divergência                     estrutura e          Restrição externa
apenas traduz                         Local                                                  Sugestão
                   futura                          remover              não representável
código confuso
                                                   redundância

Teste depende de                                   Testar contrato      Detalhe constitui
                   Fragilidade        Médio                                                  Importante
detalhe interno                                    observável           parte do contrato

Teste pequeno                                      Revisar              Comportamento só
                   Custo e
exige ambiente                        Médio        fronteiras ou        existe em            Importante
                   instabilidade
amplo                                              nível do teste       integração

Alteração                                                               Separação produzir
estrutural está                       Médio a      Separar quando       estado
                   Revisão difícil                                                           Importante
misturada com                         amplo        seguro               intermediário
correção crítica                                                        inválido

                                                   Manter solução       Restrição            Sugestão
Otimização não     Complexidade
                                      Médio        clara e medir        comprovada por       ou
possui medição     especulativa
                                                   antes                limite externo       importante

                                                                        Fronteira
Nova camada                                        Remover ou
                                      Local a                           organizacional ou
apenas repassa     Indireção                       atribuir                                  Sugestão
                                      médio                             de compatibilidade
operações                                          responsabilidade
                                                                        real

Solução                                            Documentar
                                                                        Impacto trivial e
temporária não     Dívida invisível   Médio        risco e gatilho de                        Importante
                                                                        local
possui registro                                    revisão

Mudança
                                                   Reposicionar ou                           Bloqueador
atravessa          Erosão da                                            Migração planejada
                                      Amplo        aprovar exceção                           ou
fronteira          arquitetura                                          e temporária
                                                   explícita                                 importante
arquitetural

---

                                                         Ação
 Situação             Risco               Impacto                           Exceção aceitável      Prioridade
                                                         recomendada

 Reescrita é                                                                Componente
                                                         Interromper e
 proposta sem         Regressão e                                           descartável e sem
                                          Crítico        caracterizar                              Bloqueador
 caracterização do    atraso                                                consumidores
                                                         primeiro
 comportamento                                                              relevantes

                                                                            Convenção ainda
 Discussão trata                                         Seguir
                      Desperdício de                                        não definida e
 apenas de gosto                          Local          convenção ou                              Preferência
                      tempo                                                 precisa ser
 pessoal                                                 decisão do autor
                                                                            estabelecida

                                                                            Não se aplica: a
 Complexidade é                                          Centralizar,
                      Simplificação                                         complexidade deve
 alta, mas inerente                       Amplo          documentar e                              Importante
                      incorreta                                             ser controlada, não
 ao domínio                                              testar
                                                                            negada

 Solução direta                                                             Introduzir fronteira
                      Indireção                          Manter solução
 cria acoplamento                         Local                             quando surgir          Sugestão
                      desnecessária                      direta
 simples e estável                                                          variação real

                                                                            Nunca para
                                                         Delimitar,
 Prazo exige dívida                                                         comprometer            Decisão
                      Custo futuro        Variável       registrar e
 técnica                                                                    correção ou            contextual
                                                         definir gatilho
                                                                            segurança


12. Adoção pela equipe
12.1 Introdução gradual
Não aplique todo o playbook como exigência imediata.


Sequência recomendada:


    1. Adotar categorias de comentários de revisão;
    2. Definir critérios mínimos de aceitação;
    3. Utilizar o checklist apenas em mudanças de maior risco;
    4. Identificar os problemas recorrentes da equipe;
    5. Selecionar poucas orientações prioritárias;
    6. Registrar exceções relevantes;
    7. Incorporar padrões comprovadamente úteis;
    8. Revisar o processo após um período de uso.

Comece pelos critérios que reduzem defeitos, retrabalho e tempo de diagnóstico.

---

12.2 Adaptação ao contexto
A equipe deve definir:


      • Quais mudanças exigem checklist completo;
      • Quais critérios são obrigatórios;
      • Quais riscos justificam revisão especializada;
      • Quais decisões exigem registro;
      • Quais convenções podem ser automatizadas;
      • Quais exceções são comuns e aceitáveis;
      • Quais fronteiras arquiteturais devem ser protegidas.

Não remova princípios apenas porque são difíceis de aplicar. Adapte a forma de aplicação.


12.3 Registro de exceções
Registre exceções quando houver impacto relevante ou precedente.


Formato recomendado:


                   Campo                          Conteúdo

                   Decisão                        O que foi escolhido

                   Orientação excepcionada        Qual critério não foi seguido

                   Contexto                       Restrição ou necessidade concreta

                   Risco aceito                   Consequência possível

                   Mitigação                      Como o risco será controlado

                   Escopo                         Onde a exceção se aplica

                   Gatilho de revisão             Quando a decisão deverá ser reavaliada

                   Responsável                    Quem acompanha a decisão

Evite criar registros para decisões triviais e reversíveis.


12.4 Prevenção do uso dogmático
A equipe não deve:


      • Aplicar métricas como metas isoladas;
      • Exigir tamanhos máximos universais;
      • Bloquear mudanças por preferências;
      • Criar abstrações apenas para seguir padrões;
      • Fragmentar código para satisfazer regras numéricas;
      • Tratar toda duplicação como defeito;
      • Considerar indireção sinônimo de arquitetura;
      • Confundir consistência com imutabilidade;
      • Usar “Clean Code” como argumento sem indicar impacto;

---

     • Refatorar áreas estáveis sem benefício identificável.

Toda exigência deve estar ligada a risco, custo ou comportamento observável.


12.5 Revisão do próprio playbook
Revise o playbook quando:


     • Discussões recorrentes não forem resolvidas pelos critérios atuais;
     • Exceções se tornarem frequentes;
     • Regras forem sistematicamente ignoradas;
     • Novos riscos operacionais surgirem;
     • A arquitetura ou o modo de trabalho mudar;
     • Orientações produzirem burocracia sem benefício;
     • Práticas internas demonstrarem resultados melhores.

Durante a revisão:


    1. Remova recomendações sem utilidade demonstrada;
    2. Reescreva critérios ambíguos;
    3. Transforme recorrências comprovadas em padrões internos;
    4. Rebaixe preferências tratadas como regras;
    5. Atualize exemplos organizacionais e critérios de risco;
    6. Preserve o núcleo de princípios gerais.


12.6 Transformação de recorrências em padrões internos
Uma prática pode se tornar padrão interno quando:


     • O problema ocorre repetidamente;
     • A solução foi aplicada em múltiplos contextos;
     • O benefício é observável;
     • As limitações são conhecidas;
     • A equipe compreende quando não aplicar;
     • O padrão reduz decisões repetitivas;
     • O custo de manutenção é aceitável.

Documente o padrão com:


     • Problema;
     • Contexto;
     • Solução;
     • Limitações;
     • Exceções;
     • Consequências;
     • Sinais de uso inadequado.

---

12.7 Acompanhamento sem métricas artificiais
Não avalie qualidade apenas por:


     • Quantidade de arquivos;
     • Tamanho médio de funções;
     • Número de abstrações;
     • Cobertura isolada;
     • Quantidade de comentários;
     • Número de padrões adotados;
     • Pontuação genérica de complexidade;
     • Volume de refatorações.

Observe tendências relacionadas ao trabalho real:


     • Tempo para compreender mudanças;
     • Frequência de regressões;
     • Alcance médio das alterações;
     • Instabilidade dos testes;
     • Tempo de diagnóstico;
     • Incidentes causados por comportamento imprevisível;
     • Repetição de comentários em revisão;
     • Frequência de exceções arquiteturais;
     • Áreas que concentram medo ou dependência individual;
     • Dívidas que afetam entregas repetidamente.

Esses sinais devem orientar investigação, não produzir metas automáticas.


Regra final
Antes de adicionar uma nova estrutura, abstração, camada, dependência ou padrão, responda:


    1. Qual problema concreto isso resolve?
    2. Qual risco reduz?
    3. Qual custo permanente cria?
    4. Existe uma solução mais direta?
    5. A necessidade já existe ou é apenas prevista?
    6. Como saberemos se a decisão foi correta?
    7. Como a decisão poderá ser revertida?

Quando essas respostas não forem claras, prefira adiar a complexidade.


O código mais sustentável não é o que demonstra maior sofisticação. É o que permite que a equipe
compreenda o comportamento, altere-o com segurança, identifique falhas e continue evoluindo o
sistema sem depender de conhecimento implícito ou esforço desproporcional.
