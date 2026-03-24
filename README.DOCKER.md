# Docker Setup for Smart Expense Tracker

This project includes Docker configuration for both development and production environments.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) (version 20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 1.29+)

## Environment Setup

Before running Docker, ensure you have a `.env.local` file with your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Development

Run the application in development mode with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

The app will be available at `http://localhost:3000` with live code reloading.

To stop:
```bash
docker-compose -f docker-compose.dev.yml down
```

## Production

Build and run the optimized production image:

```bash
docker-compose up --build
```

The app will be available at `http://localhost:3000`.

To stop:
```bash
docker-compose down
```

## Manual Docker Commands

### Building the Image

**Production:**
```bash
docker build -t expense-tracker:latest .
```

**Development:**
```bash
docker build -f Dockerfile.dev -t expense-tracker:dev .
```

### Running a Container

**Production:**
```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  expense-tracker:latest
```

**Development:**
```bash
docker run -p 3000:3000 \
  -v $(pwd):/app \
  -v /app/node_modules \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id \
  -e NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket \
  -e NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id \
  expense-tracker:dev
```

## Features

### Production Dockerfile
- Multi-stage build for optimized image size
- Node.js 20 Alpine base image
- Non-root user for security
- Health checks enabled
- Standalone Next.js build
- Minimal final image size (~200MB)

### Development Dockerfile
- Hot code reloading via volume mounts
- Full development dependencies
- Faster iteration during development

### Docker Compose Files
- **docker-compose.yml**: Production configuration
- **docker-compose.dev.yml**: Development with volume mounts
- Environment variable injection from .env.local
- Health checks and auto-restart policies
- Network isolation

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
docker-compose up -p 8000:3000  # Maps to port 8000 on host
```

### Firebase Environment Variables Not Working
Ensure your `.env.local` file exists and is in the project root, then rebuild:
```bash
docker-compose up --build
```

### Clear Cache and Rebuild
```bash
docker-compose down
docker system prune -a
docker-compose up --build
```

### View Logs
```bash
docker-compose logs -f app
```

## Production Deployment

For production deployment:

1. Build the image with a registry tag:
   ```bash
   docker build -t your-registry/expense-tracker:1.0.0 .
   ```

2. Push to your registry:
   ```bash
   docker push your-registry/expense-tracker:1.0.0
   ```

3. Update `docker-compose.yml` to reference your image and deploy to your server

4. Ensure Firebase credentials are set securely (use secrets management, not hardcoded values)

## Performance Notes

- Production image is optimized with multi-stage builds (~200MB)
- Development uses volume mounts for instant hot reload
- Health checks prevent traffic to unhealthy containers
- Auto-restart on container failure

## Security Considerations

- Non-root user in production
- Environment variables for sensitive data
- .dockerignore to exclude unnecessary files
- Alpine base image reduces attack surface
