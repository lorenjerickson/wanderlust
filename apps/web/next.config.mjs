/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    transpilePackages: ['@mdxeditor/editor'],
}

export default nextConfig
