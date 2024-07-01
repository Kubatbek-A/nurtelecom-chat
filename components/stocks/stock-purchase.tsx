'use client'

import { useId, useState } from 'react'
import { useActions, useAIState, useUIState } from 'ai/rsc'

import type { AI } from '@/lib/chat/actions_anthropic'

interface Purchase {
  phoneNumber?: string
  symbol: string
  amount: number
  status: 'requires_action' | 'completed' | 'expired'
}

export function Purchase({
  props: { phoneNumber, symbol, amount, status = 'requires_action' }
}: {
  props: Purchase
}) {
  const [value, setValue] = useState(amount || 100)
  const [purchasingUI, setPurchasingUI] = useState<null | React.ReactNode>(null)
  const [aiState, setAIState] = useAIState<typeof AI>()
  const [, setMessages] = useUIState<typeof AI>()
  const { confirmPurchase } = useActions()

  // Unique identifier for this UI component.
  const id = useId()

  // Whenever the slider changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onSliderChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = Number(e.target.value)
    setValue(newValue)

    // Insert a hidden history info to the list.
    const message = {
      role: 'system' as const,
      content: `[User has changed to transfer ${newValue} of ${symbol}.`,

      // Identifier of this UI component, so we don't insert it many times.
      id
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every slider change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message]
      })

      return
    }

    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  return (
    <div className="rounded-xl border bg-white dark:bg-zinc-950 p-4 dark:text-yellow-400 text-yellow-600">
      <div className="text-3xl font-bold">{phoneNumber}</div>
      {purchasingUI ? (
        <div className="mt-4 text-zinc-800 dark:text-zinc-200">{purchasingUI}</div>
      ) : status === 'requires_action' ? (
        <>
          <div className="relative mt-6 pb-6">
            <p>Акча которуу</p>
            <input
              id="labels-range-input"
              type="range"
              value={value}
              onChange={onSliderChange}
              min="10"
              max="1000"
              className="h-1 w-full cursor-pointer appearance-none rounded-lg bg-zinc-300 accent-yellow-500 dark:bg-zinc-700"
            />
            <span className="absolute bottom-1 start-0 text-xs text-zinc-600 dark:text-zinc-400">
              10
            </span>
            <span className="absolute bottom-1 start-1/3 -translate-x-1/2 text-xs text-zinc-600 dark:text-zinc-400 rtl:translate-x-1/2">
              100
            </span>
            <span className="absolute bottom-1 start-2/3 -translate-x-1/2 text-xs text-zinc-600 dark:text-zinc-400 rtl:translate-x-1/2">
              500
            </span>
            <span className="absolute bottom-1 end-0 text-xs text-zinc-600 dark:text-zinc-400">
              1000
            </span>
          </div>

          <div className="mt-6">
            <p>Жалпы суммасы</p>
            <div className="flex flex-wrap items-center text-xl font-bold sm:items-end sm:gap-2 sm:text-3xl">
              <div className="flex basis-1/3 flex-col tabular-nums sm:basis-auto sm:flex-row sm:items-center sm:gap-2">
                {symbol}{" "}{value}
              </div>
            </div>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-yellow-600 dark:bg-yellow-400 px-4 py-2 font-bold text-white dark:text-zinc-900 hover:bg-yellow-500 hover:dark:bg-yellow-500"
            onClick={async () => {
              const response = await confirmPurchase(symbol, amount, value)
              setPurchasingUI(response.purchasingUI)

              // Insert a new system message to the UI.
              setMessages((currentMessages: any) => [
                ...currentMessages,
                response.newMessage
              ])
            }}
          >
            Жөнөтүү
          </button>
        </>
      ) : status === 'completed' ? (
        <p className="mb-2 text-white">
          Сиз {value}{symbol} ийгиликтүү жөнөттүңүз
        </p>
      ) : status === 'expired' ? (
        <p className="mb-2 text-white">Төлөө сеансыңыз бүттү!</p>
      ) : null}
    </div>
  )
}
