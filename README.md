# Docker Registry UI

A modern, responsive web interface for Docker Registry v2. This application provides an intuitive way to browse, inspect, and manage your Docker images stored in a private registry.

## Features

- 🎨 **Modern UI**: Clean, responsive design built with React and Tailwind CSS
- 🌙 **Dark Mode**: Toggle between light and dark themes for comfortable viewing
- 📦 **Repository Browser**: Browse all repositories in your registry
- 🏷️ **Tag Management**: View all tags for each repository
- 🔍 **Image Details**: Inspect image manifests, layers, and configuration
- 📋 **Copy Commands**: One-click copy for Docker pull/run commands
- 🔄 **Real-time Updates**: Automatic refresh capabilities
- 🌐 **Configurable Registry**: Set your Docker registry URL via environment variables
- ℹ️ **About Page**: View tech stack information and creator details
- 📱 **Mobile Friendly**: Responsive design that works on all devices

## Screenshots

The UI provides:

- A dashboard showing all repositories
- Detailed repository views with tag listings
- Comprehensive image inspection with layer details
- Configuration and metadata display

## Prerequisites

- Node.js 18+ and npm
- Docker Registry v2 running on `http://localhost:5000`

## Quick Start

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd docker-ui
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Access the UI**
   Open http://localhost:3000 in your browser

## Docker Registry Setup

If you don't have a Docker Registry running, you can start one quickly:

```bash
# Run Docker Registry
docker run -d -p 5000:5000 --name registry registry:2

# Enable CORS (optional, for direct access)
docker run -d -p 5000:5000 --name registry \
  -e REGISTRY_HTTP_HEADERS_Access-Control-Allow-Origin='*' \
  -e REGISTRY_HTTP_HEADERS_Access-Control-Allow-Methods='HEAD,GET,OPTIONS,DELETE' \
  -e REGISTRY_HTTP_HEADERS_Access-Control-Allow-Headers='Authorization,Accept,Cache-Control' \
  registry:2
```

## Usage

### Viewing Repositories

- The home page displays all repositories in your registry
- Use the search bar to filter repositories
- Click on any repository to view its tags

### Inspecting Images

- Browse through repository tags
- Click on any tag to view detailed information
- View image layers, configuration, and metadata
- Copy Docker commands with one click

### Docker Commands

The UI provides ready-to-use Docker commands:

- Pull commands: `docker pull localhost:5000/repository:tag`
- Run commands: `docker run localhost:5000/repository:tag`

## Configuration

### Environment Variables

Create a `.env` file in the root directory to configure the application:

```env
VITE_DOCKER_REGISTRY_URL=http://localhost:5000
VITE_DOCKER_REGISTRY_NAME=Local Docker Registry
```

**Available Environment Variables:**

- `VITE_DOCKER_REGISTRY_URL` - The URL of your Docker registry (default: `http://localhost:5000`)
- `VITE_DOCKER_REGISTRY_NAME` - Display name for your registry (default: `Docker Registry`)

### Theme Support

The application supports both light and dark themes:

- Click the theme toggle button (sun/moon icon) in the header to switch modes
- Theme preference is automatically saved to localStorage
- System theme detection is supported

### Registry URL

The application can be configured to connect to any Docker Registry v2 compatible registry by setting the `VITE_DOCKER_REGISTRY_URL` environment variable.

### API Endpoints

The application uses Docker Registry v2 API endpoints:

- `GET /v2/_catalog` - List repositories
- `GET /v2/{repository}/tags/list` - List tags
- `GET /v2/{repository}/manifests/{tag}` - Get image manifest
- `GET /v2/{repository}/blobs/{digest}` - Get image config

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Layout.tsx      # Main application layout
├── contexts/           # React contexts
│   ├── RegistryContext.tsx # Registry state management
│   └── ThemeContext.tsx    # Theme state management
├── pages/              # Page components
│   ├── Home.tsx        # Repository listing
│   ├── Repository.tsx  # Repository details
│   ├── ImageDetails.tsx # Image inspection
│   └── About.tsx       # About page with tech stack info
├── types/              # TypeScript type definitions
│   └── registry.ts     # Registry API types
├── utils/              # Utility functions
│   ├── api.ts          # API client and helpers
│   └── cn.ts          # Class name utilities
├── App.tsx            # Main application component
├── main.tsx           # Application entry point
└── index.css          # Global styles
```

### Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Linting**: ESLint

## Troubleshooting

### Connection Issues

1. Ensure Docker Registry is running on port 5000
2. The application uses a proxy to avoid CORS issues
3. Verify the registry is accessible at `http://localhost:5000/v2/`

### Common Errors

- **"Cannot connect to Docker registry"**: Registry is not running or not accessible
- **CORS errors**: The app uses a built-in proxy to handle CORS automatically
- **Empty repository list**: No images pushed to registry yet
- **Proxy errors**: Check console for proxy connection logs

### CORS Issues (Resolved)

This application uses Vite's built-in proxy to avoid CORS issues:

- All API requests go to `/api/*` and are proxied to your Docker registry
- No need to configure CORS headers on your Docker registry
- The proxy automatically handles origin and headers

If you still encounter CORS issues:

1. Restart the development server: `npm run dev`
2. Check the proxy configuration in `vite.config.ts`
3. Ensure your registry URL is correctly set in `.env.local`

### Testing Registry Connection

```bash
# Test registry connectivity
curl http://localhost:5000/v2/

# List repositories
curl http://localhost:5000/v2/_catalog

# Check specific repository
curl http://localhost:5000/v2/{repository}/tags/list
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Create an issue in the repository
3. Ensure your Docker Registry is properly configured

---

**Created by:** [Muhammad Ammar Arief](https://github.com/mmararief)

Built with ❤️ using React, TypeScript, and Tailwind CSS
