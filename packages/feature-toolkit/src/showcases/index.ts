import type { ComponentType } from 'react'
import { TypographyShowcase } from './TypographyShowcase'
import { ButtonsShowcase } from './ButtonsShowcase'
import { TablesShowcase } from './TablesShowcase'
import { CardsShowcase } from './CardsShowcase'
import { ColorsShowcase } from './ColorsShowcase'

export type Showcase = {
  id: string
  title: string
  Component: ComponentType
}

// To add a component to the toolkit: write a <Name>Showcase.tsx in this
// folder, then add ONE line here.
export const showcases: Showcase[] = [
  { id: 'typography', title: 'Text', Component: TypographyShowcase },
  { id: 'buttons', title: 'Buttons', Component: ButtonsShowcase },
  { id: 'tables', title: 'Tables', Component: TablesShowcase },
  { id: 'cards', title: 'Cards', Component: CardsShowcase },
  { id: 'colors', title: 'Colors', Component: ColorsShowcase },
]
