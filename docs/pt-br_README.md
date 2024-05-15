# Automatização de Configurações de Ambiente para GitHub

Este projeto oferece uma solução para automatizar a criação e gerenciamento de configurações de ambiente no GitHub, incluindo variáveis de ambiente e secrets. Com base em um arquivo JSON de configuração (`config.json`), o sistema cria e atualiza automaticamente as configurações necessárias nos repositórios do GitHub.

## Motivação

A necessidade de automatizar a configuração de ambientes no GitHub surge da limitação das contas pessoais em configurar variáveis e secrets globais para os workflows de pipelines. O GitHub permite que apenas GitHub Organizations configurem tais variáveis globais, e mesmo assim, apenas para repositórios públicos, para privados apenas em planos pagos. Isso cria um obstáculo significativo para desenvolvedores e equipes que desejam configurar repositórios privados com pipelines automatizados.

Sem uma solução automatizada, os usuários são obrigados a configurar manualmente variáveis e secrets para cada repositório individualmente, o que pode ser trabalhoso e propenso a erros, especialmente em ambientes com muitos repositórios.

Este projeto visa preencher essa lacuna, fornecendo uma ferramenta que automatiza a criação e gerenciamento de configurações de ambiente no GitHub, permitindo que os usuários configurem facilmente variáveis e secrets em múltiplos repositórios de forma consistente e eficiente.

## Visão Geral

A aplicação lê o arquivo `config.json` na raiz do projeto e utiliza suas informações para configurar variáveis de ambiente e secrets em repositórios do GitHub. O arquivo `config.json` segue um formato específico para definir servidores, configurações globais e configurações por repositório e ambiente.

### Formato do `config.json`

O `config.json` segue a estrutura abaixo:

```json
{
    "servers": { ... },
    "configs": { ... },
    "repositories": { ... }
}
```

- **servers**: Define configurações de servidores.
- **configs**: Define configurações globais.
- **repositories**: Define configurações por repositório.

Para mais detalhes sobre a estrutura do `config.json`, consulte o arquivo de exemplo fornecido no projeto (`config.example.json`).

## Features

A tabela abaixo lista as features implementadas e em desenvolvimento:

| Feature                                         | Status                     |
| ----------------------------------------------- | -------------------------- |
| Criação automática de ambientes no GitHub       | :heavy_check_mark:         |
| Criação de variáveis de ambiente                | :heavy_check_mark:         |
| Criação de secrets                               | :heavy_check_mark:         |
| Atualização de valores das configurações        | :heavy_check_mark:         |
| Versionamento de configurações                  | :construction:             |
| Detecção e aplicação de mudanças                | :construction:             |
| Mais funcionalidades a serem definidas          | :construction:             |

## Como Usar

Para utilizar esta aplicação, siga estas etapas:

1. Clone este repositório para o seu ambiente local.
2. Certifique-se de ter o Node.js instalado.
3. Instale as dependências do projeto
4. Adicione as configurações de variáveis de ambiente.
5. Edite o arquivo `config.json` conforme necessário.
6. Execute o script de execução da aplicação.
7. Verifique os repositórios no GitHub para confirmar as configurações.

### Instalando as dependências

Para instalar as dependências do projeto, utilize o seguinte comando:

```bash
npm install

# Ou se preferir:

yarn install
```

### Executando a Aplicação

Para executar a aplicação, utilize o seguinte comando:

```bash
npm start

# Ou se preferir:

yarn start
```

## Contribuindo

Contribuições são bem-vindas! Se você deseja contribuir com este projeto, siga estas etapas:

1. Faça um fork deste repositório.
2. Crie uma nova branch para a sua funcionalidade (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova feature'`).
4. Faça push para a branch (`git push origin feature/nova-feature`).
5. Abra um Pull Request.

## Autores

- [Lucas Gulart](https://github.com/tridentinho) - Desenvolvedor Principal

## Licença

Este projeto está licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.