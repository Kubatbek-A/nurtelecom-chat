import * as React from 'react'

import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { FooterText } from '@/components/footer'
import { useActions, useUIState } from 'ai/rsc'
import type { AI } from '@/lib/chat/actions_anthropic'
import { nanoid } from 'nanoid'
import { UserMessage } from './stocks/message'

export interface ChatPanelProps {
  input: string
  setInput: (value: string) => void
  isAtBottom: boolean
  scrollToBottom: () => void
  pageDictionary: any
  lang: string
}

export function ChatPanel({
  input,
  setInput,
  isAtBottom,
  scrollToBottom,
  pageDictionary,
  lang
}: ChatPanelProps) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  // const exampleMessages = [
  //   {
  //     message: `Мбанктын башкы кеңсеси кайда?`
  //   },
  //   {
  //     message: 'Агрокредит менен автокредиттин кандай айырмасы бар?'
  //   },
  //   {
  //     message: `Жашыл кредит деген эмне?`
  //   },
  //   {
  //     message: `Мбанктын миссиясы жөнүндө айтып берсеңиз?`
  //   }
  // ]

  const exampleMessages = [
    {
      heading: 'Бүгүн трендде',
      subheading: 'кандай тарифтер?',
      message: `Бүгүн трендде кандай тарифтер?`
    },
    {
      heading: 'Азыр тариф Стандарт',
      subheading: 'баасы кандай?',
      message: 'Азыр тариф Стандарт баасы кандай?'
    },
    {
      heading: 'O!',
      subheading: 'бул эмне?',
      message: `O! бул эмне?`
    },
    {
      heading: 'Wi-Fi Роутер тариф жөнүндө',
      subheading: `шарттары кандай?`,
      message: `Wi-Fi Роутер тариф жөнүндө шарттары кандай?`
    }
  ]

  return (
    <div className="fixed inset-x-0 bottom-0 w-full bg-gradient-to-b from-muted/30 from-0% to-muted/30 to-50% duration-300 ease-in-out animate-in dark:from-background/10 dark:from-10% dark:to-background/80 peer-[[data-state=open]]:group-[]:lg:pl-[250px] peer-[[data-state=open]]:group-[]:xl:pl-[300px]">
      <ButtonScrollToBottom
        isAtBottom={isAtBottom}
        scrollToBottom={scrollToBottom}
      />

      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="space-y-4 border-t bg-background px-4 py-2 shadow-lg sm:rounded-t-xl sm:border md:py-4">
          <PromptForm
            input={input}
            setInput={setInput}
            pageDictionary={pageDictionary}
            lang={lang}
          />
          <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}
