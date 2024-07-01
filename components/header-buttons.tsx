'use client'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { WhatsappLogo, Phone, TelegramLogo } from '@phosphor-icons/react'
import LocaleSwitcher from './locale-switcher'

export function HeaderButtons() {
  return (
    <div className="flex items-center justify-end space-x-2">
      <LocaleSwitcher />

      <a
        target="_blank"
        href="https://api.whatsapp.com/send/?phone=996705700700"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: 'outline' }))}
      >
        <WhatsappLogo className="size-4" />
        <span className="hidden ml-2 md:flex">Whatsapp</span>
      </a>
      <a
        href="tel:996705700700"
        target="_blank"
        className={cn(buttonVariants())}
      >
        <Phone className="size-4" />
        <span className="hidden ml-2 sm:block">Phone</span>
      </a>
    </div>
  )
}
