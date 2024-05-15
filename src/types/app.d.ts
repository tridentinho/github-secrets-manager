type Environment = 'staging' | 'production'

export interface GithubConfig {
  servers: Servers
  configs: Configs
  repositories: Repositories
}

export type ServerName = Record<string, ServerConfigs>

export type Servers = Record<Environment, ServerName>

type ServerConfigName = 'REMOTE_HOST' | 'REMOTE_USER' | 'SSH_KEY'

export type ServerConfigs = Record<ServerConfigName, string>

export interface Configs {
  global: GlobalConfig
}

export interface GlobalConfig extends Record<Environment, RepositorySecrets> {
  all: RepositorySecrets
}

export interface RepositorySecrets {
  secrets: Secrets
  vars: Vars
}

export type Secrets = Record<string, string>

export type Vars = Record<string, string>

export type Repositories = Record<string, Repository>

export interface Repository {
  environments: RepositoryEnvironments
}

export type RepositoryEnvironments = Record<Environment, RepositoryEnvironment>

export type RepositoryConfigName = 'server' | 'secrets' | 'vars'

export interface RepositoryEnvironment {
  server: keyof ServerName
  secrets: Record<string, string>
  vars: Record<string, string>
}
