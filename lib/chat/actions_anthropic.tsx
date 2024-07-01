import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  render,
  createStreamableValue
} from 'ai/rsc'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
// import { AnthropicStream, StreamingTextResponse } from 'ai';

import {
  spinner,
  BotCard,
  BotMessage,
  SystemMessage,
  Stock,
  Purchase
} from '@/components/stocks'

import { z } from 'zod'
import { EventsSkeleton } from '@/components/stocks/events-skeleton'
import { Events } from '@/components/stocks/events'
import { Stocks } from '@/components/stocks/stocks'
import { runAsyncFnWithoutBlocking, sleep, nanoid } from '@/lib/utils'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
export const maxDuration = 60

const CATEGORIZE_PROMPT = `\
You are a question-answering (Q&A) chatbot of mobile operator in Kyrgyzstan named O!.

If the user asks any question, call \`getInfo\`.
`

async function confirmPurchase(
  symbol: string,
  phoneNumber: number,
  amount: number
) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Жөнөтүү {symbol}
        {amount}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Жөнөтүү {symbol}
          {amount}... иштеп жатат...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          Сиз {symbol}
          {amount} ийгиликтүү жөнөттүңүз.
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        Сиз {symbol}
        {amount} ийгиликтүү жөнөттүңүз.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            symbol,
            phoneNumber,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has transferred ${symbol}${amount} to ${phoneNumber}]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string, lang: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const newMessage: Message = {
    id: nanoid(),
    role: 'user',
    content
  }

  aiState.update({
    ...aiState.get(),
    messages: [...aiState.get().messages, newMessage]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const ui = render({
    model: 'gpt-3.5-turbo-0125',
    provider: openai,
    temperature: 0,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: CATEGORIZE_PROMPT
      },
      // ...aiState.get().messages.map((message: any) => ({
      //   role: message.role,
      //   content: message.content,
      //   name: message.name
      // }))
      {
        role: (newMessage as any).role,
        content: (newMessage as any).content,
        name: (newMessage as any).name
      }
    ],
    tools: {
      getInfo: {
        description: 'Get information for any request or question.',
        parameters: z.object({
          language: z
            .string()
            .describe('The language of the question in ISO 639-1 format'),
          question: z.string().describe('The question')
        }),
        render: async function* ({ language, question }) {
          yield <SpinnerMessage />

          // if (language != 'ky') {
          //   aiState.done({
          //     ...aiState.get(),
          //     messages: [
          //       ...aiState.get().messages,
          //       {
          //         id: nanoid(),
          //         role: 'assistant',
          //         content: 'Мен кыргыз тилинде гана маалымат бере алам.'
          //       }
          //     ]
          //   })
          //   return (
          //     <BotMessage
          //       content={'Мен кыргыз тилинде гана маалымат бере алам.'}
          //     />
          //   )
          // }

          // Fetch context info from embeddings

          const embbeddingsResponse = await fetch(
            `${lang === 'kg' ? process.env.EMBEDDING_ENDPOINT_KG : process.env.EMBEDDING_ENDPOINT_RU}/api/v1/chat/non-streaming`,
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content: question,
                conversation_id: '13'
              })
            }
          )
          const content = await embbeddingsResponse.json()

          // if (!content.status_code || content.status_code != 'SUCCEEDED') {
          //   aiState.done({
          //     ...aiState.get(),
          //     messages: [
          //       ...aiState.get().messages,
          //       {
          //         id: nanoid(),
          //         role: 'assistant',
          //         content: 'Сервер катасы.'
          //       }
          //     ]
          //   })
          //   return <BotMessage content={'Сервер катасы.'} />
          // }

          const answer = content.data.content

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: answer
              }
            ]
          })
          return <BotMessage content={answer} />
        }
      }
    }
  })

  return {
    id: nanoid(),
    display: ui
  }
}

export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  unstable_onGetUIState: async () => {
    'use server'

    const session = false

    if (session) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  unstable_onSetAIState: async ({ state, done }) => {
    'use server'

    const session = false

    return
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
        message.role === 'function' ? (
          message.name === 'listTariffs' ? (
            <BotCard>
              <Stocks props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showTariff' ? (
            <BotCard>
              <Stock props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'showStockPurchase' ? (
            <BotCard>
              <Purchase props={JSON.parse(message.content)} />
            </BotCard>
          ) : message.name === 'getNews' ? (
            <BotCard>
              <Events props={JSON.parse(message.content)} />
            </BotCard>
          ) : null
        ) : message.role === 'user' ? (
          <UserMessage>{message.content}</UserMessage>
        ) : (
          <BotMessage content={message.content} />
        )
    }))
}
