import Link from 'next/link';

interface AuthBottomLinkProps {
  text: string;
  linkText: string;
  href: string;
}

export function AuthBottomLink({ text, linkText, href }: AuthBottomLinkProps) {
  return (
    <p className='text-small-01-r mt-10 text-center text-gray-800'>
      {text}
      <Link href={href} className='text-small-01-r ml-3 text-blue-400'>
        {linkText}
      </Link>
    </p>
  );
}
