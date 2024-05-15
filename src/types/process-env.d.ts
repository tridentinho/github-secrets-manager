declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
      GITHUB_OWNER: string
      GITHUB_TOKEN: string
    }
  }
}
