import type { PlopTypes } from '@turbo/gen'

const slugValidate = (input: string): true | string => {
  if (!input) return 'A name is required'
  if (!/^[a-z][a-z0-9-]*$/.test(input)) {
    return 'Use lowercase letters, numbers, and hyphens only (e.g. "guest-feedback")'
  }
  return true
}

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setHelper('readableTitle', (slug: string) =>
    slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  )

  plop.setGenerator('feature-package', {
    description:
      'Scaffold a new packages/feature-<name> package: package.json, tsconfig.json, src/index.ts, and a starter <Name>Screen.tsx',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Feature slug (kebab-case, e.g. "splash", "user-profile"):',
        validate: slugValidate,
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'packages/feature-{{name}}/package.json',
        templateFile: 'templates/feature-package/package.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/feature-{{name}}/tsconfig.json',
        templateFile: 'templates/feature-package/tsconfig.json.hbs',
      },
      {
        type: 'add',
        path: 'packages/feature-{{name}}/src/index.ts',
        templateFile: 'templates/feature-package/src/index.ts.hbs',
      },
      {
        type: 'add',
        path: 'packages/feature-{{name}}/src/{{properCase name}}Screen.tsx',
        templateFile: 'templates/feature-package/src/Screen.tsx.hbs',
      },
      (answers) => {
        const name = (answers as { name: string }).name
        return [
          '',
          `Created packages/feature-${name}`,
          '',
          'Next steps:',
          `  1. Add "@squeez/feature-${name}": "*" to apps/mobile/package.json dependencies`,
          '  2. npm install                       (links the new workspace package)',
          `  3. Create apps/mobile/app/${name}.tsx (route file that renders the screen)`,
          '  4. (optional) Add a nav entry in packages/feature-navigation/src/drawerItems.ts',
          '  5. If it needs a shared package, add it as a "*" dependency in',
          `     packages/feature-${name}/package.json, then \`npm install\` again`,
        ].join('\n')
      },
    ],
  })

  plop.setGenerator('shared-package', {
    description:
      'Scaffold a new packages/shared-<name> package: package.json, tsconfig.json, empty src/index.ts',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Shared package slug (kebab-case, e.g. "analytics"):',
        validate: slugValidate,
      },
      {
        type: 'confirm',
        name: 'confirmedTwoConsumers',
        message:
          'Confirmed this is needed by 2+ feature packages (not just one)?',
        default: false,
      },
    ],
    actions: (data) => {
      if (!data?.confirmedTwoConsumers) {
        return [
          () =>
            'Aborted — a shared-* package is only for code used by 2+ features. ' +
            "If this is for one feature, put it inside that feature's own package instead.",
        ]
      }
      return [
        {
          type: 'add',
          path: 'packages/shared-{{name}}/package.json',
          templateFile: 'templates/shared-package/package.json.hbs',
        },
        {
          type: 'add',
          path: 'packages/shared-{{name}}/tsconfig.json',
          templateFile: 'templates/shared-package/tsconfig.json.hbs',
        },
        {
          type: 'add',
          path: 'packages/shared-{{name}}/src/index.ts',
          templateFile: 'templates/shared-package/src/index.ts.hbs',
        },
        (answers) => {
          const name = (answers as { name: string }).name
          return [
            '',
            `Created packages/shared-${name}`,
            '',
            'Next steps:',
            '  1. Add real exports to src/index.ts',
            '  2. npm install',
            '  3. Add "@squeez/shared-' + name + '": "*" to every consuming',
            "     package's package.json, then `npm install` again",
          ].join('\n')
        },
      ]
    },
  })
}
