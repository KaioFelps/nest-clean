# Domínio
Abrange as entidades e os services, as partes mais puras da nossa aplicação.

Nós descobrimos nossos services (use cases) e entidades através de conversas com os experts de domínio.

# Entidades
É tudo que se pode entender como algo a ser mantido pela aplicação. Elas traduzem as partes das aplicações em código.

## Value objects
- São propriedades das entidades que possuem regras de negócio e, portanto, são quase tão complexas quanto entidades.
- Exemplo: validação ou transformação de um título para um slug, que não pode ter acentos, espaços, máximo de tamanho, etc...
- Ficam dentro de um diretório value-objects que fica dentro do diretório de entidades
- Nem tudo pode ser um value-object. Apenas viram value-objects propriedades que são muito complexas e contam com muito código para funcionarem. Que são muito importantes e deviam ser reaproveitáveis.

# Services (use cases)
São pedaços de código que realizam ações independente de qualquer dependência e desconectada do alheio à aplicação.

---

# Subdomínios
São as repartições/setores do problema; aplicação num contexto geral; é como repartimos os problemas em pequenas partes da aplicação.

Tudo que toca o problema que a gente está resolvendo pode ser um subdomínio

- application -> partes relacionadas ao código, à aplicação
- enterprise -> regras de negócio, a camada dos experts de domínios

São, geralmente, dividido em três tipos:
- **Core domains** -> o que dá dinheiro; tudo que envolve dinheiro; tudo que é super importante e não pode parar nem ser terceirizado
- **Supporting domains** -> é aquilo que dá suporte para o funcionamento do core
- **Generic domains** -> são os subdomínios que não são tão necessários/importantes; poderiam ser facilmente substituídos por serviços terceirizados

## Exemplo: e-commerce
**Core**
- compra
- catálogo
- pagamento
- entrega

**Supporting**
- estoque

**Generic**
- notificação ao cliente
- promoções
- chat

Os subdomínios também precisam ser independentes, isto é, eles não podem "se chamar". Ao invés disso, é preciso fornecer um meio de comunicação entre os subdomínios sem que eles dependam um no outro, deixando-os sempre desacoplados.

### Fluxo de eventos de domínio
![diagrama do fluxo de eventos de domínio](/public/subdomain-events.png)