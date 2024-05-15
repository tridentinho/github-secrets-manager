import {
  createHash
} from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { type GithubConfig } from '../types/app'

class Versioner {
  private readonly filePath: string
  private readonly content: string | null
  private readonly contentParsed: GithubConfig | null
  private readonly versionerPath: string = resolve(__dirname, '../../versions')

  constructor (filePath: string) {
    this.filePath = filePath
    this.content = this.getFileContent()
    this.contentParsed = JSON.parse(this.content) as GithubConfig
    this.verifyVersionDirectory()
  }

  private getFileContent (): string {
    if (this.content != null) {
      return this.content
    }
    return readFileSync(this.filePath, { encoding: 'utf-8' })
  }

  private getHashFromFile (): string {
    // Create hash
    const hash = createHash('sha256')
    if (this.content == null) {
      throw new Error('File content is null')
    }
    hash.update(this.content)
    return hash.digest('hex')
  }

  public createVersion (): {
    hash: string
    path: string
  } {
    // Get hash from file
    const hash = this.getHashFromFile()
    const hashedFilePath = resolve(this.versionerPath, hash)
    if (!existsSync(hashedFilePath)) {
      writeFileSync(hashedFilePath, JSON.stringify(this.content))
    }

    return {
      hash,
      path: hashedFilePath
    }
  }

  private verifyVersionDirectory (): void {
    if (this.versionerPath.length === 0) {
      throw new Error('Directory does not exist')
    }

    if (!existsSync(this.versionerPath)) {
      mkdirSync(this.versionerPath)
    }
  }

  public getParsedContent (): GithubConfig {
    if (this.contentParsed == null) {
      throw new Error('Content is null')
    }
    return this.contentParsed
  }
}

export default Versioner
