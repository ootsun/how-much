import Link from 'next/link.js';

export function NavItems({inBurger}) {
  return (
    <Link href="/operations">
      <button
        className={`${!inBurger ? 'hidden md:inline-flex ml-5' : ''} link-wrapper group group-hover:from-purple-600 group-hover:to-blue-500`}>
        <a title="View, add and edit operations"
           className="group-hover:bg-opacity-0">
          Operations
        </a>
      </button>
    </Link>
  );
}
