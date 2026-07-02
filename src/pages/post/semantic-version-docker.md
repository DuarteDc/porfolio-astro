---
layout: ../../layouts/PostLayout.astro
title: "How to Create Docker Images with Semantic Versioning using GitHub Actions"
description: "A step-by-step guide to automate Docker image versioning with semantic release and GitHub Actions for production-ready deployments."
author: "Eduardo Duarte"
publishDate: "2024-12-15"
readingTime: 10
tags: ["Docker", "GitHub Actions", "DevOps", "CI/CD"]
---

## Introduction

One of the most important practices in modern software development is maintaining clear, predictable version numbers for your releases. Semantic versioning (SemVer) provides a standardized format: `MAJOR.MINOR.PATCH` (e.g., `1.2.3`).

In this guide, I'll show you how I implemented automated Docker image versioning using GitHub Actions that:

- Extracts version from commit messages using semantic release patterns
- Builds and pushes Docker images with proper tags
- Supports major, minor, and patch releases based on commit conventions
- Maintains a `latest` tag for the most recent release
- Configures environment variables for your application

## The Production Pipeline

Here's the complete GitHub Actions workflow I use in production:

```yaml
name: ci

on:
  push:
    branches: ["main"]

jobs:
  ci:
    runs-on: app-back
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Calcular versión semántica
        id: version
        uses: paulhatch/semantic-version@v5.4.0
        with:
          tag_prefix: "v"
          major_pattern: "(MAJOR)"
          minor_pattern: "(MINOR)"
          version_format: "${major}.${minor}.${patch}-prerelease${increment}"

      - name: Build and push Docker image App
        id: push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: |
            fgjem/oba-back:${{ steps.version.outputs.version }}
            fgjem/oba-back:latest
          labels: app-oba-back
```

## How It Works

### 1. Trigger on Main Branch Push

The workflow triggers whenever you push to the `main` branch:

```bash
# Push to main - pipeline runs automatically
git checkout main
git push origin main
```

### 2. Checkout with Full History

We need full git history to analyze commit messages:

```yaml
- name: Checkout Repository
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

### 3. Semantic Version from Commit Messages

The `paulhatch/semantic-version` action analyzes your commit history to determine the next version:

```yaml
- name: Calcular versión semántica
  id: version
  uses: paulhatch/semantic-version@v5.4.0
  with:
    tag_prefix: "v"
    major_pattern: "(MAJOR)"
    minor_pattern: "(MINOR)"
    version_format: "${major}.${minor}.${patch}-prerelease${increment}"
```

#### Commit Message Convention

| Commit Message                          | Version Bump      |
| --------------------------------------- | ----------------- |
| `feat: add user authentication (MAJOR)` | 1.0.0 → 2.0.0     |
| `fix: resolve memory leak (MINOR)`      | 1.0.0 → 1.1.0     |
| `fix: correct typo`                     | 1.0.0 → 1.0.1     |
| `chore: update deps`                    | No version change |

**Example workflow:**

```bash
# Start at v1.0.0

# Add a minor feature
git commit -m "feat: add user dashboard (MINOR)"
git push origin main
# → Version becomes v1.1.0

# Fix a bug
git commit -m "fix: resolve login timeout"
git push origin main
# → Version becomes v1.1.1

# Breaking change
git commit -m "refactor: change API response format (MAJOR)"
git push origin main
# → Version becomes v2.0.0
```

### 4. Build and Push with Dynamic Tags

The version from the semantic-version step is used to tag your Docker image:

```yaml
- name: Build and push Docker image App
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: |
      fgjem/oba-back:${{ steps.version.outputs.version }}
      fgjem/oba-back:latest
    labels: app-oba-back
```

| Tag                                | Description                            |
| ---------------------------------- | -------------------------------------- |
| `fgjem/oba-back:2.1.0-prerelease3` | Exact version from semantic analysis   |
| `fgjem/oba-back:latest`            | Always points to the most recent build |

## Advanced: Multi-Platform Build

For production applications serving different architectures:

```yaml
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3

- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3

- name: Build and push Docker image App
  uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    platforms: linux/amd64,linux/arm64
    tags: |
      fgjem/oba-back:${{ steps.version.outputs.version }}
      fgjem/oba-back:latest
```

## Complete Production Pipeline

Here's the full workflow with all features combined:

```yaml
name: ci

on:
  push:
    branches: ["main"]

jobs:
  ci:
    runs-on: app-back

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to the Container registry
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Calcular versión semántica
        id: version
        uses: paulhatch/semantic-version@v5.4.0
        with:
          tag_prefix: "v"
          major_pattern: "(MAJOR)"
          minor_pattern: "(MINOR)"
          version_format: "${major}.${minor}.${patch}-prerelease${increment}"
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image App
        id: push
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          platforms: linux/amd64,linux/arm64
          tags: |
            fgjem/oba-back:${{ steps.version.outputs.version }}
            fgjem/oba-back:latest
            fgjem/oba-back:v${{ steps.version.outputs.major }}
          labels: |
            app-oba-back
            org.opencontainers.image.version=${{ steps.version.outputs.version }}
```

## Using the Image in Production

### Docker Compose

```yaml
version: "3.8"

services:
  backend:
    image: fgjem/oba-back:v2.1.0
    ports:
      - "3000:3000"
    env_file:
      - .env
```

### Pull Specific Version

```bash
# Pull exact version
docker pull fgjem/oba-back:v2.1.0

# Pull latest
docker pull fgjem/oba-back:latest
```

## Version Format Explained

The `version_format` string gives you control over the output:

```yaml
version_format: "${major}.${minor}.${patch}-prerelease${increment}"
```

| Format                                              | Example Output      |
| --------------------------------------------------- | ------------------- |
| `${major}.${minor}.${patch}`                        | `2.1.0`             |
| `${major}.${minor}.${patch}-prerelease${increment}` | `2.1.0-prerelease3` |
| `v${major}.${minor}.${patch}`                       | `v2.1.0`            |
| `${major}.${minor}.${patch}+build${increment}`      | `2.1.0+build15`     |

## Best Practices

### 1. Conventional Commits

Use conventional commits format for clear commit messages:

```
<type>(<scope>): <description>

feat(auth): add OAuth2 login
fix(api): resolve timeout issue
docs(readme): update installation guide
```

### 2. Version Increment Protection

Add (MAJOR) only for true breaking changes:

```bash
# Breaking change - requires major version bump
git commit -m "feat(auth)!: change token format (MAJOR)"

# Regular feature - minor bump
git commit -m "feat(auth): add password reset (MINOR)"

# Bug fix - patch bump
git commit -m "fix: resolve session timeout"
```

### 3. Protect Your Main Branch

Use branch protection rules in GitHub Settings to require PR reviews before merging.

### 4. Dockerfile Optimization

```dockerfile
# Multi-stage build for smaller images
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

## Troubleshooting

### Version Not Increasing

1. Check commit messages follow the convention
2. Ensure `fetch-depth: 0` is set for full history
3. Verify the pattern matches are correct (including parentheses)

### Images Not Pushing

1. Verify Docker Hub credentials in secrets
2. Ensure the repository exists on Docker Hub
3. Check if the token has push permissions

### QEMU Setup Fails

Some runners may not support QEMU. Use a self-hosted runner with Docker installed, or remove multi-platform support:

```yaml
# Remove QEMU if not needed
- name: Set up QEMU
  uses: docker/setup-qemu-action@v3
  # Remove this step if not building multi-platform
```

## Conclusion

Automating Docker image versioning with GitHub Actions and semantic versioning provides:

- **Automation**: No manual version management or image uploads
- **Consistency**: Every release follows semantic versioning rules
- **Traceability**: Commit messages document why versions change
- **Professionalism**: Your deployment process follows industry best practices

Start implementing this workflow in your projects, and you'll never have to manually manage Docker image versions again.

---

Have questions or suggestions? Feel free to reach out or open an issue on GitHub.
