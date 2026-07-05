/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb',
        },
    },
    images: {
        localPatterns: [
            {
                pathname: '/assets/images/**',
            },
        ],
    },
    transpilePackages: ['@mdxeditor/editor'],
}

export default nextConfig
