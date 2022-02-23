import Link from 'next/link.js';

export function NavItems({inBurger}) {
  return (
    <ul className="flex flex-col mt-4 items-center md:flex-row md:space-x-4 md:mt-0 md:text-sm md:font-medium">
      <li>
        <Link href="/">
          <a className={`${!inBurger ? 'ml-5' : ''} ${window?.location.pathname === '/' ? 'link-active' : ''} link`}>
            Home
          </a>
        </Link>
      </li>
      <li>
        <Link href="/operations">
          <a className={`${window?.location.pathname.startsWith('/operations') ? 'link-active' : ''} link`}>
            Operations
          </a>
        </Link>
      </li>
      <li>
        <Link href="/projects">
          <a className={`${window?.location.pathname.startsWith('/projects') ? 'link-active' : ''} link`}>
            Projects
          </a>
        </Link>
      </li>
    </ul>

  );
}
