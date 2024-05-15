# GitHub Environment Configuration Automation

For the [Portuguese Version](./docs/pt-br_README.md) of this README, click here.

This project offers a solution to automate the creation and management of environment configurations on GitHub, including environment variables and secrets. Based on a JSON configuration file (`config.json`), the system automatically creates and updates the necessary configurations in GitHub repositories.

## Motivation

The need to automate environment configuration on GitHub arises from the limitation of personal accounts in setting global variables and secrets for pipeline workflows. GitHub allows only GitHub Organizations to configure such global variables, and even then, only for public repositories, for private ones only on paid plans. This creates a significant obstacle for developers and teams who want to set up private repositories with automated pipelines.

Without an automated solution, users are required to manually configure variables and secrets for each individual repository, which can be cumbersome and error-prone, especially in environments with many repositories.

This project aims to fill this gap by providing a tool that automates the creation and management of environment configurations on GitHub, allowing users to easily configure variables and secrets across multiple repositories consistently and efficiently.

## Overview

The application reads the `config.json` file at the root of the project and uses its information to configure environment variables and secrets in GitHub repositories. The `config.json` file follows a specific format to define servers, global configurations, and per-repository and per-environment configurations.

### `config.json` Format

The `config.json` follows the structure below:

```json
{
    "servers": { ... },
    "configs": { ... },
    "repositories": { ... }
}
```

- **servers**: Defines server configurations.
- **configs**: Defines global configurations.
- **repositories**: Defines per-repository configurations.

For more details on the `config.json` structure, refer to the example file provided in the project (`config.example.json`).

## Features

The table below lists the implemented and in-development features:

| Feature                                       | Status                 |
| --------------------------------------------- | ---------------------- |
| Automatic creation of environments on GitHub  | :heavy_check_mark:     |
| Creation of environment variables             | :heavy_check_mark:     |
| Creation of secrets                            | :heavy_check_mark:     |
| Update configuration values                   | :heavy_check_mark:     |
| Configuration versioning                      | :construction:         |
| Detection and application of changes          | :construction:         |
| More functionalities to be defined            | :construction:         |

## How to Use

To use this application, follow these steps:

1. Clone este repositório para o seu ambiente local.
2. Certifique-se de ter o Node.js instalado.
3. Instale as dependências do projeto
4. Adicione as configurações de variáveis de ambiente.
5. Edite o arquivo `config.json` conforme necessário.
6. Execute o script de execução da aplicação.
7. Verifique os repositórios no GitHub para confirmar as configurações.

1. Clone this repository to your local environment.
2. Make sure you have Node.js installed.
3. Install the project dependencies.
4. Add the environment variable configurations.
5. Edit the `config.json` file as needed.
6. Run the application execution script.
7. Check the repositories on GitHub to confirm the configurations.

### Installing Dependencies

To install the project dependencies, use the following command:

```bash
npm install

# Or if you prefer:

yarn install
```

### Running the Application
To run the application, use the following command:

```bash
npm start

# Or if you prefer:

yarn start
```

## Contributing
Contributions are welcome! If you want to contribute to this project, follow these steps:

1. Fork this repository.
2. Create a new branch for your feature (`git checkout -b feature/nova-feature`).
3. Commit your changes (`git commit -am 'Adiciona nova feature'`).
4. Push to the branch (`git push origin feature/nova-feature`).
5. Open a Pull Request.

## Authors

- [Lucas Gulart](https://github.com/tridentinho) - Lead Developer

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.