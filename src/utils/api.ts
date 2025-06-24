import axios from 'axios';
import type { RepositoryList, TagsList, ImageManifest, ImageConfig } from '../types/registry';

const api = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
});

export const registryApi = {
  // Get list of repositories
  async getRepositories(): Promise<RepositoryList> {
    const response = await api.get('/_catalog');
    return response.data;
  },

  // Get tags for a repository
  async getRepositoryTags(repository: string): Promise<TagsList> {
    const response = await api.get(`/${repository}/tags/list`);
    return response.data;
  },

  // Get image manifest
  async getImageManifest(repository: string, tag: string): Promise<ImageManifest> {
    const response = await api.get(`/${repository}/manifests/${tag}`, {
      headers: {
        'Accept': 'application/vnd.docker.distribution.manifest.v2+json'
      }
    });
    return response.data;
  },

  // Get image config
  async getImageConfig(repository: string, digest: string): Promise<ImageConfig> {
    const response = await api.get(`/${repository}/blobs/${digest}`);
    return response.data;
  },

  // Delete image tag
  async deleteImageTag(repository: string, tag: string): Promise<void> {
    // First get the digest
    const manifestResponse = await api.head(`/${repository}/manifests/${tag}`, {
      headers: {
        'Accept': 'application/vnd.docker.distribution.manifest.v2+json'
      }
    });
    
    const digest = manifestResponse.headers['docker-content-digest'];
    if (digest) {
      await api.delete(`/${repository}/manifests/${digest}`);
    }
  },

  // Check registry health
  async checkHealth(): Promise<boolean> {
    try {
      await api.get('/');
      return true;
    } catch {
      return false;
    }
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

export const parseRepositoryName = (fullName: string): { namespace?: string; name: string } => {
  const parts = fullName.split('/');
  if (parts.length > 1) {
    return {
      namespace: parts.slice(0, -1).join('/'),
      name: parts[parts.length - 1]
    };
  }
  return { name: fullName };
}; 