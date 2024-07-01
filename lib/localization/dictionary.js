import 'server-only'

const dictionaries = {
  kg: () => import('./kg.json').then(module => module.default),
  ru: () => import('./ru.json').then(module => module.default)
}

export const getDictionary = async locale => dictionaries[locale]()
