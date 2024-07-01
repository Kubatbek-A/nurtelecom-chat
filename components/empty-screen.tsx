import { ExternalLink } from '@/components/external-link'

export function EmptyScreen({ pageDictionary, lang }: any) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">{pageDictionary.chat.welcome}</h1>
        <p className="leading-normal text-muted-foreground">
          {lang === 'kg' && (
            <ExternalLink href="https://www.o.kg/">
              {pageDictionary.chat.companyName}
            </ExternalLink>
          )}
          {pageDictionary.chat.welcomeDesc}
          {lang === 'ru' && (
            <ExternalLink href="https://www.o.kg/">
              {pageDictionary.chat.companyName}
            </ExternalLink>
          )}
        </p>
      </div>
    </div>
  )
}
