export interface Repository {
  name: string;
  tags?: string[];
}

export interface RepositoryList {
  repositories: string[];
}

export interface TagsList {
  name: string;
  tags: string[];
}

export interface ImageManifest {
  schemaVersion: number;
  mediaType: string;
  config: {
    mediaType: string;
    size: number;
    digest: string;
  };
  layers: Array<{
    mediaType: string;
    size: number;
    digest: string;
  }>;
}

export interface ImageConfig {
  architecture: string;
  config: {
    Env?: string[];
    Cmd?: string[];
    Entrypoint?: string[];
    WorkingDir?: string;
    User?: string;
    ExposedPorts?: Record<string, any>;
    Labels?: Record<string, string>;
  };
  created: string;
  history: Array<{
    created: string;
    created_by: string;
    empty_layer?: boolean;
  }>;
  os: string;
  rootfs: {
    type: string;
    diff_ids: string[];
  };
}

export interface ImageInfo {
  repository: string;
  tag: string;
  manifest: ImageManifest;
  config?: ImageConfig;
  size: number;
  digest: string;
  lastModified: string;
} 