import { type RepositoryEnvironment, type Environment, type ServerConfigName, type GlobalConfig, type RepositoryConfigName, type Servers, type Repository, type RepositorySecrets } from '../types/app'
import type Versioner from './versioner'

class Configurator {
  constructor (private readonly versioner: Versioner) {
    this.versioner = versioner
  }

  getRepositories (): string[] {
    const { repositories } = this.versioner.getParsedContent()
    return Object.keys(repositories)
  }

  getRepository (repository: string): Repository {
    const { repositories } = this.versioner.getParsedContent()
    return repositories[repository]
  }

  getRepositoryEnvironment (repository: string, environment: Environment): RepositoryEnvironment {
    const environments = this.getRepository(repository)
    return environments.environments[environment]
  }

  getRepositoryConfig (repository: string, environment: Environment, configName: RepositoryConfigName): string | Record<string, string> {
    const config = this.getRepositoryEnvironment(repository, environment)
    return config[configName]
  }

  getRepositorySecrets (repository: string, environment: Environment): Record<string, string> {
    const secrets = this.getRepositoryConfig(repository, environment, 'secrets') as Record<string, string>
    return secrets
  }

  getRepositoryVars (repository: string, environment: Environment): Record<string, string> {
    const vars = this.getRepositoryConfig(repository, environment, 'vars') as Record<string, string>
    return vars
  }

  getRepositoryServerName (repository: string, environment: Environment): string {
    const { server } = this.getRepositoryEnvironment(repository, environment)
    return server
  }

  getServers (): Servers {
    const { servers } = this.versioner.getParsedContent()
    return servers
  }

  getServerNames (environment: Environment): string[] {
    const servers = this.getServers()
    return Object.keys(servers)
  }

  getServerConfigs (environment: Environment, serverName: string): Record<ServerConfigName, string> {
    const servers = this.getServers()
    const values = servers[environment][serverName]
    const sufixedValues: Record<string, string> = {}
    Object.keys(values).forEach(key => {
      sufixedValues[`${key}_${serverName}`] = values[key as ServerConfigName]
    })
    return sufixedValues
  }

  getServerConfigValue (environment: Environment, serverName: string, configName: ServerConfigName): string {
    const servers = this.getServerConfigs(environment, serverName)
    return servers[configName]
  }

  getGlobalConfigs (): GlobalConfig {
    const { configs } = this.versioner.getParsedContent()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs.global
  }

  getGlobalValues (environment: Environment): RepositorySecrets {
    const configs = this.getGlobalConfigs()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs[environment]
  }

  getGlobalEnvironmentSecrets (environment: Environment): Record<string, string> {
    const configs = this.getGlobalConfigs()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs[environment].secrets
  }

  getGlobalEnvironmentVars (environment: Environment): Record<string, string> {
    const configs = this.getGlobalConfigs()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs[environment].vars
  }

  getGlobalCommonSecrets (): Record<string, string> {
    const configs = this.getGlobalConfigs()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs.all.secrets
  }

  getGlobalCommonVars (): Record<string, string> {
    const configs = this.getGlobalConfigs()
    if (configs == null) {
      throw new Error('Configs is null')
    }
    return configs.all.vars
  }
}

export default Configurator
