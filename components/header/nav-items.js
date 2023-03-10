import Link from 'next/link.js';

export function NavItems({inBurger, closeMenu}) {
  return (
    <ul className="flex flex-col mt-4 items-center md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium">
      <li>
        <Link href="/"
              className={`${!inBurger ? 'ml-5' : ''} ${window?.location.pathname === '/' ? 'link-active' : ''} link`}
              onClick={closeMenu}>
          Home
        </Link>
      </li>
      <li>
        <Link href="/operations"
              className={`${window?.location.pathname.startsWith('/operations') ? 'link-active' : ''} link`}
              onClick={closeMenu}>
          Operations
        </Link>
      </li>
      <li>
        <Link href="/projects"
              className={`${window?.location.pathname.startsWith('/projects') ? 'link-active' : ''} link`}
              onClick={closeMenu}>
          Projects
        </Link>
      </li>
    </ul>
  );
}
