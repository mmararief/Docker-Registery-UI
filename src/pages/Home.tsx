import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Package, Tag, AlertCircle, Loader2 } from "lucide-react";
import { useRegistry } from "../contexts/RegistryContext";
import { parseRepositoryName } from "../utils/api";

const Home: React.FC = () => {
  const { repositories, loading, error, isConnected } = useRegistry();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRepositories = repositories.filter((repo) =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error && !isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Quick Setup:</h3>
            <ol className="text-sm text-gray-600 text-left space-y-1">
              <li>1. Make sure Docker Registry is running on port 5000</li>
              <li>2. Enable CORS if needed</li>
              <li>3. Check registry configuration</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repositories</h1>
          <p className="text-gray-600">
            {loading
              ? "Loading repositories..."
              : `${repositories.length} repositories found`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search repositories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10"
        />
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-docker-blue" />
          <span className="ml-2 text-gray-600">Loading repositories...</span>
        </div>
      )}

      {/* Repository list */}
      {!loading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRepositories.length === 0 ? (
            <div className="col-span-full">
              <div className="card text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm
                    ? "No matching repositories"
                    : "No repositories found"}
                </h3>
                <p className="text-gray-600">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Push some images to your registry to get started"}
                </p>
              </div>
            </div>
          ) : (
            filteredRepositories.map((repo) => {
              const { namespace, name } = parseRepositoryName(repo.name);

              return (
                <Link
                  key={repo.name}
                  to={`/repository/${encodeURIComponent(repo.name)}`}
                  className="card hover:shadow-md transition-shadow duration-200 hover:border-docker-blue"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5 text-docker-blue" />
                      <div>
                        {namespace && (
                          <div className="text-xs text-gray-500 font-medium">
                            {namespace}
                          </div>
                        )}
                        <h3 className="font-semibold text-gray-900 truncate">
                          {name}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>
                      {repo.tags?.length || 0} tag
                      {(repo.tags?.length || 0) !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {repo.tags && repo.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {repo.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                      {repo.tags.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          +{repo.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      )}

      {/* Quick actions */}
      {!loading && repositories.length > 0 && (
        <div className="card bg-gradient-to-r from-docker-blue to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold mb-1">Registry Information</h3>
              <p className="text-blue-100 text-sm">
                Connected to Docker Registry at localhost:5000
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{repositories.length}</div>
              <div className="text-blue-100 text-sm">Repositories</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
