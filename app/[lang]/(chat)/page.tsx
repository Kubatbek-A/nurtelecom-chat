import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { AI } from '@/lib/chat/actions_anthropic'
import { getMissingKeys } from '../actions'
import { getDictionary } from '@/lib/localization/dictionary'

export const runtime = 'edge'

export const metadata = {
  title: 'O!'
}

export default async function IndexPage({ params: { lang } }: any) {
  const id = nanoid()
  // const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()
  const { page } = await getDictionary(lang)

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat
        id={id}
        missingKeys={missingKeys}
        pageDictionary={page}
        lang={lang}
      />
    </AI>
  )
}
