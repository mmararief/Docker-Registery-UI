import React from "react";
import {
  Github,
  ExternalLink,
  Code,
  Layers,
  Palette,
  Zap,
  Globe,
  Package,
} from "lucide-react";

const About: React.FC = () => {
  const techStack = [
    {
      category: "Frontend",
      icon: <Code className="h-5 w-5" />,
      technologies: [
        {
          name: "React 18",
          description: "Modern React with hooks and concurrent features",
        },
        { name: "TypeScript", description: "Type-safe JavaScript development" },
        { name: "Vite", description: "Lightning fast build tool" },
        { name: "React Router", description: "Client-side routing" },
      ],
    },
    {
      category: "Styling",
      icon: <Palette className="h-5 w-5" />,
      technologies: [
        { name: "Tailwind CSS", description: "Utility-first CSS framework" },
        { name: "Lucide React", description: "Beautiful & consistent icons" },
        { name: "Custom Themes", description: "Light & dark mode support" },
      ],
    },
    {
      category: "State Management",
      icon: <Layers className="h-5 w-5" />,
      technologies: [
        { name: "React Context", description: "Built-in state management" },
        { name: "Custom Hooks", description: "Reusable stateful logic" },
      ],
    },
    {
      category: "API & Data",
      icon: <Globe className="h-5 w-5" />,
      technologies: [
        { name: "Axios", description: "HTTP client for API requests" },
        {
          name: "Docker Registry API",
          description: "Integration with Docker registry",
        },
      ],
    },
  ];

  const features = [
    {
      icon: <Package className="h-6 w-6 text-blue-500" />,
      title: "Docker Registry Management",
      description: "Browse, view, and manage Docker images and repositories",
    },
    {
      icon: <Palette className="h-6 w-6 text-purple-500" />,
      title: "Light & Dark Theme",
      description:
        "Switch between light and dark modes for comfortable viewing",
    },
    {
      icon: <Zap className="h-6 w-6 text-yellow-500" />,
      title: "Fast & Responsive",
      description: "Built with modern tools for optimal performance",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Docker Registry UI
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A modern, intuitive web interface for managing Docker registries with
          support for browsing repositories, viewing image details, and managing
          container images.
        </p>
      </div>

      {/* Creator Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full p-3">
            <Github className="h-8 w-8 text-white" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Created by Muhammad Ammar Arief
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Full Stack Developer & Software Engineer
          </p>
          <a
            href="https://github.com/mmararief"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-gray-900 dark:bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <Github className="h-5 w-5" />
            <span>@mmararief</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Technology Stack
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techStack.map((category, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900 dark:text-white">
                {category.icon}
                <span>{category.category}</span>
              </div>
              <div className="space-y-3">
                {category.technologies.map((tech, techIndex) => (
                  <div
                    key={techIndex}
                    className="border-l-2 border-blue-500 pl-4"
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {tech.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Docker Registry UI v1.0.0 • Built with ❤️ using modern web
          technologies
        </p>
      </div>
    </div>
  );
};

export default About;
