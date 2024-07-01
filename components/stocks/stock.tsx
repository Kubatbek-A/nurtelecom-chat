'use client'

import { useState, useRef, useEffect, useId } from 'react'
import { scaleLinear } from 'd3-scale'
import { subMonths, format } from 'date-fns'
import { useResizeObserver } from 'usehooks-ts'
import { useAIState } from 'ai/rsc'

interface Stock {
  symbol: string
  price: number
  delta: number
}

export function Stock({ props: { symbol, price, delta } }: { props: Stock }) {
  const [aiState, setAIState] = useAIState()
  const id = useId()

  const [priceAtTime, setPriceAtTime] = useState({
    time: '00:00',
    value: price.toFixed(2),
    x: 0
  })

  const [startHighlight, setStartHighlight] = useState(0)
  const [endHighlight, setEndHighlight] = useState(0)

  const chartRef = useRef<HTMLDivElement>(null)
  const { width = 0 } = useResizeObserver({
    ref: chartRef,
    box: 'border-box'
  })

  const xToDate = scaleLinear(
    [0, width],
    [subMonths(new Date(), 6), new Date()]
  )
  const xToValue = scaleLinear(
    [0, width],
    [price - price / 2, price + price / 2]
  )

  useEffect(() => {
    if (startHighlight && endHighlight) {
      const message = {
        id,
        role: 'system' as const,
        content: `[User has highlighted dates between between ${format(
          xToDate(startHighlight),
          'd LLL'
        )} and ${format(xToDate(endHighlight), 'd LLL, yyyy')}`
      }

      if (aiState.messages[aiState.messages.length - 1]?.id === id) {
        setAIState({
          ...aiState,
          messages: [...aiState.messages.slice(0, -1), message]
        })
      } else {
        setAIState({
          ...aiState,
          messages: [...aiState.messages, message]
        })
      }
    }
  }, [startHighlight, endHighlight])

  return (
    <div className="rounded-xl border dark:bg-zinc-950 bg-white p-4 text-yellow-600 dark:text-yellow-400">
      <div className="float-right inline-block rounded-full dark:bg-white/10 bg-black/10 px-2 py-1 text-xs">
        {`${delta > 0 ? '+' : ''}${((delta / price) * 100).toFixed(2)}% ${
          delta > 0 ? '↑' : '↓'
        }`}
      </div>
      <div className="text-lg dark:text-zinc-300 text-zinc-700">{symbol}</div>
      <div className="text-3xl font-bold">{price} сом</div>
      <div className="text mt-1 text-xs dark:text-zinc-500 text-zinc-600">
        Active from: Feb 27, 4:59 PM EST
      </div>

    </div>
  )
}
