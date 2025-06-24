import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { registryApi } from "../utils/api";
import type { Repository, ImageInfo } from "../types/registry";

interface RegistryContextType {
  repositories: Repository[];
  loading: boolean;
  error: string | null;
  isConnected: boolean;
  refreshRepositories: () => Promise<void>;
  getRepositoryTags: (name: string) => Promise<string[]>;
  getImageInfo: (repository: string, tag: string) => Promise<ImageInfo>;
}

const RegistryContext = createContext<RegistryContextType | undefined>(
  undefined
);

export const useRegistry = () => {
  const context = useContext(RegistryContext);
  if (context === undefined) {
    throw new Error("useRegistry must be used within a RegistryProvider");
  }
  return context;
};

interface RegistryProviderProps {
  children: ReactNode;
}

export const RegistryProvider: React.FC<RegistryProviderProps> = ({
  children,
}) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const checkConnection = async () => {
    try {
      const healthy = await registryApi.checkHealth();
      setIsConnected(healthy);
      if (!healthy) {
        setError("Cannot connect to Docker registry at http://localhost:5000");
      }
    } catch (err) {
      setIsConnected(false);
      setError("Cannot connect to Docker registry at http://localhost:5000");
    }
  };

  const refreshRepositories = async () => {
    try {
      setLoading(true);
      setError(null);

      await checkConnection();

      const data = await registryApi.getRepositories();
      const repoList = data.repositories || [];

      const reposWithTags = await Promise.all(
        repoList.map(async (name) => {
          try {
            const tagData = await registryApi.getRepositoryTags(name);
            return { name, tags: tagData.tags || [] };
          } catch {
            return { name, tags: [] };
          }
        })
      );

      setRepositories(reposWithTags);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch repositories"
      );
      setRepositories([]);
    } finally {
      setLoading(false);
    }
  };

  const getRepositoryTags = async (name: string): Promise<string[]> => {
    try {
      const data = await registryApi.getRepositoryTags(name);
      return data.tags || [];
    } catch (err) {
      console.error("Failed to fetch tags for repository:", name, err);
      return [];
    }
  };

  const getImageInfo = async (
    repository: string,
    tag: string
  ): Promise<ImageInfo> => {
    try {
      const manifest = await registryApi.getImageManifest(repository, tag);

      let config;
      let size = 0;

      // Calculate total size from layers
      if (manifest.layers) {
        size = manifest.layers.reduce((total, layer) => total + layer.size, 0);
      }

      // Get image config if available
      if (manifest.config) {
        try {
          config = await registryApi.getImageConfig(
            repository,
            manifest.config.digest
          );
        } catch (err) {
          console.warn("Failed to fetch image config:", err);
        }
      }

      return {
        repository,
        tag,
        manifest,
        config,
        size,
        digest: manifest.config?.digest || "",
        lastModified: config?.created || new Date().toISOString(),
      };
    } catch (err) {
      throw new Error(
        `Failed to fetch image info: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    refreshRepositories();
  }, []);

  const value: RegistryContextType = {
    repositories,
    loading,
    error,
    isConnected,
    refreshRepositories,
    getRepositoryTags,
    getImageInfo,
  };

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  );
};
