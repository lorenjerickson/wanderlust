import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar'

import { Link } from '@heroui/link'
import { Button } from '@heroui/button'

export function Header() {
  return (
    <Navbar className="bg-transparent px-4 py-2 fixed top-0 w-full z-10 text-white backdrop-blur-lg">
      <NavbarBrand>
        {/* <AcmeLogo /> */}
        <p className="font-bold text-inherit drop-shadow-lg">Wanderlust</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-16" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Create
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Play
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Account
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <Button as={Link} color="primary" href="#" variant="flat">
            Sign Up
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  )
}
