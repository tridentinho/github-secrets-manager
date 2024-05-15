import { parse, resolve } from 'path'
import Versioner from './utils/versioner'
import Configurator from './utils/configurator'
import { createInterface } from 'node:readline/promises'
import { type Environment } from './types/app'
import { Octokit } from '@octokit/rest'
import sodium from 'sodium-native'

const readline = createInterface({
  input: process.stdin,
  output: process.stdout
})

const ask = async (question: string): Promise<string> => {
  const answer = await readline.question(question)
  return answer
}

const {
  GITHUB_OWNER,
  GITHUB_TOKEN
} = process.env as {
  GITHUB_OWNER: string
  GITHUB_TOKEN: string
}

interface GithubConfig {
  secrets: {
    environment: Record<string, string>
    repository: Record<string, string>
  }
  variables: {
    environment: Record<string, string>
    repository: Record<string, string>
  }
}

interface PublicKey {
  key_id: string
  key: string
  id?: number | undefined
  url?: string | undefined
  title?: string | undefined
  created_at?: string | undefined
}

const main = async (): Promise<boolean> => {
  const versioner = new Versioner(resolve(__dirname, '../config.json'))
  versioner.createVersion()
  const configurator = new Configurator(versioner)
  console.log(`Repositories:
${configurator.getRepositories().map((repo, idx) => `${idx + 1}. ${repo}`).join('\n')}`)
  const repository = parseInt(await ask('Enter repository to configure (number): '))
  const repositoryName = configurator.getRepositories()[repository - 1]
  console.log(`Environments:
${Object.keys(configurator.getRepository(repositoryName).environments).map((env, idx) => `${idx + 1}. ${env}`).join('\n')}`)
  const environment = parseInt(await ask('Enter environment to configure (number): '))
  const environmentName = Object.keys(configurator.getRepository(repositoryName).environments)[environment - 1] as Environment
  const serverName = configurator.getRepositoryServerName(repositoryName, environmentName)

  const environmentLevelSecrets = {
    ...configurator.getRepositorySecrets(repositoryName, environmentName),
    ...configurator.getServerConfigs(environmentName, serverName)
  }

  const environmentLevelVars = {
    ...configurator.getRepositoryVars(repositoryName, environmentName)
  }

  const globalSecrets = {
    ...configurator.getGlobalCommonSecrets(),
    ...configurator.getGlobalEnvironmentSecrets(environmentName)
  }

  const globalVars = {
    ...configurator.getGlobalCommonVars(),
    ...configurator.getGlobalEnvironmentVars(environmentName)
  }

  const githubConfig: GithubConfig = {
    secrets: {
      environment: environmentLevelSecrets,
      repository: globalSecrets
    },
    variables: {
      environment: environmentLevelVars,
      repository: globalVars
    }
  }

  console.log(`Values to be configured:
Environment secrets:
${Object.entries(environmentLevelSecrets).map(([key, value]) => `${key}`).join('\n')}
Repository secrets:
${Object.entries(globalSecrets).map(([key, value]) => `${key}`).join('\n')}
Environment variables:
${Object.entries(environmentLevelVars).map(([key, value]) => `${key}`).join('\n')}
Repository variables:
${Object.entries(globalVars).map(([key, value]) => `${key}`).join('\n')}`)

  const confirm = await ask(`Are you sure you want to configure ${repositoryName} for ${environmentName}? (yes/no): `)

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    }
  })

  if (confirm === 'yes') {
    await applyConfig(octokit, repositoryName, environmentName, githubConfig)
  }

  return true
}

