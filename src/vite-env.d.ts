/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DOCKER_REGISTRY_URL: string
  readonly VITE_DOCKER_REGISTRY_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 