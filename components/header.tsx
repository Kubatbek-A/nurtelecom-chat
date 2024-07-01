import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HeaderButtons } from './header-buttons'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <Link href="/new" rel="nofollow">
          <Image
            src="/o-logo.svg"
            alt="Logo"
            width={131}
            height={40}
            className="h-[28px] mr-2 dark:hidden"
          />
          <Image
            src="/o-logo-white.svg"
            alt="Logo"
            width={131}
            height={40}
            className="hidden h-[28px] mr-2 dark:block"
          />
        </Link>
      </div>
      <HeaderButtons />
    </header>
  )
}
