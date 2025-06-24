import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Tag,
  Calendar,
  HardDrive,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useRegistry } from "../contexts/RegistryContext";
import { formatBytes, parseRepositoryName } from "../utils/api";

const Repository: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const { getRepositoryTags, getImageInfo } = useRegistry();
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tagDetails, setTagDetails] = useState<Record<string, any>>({});

  const decodedName = name ? decodeURIComponent(name) : "";
  const { namespace, name: repoName } = parseRepositoryName(decodedName);

  useEffect(() => {
    if (!decodedName) return;

    const fetchTags = async () => {
      try {
        setLoading(true);
        setError(null);

        const fetchedTags = await getRepositoryTags(decodedName);
        setTags(fetchedTags);

        // Fetch details for each tag
        const details: Record<string, any> = {};
        for (const tag of fetchedTags.slice(0, 10)) {
          // Limit to first 10 tags for performance
          try {
            const info = await getImageInfo(decodedName, tag);
            details[tag] = info;
          } catch (err) {
            console.warn(
              `Failed to fetch details for ${decodedName}:${tag}`,
              err
            );
          }
        }
        setTagDetails(details);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch repository tags"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [decodedName, getRepositoryTags, getImageInfo]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-docker-blue" />
          <span className="ml-2 text-gray-600">
            Loading repository details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link to="/" className="btn-secondary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </div>
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Repository
          </h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="btn-secondary">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Link>
        <div>
          {namespace && (
            <div className="text-sm text-gray-500 font-medium">{namespace}</div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">{repoName}</h1>
          <p className="text-gray-600">{tags.length} tags available</p>
        </div>
      </div>

      {/* Repository info */}
      <div className="card bg-gradient-to-r from-docker-blue to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Repository: {decodedName}</h3>
            <p className="text-blue-100 text-sm">
              Docker Registry at localhost:5000
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{tags.length}</div>
            <div className="text-blue-100 text-sm">Tags</div>
          </div>
        </div>
      </div>

      {/* Tags list */}
      {tags.length === 0 ? (
        <div className="card text-center py-12">
          <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tags found
          </h3>
          <p className="text-gray-600">
            This repository doesn't have any tags yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tags.map((tag) => {
            const details = tagDetails[tag];

            return (
              <Link
                key={tag}
                to={`/repository/${encodeURIComponent(
                  decodedName
                )}/tag/${encodeURIComponent(tag)}`}
                className="card hover:shadow-md transition-shadow duration-200 hover:border-docker-blue"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Tag className="h-5 w-5 text-docker-blue" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{tag}</h3>
                      {details && (
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center space-x-1">
                            <HardDrive className="h-4 w-4" />
                            <span>{formatBytes(details.size)}</span>
                          </div>
                          {details.config?.architecture && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {details.config.architecture}
                            </span>
                          )}
                          {details.config?.os && (
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                              {details.config.os}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-sm text-gray-500">
                    {details && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(details.lastModified).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {details?.manifest?.layers && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      {details.manifest.layers.length} layer
                      {details.manifest.layers.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Pull command */}
      {tags.length > 0 && (
        <div className="card bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-3">Pull Command</h3>
          <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-sm">
            docker pull localhost:5000/{decodedName}:{tags[0]}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Replace{" "}
            <code className="bg-gray-200 px-1 py-0.5 rounded">{tags[0]}</code>{" "}
            with the desired tag name.
          </p>
        </div>
      )}
    </div>
  );
};

export default Repository;
