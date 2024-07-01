'use client'

import { useActions, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/actions_anthropic'

interface Stock {
  name: string
  price: string
  internet: string
  minutes: string
}

export function Stocks({ props: stocks }: { props: Stock[] }) {
  const [, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 overflow-y-scroll pb-4 text-sm sm:flex-row">
        {stocks.map(stock => (
          <button
            key={stock.name}
            className="flex cursor-pointer flex-row gap-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 p-2 text-left hover:bg-zinc-300 hover:dark:bg-zinc-700 sm:w-52"
            onClick={async () => {
              const response = await submitUserMessage(`View ${stock.name}`)
              setMessages(currentMessages => [...currentMessages, response])
            }}
          >
            
            <div className="flex flex-col">
              <div className="font-bold uppercase dark:text-zinc-300 text-zinc-700">{stock.name}</div>
              <div className="text-extrabold dark:text-yellow-500 text-yellow-800">
                {stock.price}
              </div>
            </div>
            <div className="ml-auto flex flex-col">
              <div
                className={`bold text-right uppercase`}
              >
                {stock.internet}
              </div>
              <div
                className={`text-right text-base`}
              >
                {stock.minutes}
              </div>
            </div>
          </button>
        ))}
      </div>
      <div className="p-4 text-center text-sm text-zinc-500">
        Эскертүү: Маалыматтар иллюстрациялык максаттар үчүн окшоштурулган жана кеңеш катары каралбаш керек.
      </div>
    </div>
  )
}