const sleep = async (ms: number): Promise<void> => {
  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const applyConfig = async (octokit: Octokit, repositoryName: string, environmentName: Environment, githubConfig: GithubConfig): Promise<boolean> => {
  const { secrets, variables } = githubConfig
  console.log('Applying configuration...')
  console.log('Creating environment...')
  const environment = await createAnEnvironment(octokit, repositoryName, environmentName)
  console.log('Environment created')
  const environmentPublicKey = await getEnvironmrentPublicKey(octokit, repositoryName, environmentName)
  const repositoryPublicKey = await getRepositoryPublicKey(octokit, repositoryName)
  console.log('Environment public key')
  await applyEnvironmentSecrets(octokit, repositoryName, secrets.environment, environmentName, environmentPublicKey)
  console.log('Environment secrets applied')
  await applyRepoSecrets(octokit, repositoryName, secrets.repository, repositoryPublicKey)
  console.log('Repository secrets applied')
  await applyEnvironmentVariables(octokit, repositoryName, variables.environment, environmentName)
  console.log('Environment variables applied')
  await applyRepoVariables(octokit, repositoryName, variables.repository)
  console.log('Repository variables applied')
  console.log('Configuration applied!')
  return true
}

const createAnEnvironment = async (octokit: Octokit, repositoryName: string, environmentName: Environment): Promise<typeof environment> => {
  const environment = await octokit.repos.createOrUpdateEnvironment({
    owner: GITHUB_OWNER,
    repo: repositoryName,
    environment_name: environmentName
  })

  return environment
}

const getEnvironmrentPublicKey = async (octokit: Octokit, repositoryName: string, environmentName: Environment): Promise<PublicKey> => {
  const publicKey = await octokit.actions.getEnvironmentPublicKey({
    owner: GITHUB_OWNER,
    repo: repositoryName,
    environment_name: environmentName
  })

  return publicKey.data
}

const getRepositoryPublicKey = async (octokit: Octokit, repositoryName: string): Promise<PublicKey> => {
  const publicKey = await octokit.actions.getRepoPublicKey({
    owner: GITHUB_OWNER,
    repo: repositoryName
  })

  return publicKey.data
}

const encyptSecret = (value: string, environmentPublicKey: PublicKey): string => {
  const rawValue = Buffer.from(value)
  const publicKey = Buffer.from(environmentPublicKey.key, 'base64')
  const cypherText = Buffer.alloc(sodium.crypto_box_SEALBYTES + rawValue.length)
  sodium.crypto_box_seal(cypherText, rawValue, publicKey)
  return cypherText.toString('base64')
}

const applyEnvironmentSecrets = async (octokit: Octokit, repositoryName: string, secrets: Record<string, string>, environmentName: Environment, environmentPublicKey: PublicKey): Promise<boolean> => {
  for (const [key, value] of Object.entries(secrets)) {
    console.log('Adding secret:', key)
    await octokit.actions.createOrUpdateEnvironmentSecret({
      environment_name: environmentName,
      owner: GITHUB_OWNER,
      repo: repositoryName,
      secret_name: key,
      encrypted_value: encyptSecret(value, environmentPublicKey),
      key_id: environmentPublicKey.key_id
    })
    await sleep(1000)
  }

  return true
}

const applyRepoSecrets = async (octokit: Octokit, repositoryName: string, secrets: Record<string, string>, repoPublicKey: PublicKey): Promise<boolean> => {
  for (const [key, value] of Object.entries(secrets)) {
    await octokit.actions.createOrUpdateRepoSecret({
      owner: GITHUB_OWNER,
      repo: repositoryName,
      secret_name: key,
      encrypted_value: encyptSecret(value, repoPublicKey),
      key_id: repoPublicKey.key_id
    })
    await sleep(1000)
  }

  return true
}

const applyEnvironmentVariables = async (octokit: Octokit, repositoryName: string, envs: Record<string, string>, environmentName: Environment): Promise<boolean> => {
  for (const [key, value] of Object.entries(envs)) {
    await octokit.actions.createEnvironmentVariable({
      environment_name: environmentName,
      owner: GITHUB_OWNER,
      repo: repositoryName,
      name: key,
      value
    })
    await sleep(1000)
  }

  return true
}

const applyRepoVariables = async (octokit: Octokit, repositoryName: string, envs: Record<string, string>): Promise<boolean> => {
  for (const [key, value] of Object.entries(envs)) {
    await octokit.actions.createRepoVariable({
      owner: GITHUB_OWNER,
      repo: repositoryName,
      name: key,
      value
    })

    await sleep(1000)
  }
  return true
}

main().then((result) => {
  console.log('main result:', result)
}).catch((error) => {
  console.error('main error:', error)
})
