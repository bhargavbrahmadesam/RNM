export { ToolkitScreen } from './ToolkitScreen'
import type { ComponentType } from 'react'
import { TypographyShowcase } from './TypographyShowcase'
import { ButtonsShowcase } from './ButtonsShowcase'

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
]