import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // bcryptjs and pg are Node-only; keep them out of the bundle.
  serverExternalPackages: ['pg', '@prisma/adapter-pg'],
  // This folder is the app root (the repo root has its own package-lock.json for the dev scripts)
  turbopack: { root: path.dirname(fileURLToPath(import.meta.url)) },
}

export default nextConfig
