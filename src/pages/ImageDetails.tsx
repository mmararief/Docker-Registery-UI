import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  HardDrive,
  Calendar,
  Layers,
  Settings,
  Copy,
  Check,
} from "lucide-react";
import { useRegistry } from "../contexts/RegistryContext";
import { formatBytes, formatDate } from "../utils/api";
import type { ImageInfo } from "../types/registry";

const ImageDetails: React.FC = () => {
  const { name, tag } = useParams<{ name: string; tag: string }>();
  const { getImageInfo } = useRegistry();
  const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCommand, setCopiedCommand] = useState<string | null>(null);

  const decodedName = name ? decodeURIComponent(name) : "";
  const decodedTag = tag ? decodeURIComponent(tag) : "";

  useEffect(() => {
    if (!decodedName || !decodedTag) return;

    const fetchImageInfo = async () => {
      try {
        setLoading(true);
        setError(null);

        const info = await getImageInfo(decodedName, decodedTag);
        setImageInfo(info);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch image details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImageInfo();
  }, [decodedName, decodedTag, getImageInfo]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(type);
      setTimeout(() => setCopiedCommand(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to={`/repository/${encodeURIComponent(decodedName)}`}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repository
          </Link>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="card space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !imageInfo) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            to={`/repository/${encodeURIComponent(decodedName)}`}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repository
          </Link>
        </div>
        <div className="card text-center py-12">
          <div className="text-red-500 mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Image
          </h2>
          <p className="text-gray-600">{error || "Image not found"}</p>
        </div>
      </div>
    );
  }

  const pullCommand = `docker pull localhost:5000/${decodedName}:${decodedTag}`;
  const runCommand = `docker run localhost:5000/${decodedName}:${decodedTag}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to={`/repository/${encodeURIComponent(decodedName)}`}
            className="btn-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Repository
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {decodedName}:{decodedTag}
            </h1>
            <p className="text-gray-600">Image details and manifest</p>
          </div>
        </div>
      </div>

      {/* Image summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center space-x-3">
            <HardDrive className="h-5 w-5 text-docker-blue" />
            <div>
              <div className="text-sm text-gray-600">Size</div>
              <div className="font-semibold">{formatBytes(imageInfo.size)}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Layers className="h-5 w-5 text-docker-blue" />
            <div>
              <div className="text-sm text-gray-600">Layers</div>
              <div className="font-semibold">
                {imageInfo.manifest.layers?.length || 0}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-docker-blue" />
            <div>
              <div className="text-sm text-gray-600">Created</div>
              <div className="font-semibold text-sm">
                {formatDate(imageInfo.lastModified)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Commands */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Docker Commands
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pull Image
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                {pullCommand}
              </code>
              <button
                onClick={() => copyToClipboard(pullCommand, "pull")}
                className="btn-secondary p-3"
                title="Copy command"
              >
                {copiedCommand === "pull" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Run Container
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
                {runCommand}
              </code>
              <button
                onClick={() => copyToClipboard(runCommand, "run")}
                className="btn-secondary p-3"
                title="Copy command"
              >
                {copiedCommand === "run" ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image configuration */}
      {imageInfo.config && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">
            Image Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">System Info</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Architecture:</span>
                  <span>{imageInfo.config.architecture}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">OS:</span>
                  <span>{imageInfo.config.os}</span>
                </div>
                {imageInfo.config.config.User && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span>{imageInfo.config.config.User}</span>
                  </div>
                )}
                {imageInfo.config.config.WorkingDir && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Working Dir:</span>
                    <span className="font-mono text-xs">
                      {imageInfo.config.config.WorkingDir}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Runtime Config</h4>
              <div className="space-y-2 text-sm">
                {imageInfo.config.config.Entrypoint && (
                  <div>
                    <span className="text-gray-600">Entrypoint:</span>
                    <code className="block mt-1 bg-gray-100 p-2 rounded text-xs">
                      {JSON.stringify(imageInfo.config.config.Entrypoint)}
                    </code>
                  </div>
                )}
                {imageInfo.config.config.Cmd && (
                  <div>
                    <span className="text-gray-600">Cmd:</span>
                    <code className="block mt-1 bg-gray-100 p-2 rounded text-xs">
                      {JSON.stringify(imageInfo.config.config.Cmd)}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Layers */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Layers className="h-5 w-5 mr-2" />
          Layers ({imageInfo.manifest.layers?.length || 0})
        </h3>
        {imageInfo.manifest.layers && imageInfo.manifest.layers.length > 0 ? (
          <div className="space-y-2">
            {imageInfo.manifest.layers.map((layer, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-sm font-medium text-gray-900">
                    Layer {index + 1}
                  </div>
                  <code className="text-xs text-gray-600 font-mono">
                    {layer.digest.substring(0, 16)}...
                  </code>
                </div>
                <div className="text-sm text-gray-600">
                  {formatBytes(layer.size)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No layer information available</p>
        )}
      </div>

      {/* Labels */}
      {imageInfo.config?.config.Labels &&
        Object.keys(imageInfo.config.config.Labels).length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">Labels</h3>
            <div className="space-y-2">
              {Object.entries(imageInfo.config.config.Labels).map(
                ([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <code className="text-sm font-medium text-gray-900">
                      {key}
                    </code>
                    <code className="text-sm text-gray-600 ml-4 text-right">
                      {value}
                    </code>
                  </div>
                )
              )}
            </div>
          </div>
        )}
    </div>
  );
};

export default ImageDetails;
