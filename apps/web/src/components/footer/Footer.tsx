import { Link } from '@heroui/link'

export function Footer() {
  return (
    <footer className="w-full py-3 px-6 fixed bottom-0 bg-gray-100 text-center flex justify-between items-center">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Wanderlust. All rights reserved.
      </p>
      <div className="flex space-x-4 text-sm text-gray-600">
        <div>[latency]ms</div>
        <div>[stat]</div>
        <div>[stat]</div>
        <div>[stat]</div>
      </div>
      <div className="flex justify-center text-center items-center text-sm gap-2">
        <Link href="/privacy" className="justify-center text-gray-600">
          Privacy Policy
        </Link>{' '}
        |{' '}
        <Link href="/terms" className="justify-center text-gray-600">
          Terms of Service
        </Link>{' '}
        |{' '}
        <Link href="/report" className="justify-center text-gray-600">
          Report a problem
        </Link>
      </div>
    </footer>
  )
}
