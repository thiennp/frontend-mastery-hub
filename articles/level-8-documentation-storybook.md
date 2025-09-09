# Documentation & Storybook

## Overview

Documentation is the bridge between design and development in a design system. It's how designers communicate their vision and how developers understand how to implement it correctly. Storybook is the industry standard tool for creating interactive component documentation that serves both purposes.

## Why Documentation Matters

### For Designers
- **Communication**: Clearly communicate design decisions and rationale
- **Consistency**: Ensure all team members understand the design system
- **Onboarding**: Help new team members understand the system quickly
- **Evolution**: Track how the system changes over time

### For Developers
- **Implementation Guide**: Clear instructions on how to use components
- **API Reference**: Complete documentation of props and methods
- **Examples**: Real-world usage examples and patterns
- **Testing**: Interactive playground for testing components

### For Organizations
- **Quality**: Better implementations lead to better user experiences
- **Efficiency**: Faster development with clear guidelines
- **Scalability**: Easier to onboard new team members
- **Maintenance**: Easier to maintain and update the system

## Storybook Fundamentals

### What is Storybook?
Storybook is a tool for building UI components and pages in isolation. It allows you to develop, test, and document components outside of your main application.

**Key Features:**
- **Isolated Development**: Work on components in isolation
- **Interactive Documentation**: Live examples with controls
- **Visual Testing**: Catch visual regressions automatically
- **Addon Ecosystem**: Extend functionality with addons
- **Multi-Framework Support**: Works with React, Vue, Angular, and more

### Storybook Setup
Setting up Storybook for a React project.

**Installation:**
```bash
npx storybook@latest init
```

**Configuration:**
```typescript
// .storybook/main.ts
export default {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-controls',
    '@storybook/addon-viewport',
    '@storybook/addon-backgrounds'
  ],
  framework: '@storybook/react',
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript'
  }
};
```

## Writing Effective Stories

### Basic Story Structure
Every component should have multiple stories that showcase different aspects.

**Story File Example:**
```typescript
// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.'
      }
    }
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'outline', 'ghost'],
      description: 'The visual style variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the button'
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled'
    }
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    children: 'Button'
  }
};

// All variants
export const Variants: Story = {
  render: () => (
    <div className="space-x-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
};

// All sizes
export const Sizes: Story = {
  render: () => (
    <div className="space-x-2">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  )
};

// Interactive example
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => alert('Button clicked!')
  }
};
```

### Story Types
Different types of stories serve different purposes.

**1. Default Story**
Shows the component in its most common state.

```typescript
export const Default: Story = {
  args: {
    children: 'Button'
  }
};
```

**2. Variant Stories**
Show all available variants of a component.

```typescript
export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  )
};
```

**3. State Stories**
Show different states of a component.

```typescript
export const States: Story = {
  render: () => (
    <div className="space-x-2">
      <Button>Normal</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Loading</Button>
    </div>
  )
};
```

**4. Interactive Stories**
Allow users to interact with the component.

```typescript
export const Interactive: Story = {
  args: {
    children: 'Click me',
    onClick: () => console.log('Button clicked!')
  }
};
```

**5. Playground Stories**
Show the component with all controls available.

```typescript
export const Playground: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    disabled: false
  }
};
```

## Documentation Best Practices

### Component Documentation
Each component should have comprehensive documentation.

**Documentation Structure:**
```typescript
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: `
# Button

A versatile button component that supports multiple variants, sizes, and states.

## Usage

Use buttons to trigger actions in your application. Choose the appropriate variant based on the action's importance.

## Accessibility

- Buttons are keyboard accessible by default
- Use \`aria-label\` for icon-only buttons
- Use \`aria-describedby\` to provide additional context
        `
      }
    }
  }
};
```

### Props Documentation
Document all props with clear descriptions and examples.

```typescript
argTypes: {
  variant: {
    control: { type: 'select' },
    options: ['primary', 'secondary', 'outline', 'ghost'],
    description: 'The visual style variant of the button',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'primary' }
    }
  },
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg'],
    description: 'The size of the button',
    table: {
      type: { summary: 'string' },
      defaultValue: { summary: 'md' }
    }
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether the button is disabled and non-interactive',
    table: {
      type: { summary: 'boolean' },
      defaultValue: { summary: 'false' }
    }
  }
}
```

### Usage Examples
Provide real-world usage examples.

```typescript
export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Form Actions</h3>
        <div className="space-x-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="primary">Save</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Navigation</h3>
        <div className="space-x-2">
          <Button variant="ghost">Previous</Button>
          <Button variant="primary">Next</Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Destructive Actions</h3>
        <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
          Delete
        </Button>
      </div>
    </div>
  )
};
```

## Essential Storybook Addons

### Core Addons
Essential addons for every Storybook setup.

**@storybook/addon-essentials**
Includes the most commonly used addons:
- Controls: Interactive controls for component props
- Actions: Log user interactions
- Viewport: Test responsive behavior
- Backgrounds: Test components on different backgrounds
- Toolbars: Custom toolbar items
- Docs: Automatic documentation generation

**Configuration:**
```typescript
// .storybook/main.ts
export default {
  addons: [
    '@storybook/addon-essentials'
  ]
};
```

### Accessibility Addon
Test and document accessibility features.

**Installation:**
```bash
npm install --save-dev @storybook/addon-a11y
```

**Configuration:**
```typescript
// .storybook/main.ts
export default {
  addons: [
    '@storybook/addon-a11y'
  ]
};
```

**Usage:**
```typescript
export const AccessibilityTest: Story = {
  render: () => (
    <Button aria-label="Close dialog">
      <CloseIcon />
    </Button>
  ),
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true
          }
        ]
      }
    }
  }
};
```

### Viewport Addon
Test components at different screen sizes.

**Configuration:**
```typescript
// .storybook/preview.ts
export const parameters = {
  viewport: {
    viewports: {
      mobile: {
        name: 'Mobile',
        styles: {
          width: '375px',
          height: '667px'
        }
      },
      tablet: {
        name: 'Tablet',
        styles: {
          width: '768px',
          height: '1024px'
        }
      },
      desktop: {
        name: 'Desktop',
        styles: {
          width: '1024px',
          height: '768px'
        }
      }
    }
  }
};
```

### Backgrounds Addon
Test components on different backgrounds.

**Configuration:**
```typescript
// .storybook/preview.ts
export const parameters = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dark', value: '#1a1a1a' },
      { name: 'gray', value: '#f5f5f5' }
    ]
  }
};
```

## Advanced Documentation Features

### MDX Documentation
Use MDX to create rich documentation pages.

**MDX File Example:**
```mdx
import { Meta, Story, Canvas, Controls } from '@storybook/blocks';
import { Button } from './Button';

<Meta title="Components/Button" component={Button} />

# Button Component

The Button component is a versatile UI element that can be used throughout your application.

## Basic Usage

<Canvas>
  <Story name="Default">
    <Button>Click me</Button>
  </Story>
</Canvas>

## Variants

Our button component supports four different variants:

- **Primary**: For the main action on a page
- **Secondary**: For secondary actions
- **Outline**: For subtle actions
- **Ghost**: For minimal actions

<Canvas>
  <Story name="All Variants">
    <div className="space-x-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
    </div>
  </Story>
</Canvas>

## Accessibility

The Button component is fully accessible and includes:

- Keyboard navigation support
- Screen reader compatibility
- Proper ARIA attributes
- Focus management

## Best Practices

- Use primary buttons sparingly - only for the main action
- Provide clear, actionable text
- Use appropriate button sizes for the context
- Ensure sufficient color contrast
```

### Custom Documentation Pages
Create custom documentation pages for complex topics.

**Custom Page Example:**
```typescript
// .storybook/DesignSystem.mdx
import { Meta } from '@storybook/blocks';

<Meta title="Design System/Overview" />

# Design System Overview

Our design system provides a comprehensive set of components, tokens, and guidelines for building consistent user interfaces.

## Design Tokens

Our design system is built on a foundation of design tokens that ensure consistency across all touchpoints.

### Colors

Our color palette includes primary, secondary, and neutral colors with multiple shades for each.

### Typography

We use a carefully selected typography scale that provides excellent readability and hierarchy.

### Spacing

Our spacing system is based on a consistent scale that creates visual rhythm and harmony.

## Component Library

Our component library includes over 50 components organized by category:

- **Form Components**: Inputs, selects, checkboxes, and more
- **Layout Components**: Containers, grids, and spacing utilities
- **Navigation Components**: Headers, menus, and breadcrumbs
- **Data Display Components**: Tables, lists, and cards
- **Feedback Components**: Alerts, toasts, and progress indicators

## Getting Started

To get started with our design system:

1. Install the component library
2. Import the components you need
3. Follow the usage guidelines
4. Customize using design tokens
```

## Documentation Maintenance

### Keeping Documentation Current
Documentation must be kept up-to-date with code changes.

**Maintenance Checklist:**
- [ ] Update component descriptions when APIs change
- [ ] Add new stories for new features
- [ ] Remove outdated examples
- [ ] Update screenshots and visual examples
- [ ] Review and update accessibility notes

### Documentation Reviews
Regular reviews ensure documentation quality.

**Review Process:**
1. **Technical Review**: Verify accuracy of code examples
2. **Design Review**: Ensure examples match design specifications
3. **User Review**: Test with actual users of the system
4. **Accessibility Review**: Verify accessibility documentation

### Version Control
Track documentation changes alongside code changes.

**Git Workflow:**
```bash
# Create feature branch for documentation updates
git checkout -b docs/button-component-updates

# Make documentation changes
# Update stories, add examples, fix typos

# Commit changes
git add .
git commit -m "docs: update button component documentation"

# Create pull request for review
git push origin docs/button-component-updates
```

## Common Documentation Pitfalls

### 1. Outdated Examples
Examples that don't work or use deprecated APIs.

**Solution:** Regular review and testing of all examples.

### 2. Missing Context
Documentation that doesn't explain when and why to use components.

**Solution:** Include usage guidelines and best practices.

### 3. Incomplete API Documentation
Missing or unclear prop descriptions.

**Solution:** Use TypeScript and JSDoc comments for automatic documentation.

### 4. Poor Visual Examples
Examples that don't show components in realistic contexts.

**Solution:** Create comprehensive examples that show real-world usage.

### 5. Inconsistent Formatting
Inconsistent documentation structure and formatting.

**Solution:** Establish documentation standards and templates.

## Conclusion

Good documentation is essential for the success of any design system. It serves as the communication bridge between design and development, ensuring that components are used correctly and consistently.

Storybook provides powerful tools for creating interactive documentation that serves both designers and developers. By following best practices and maintaining high standards, you can create documentation that truly adds value to your design system.

## Next Steps

1. **Set up Storybook** for your project
2. **Install essential addons** for your workflow
3. **Create comprehensive stories** for your components
4. **Write clear documentation** with examples
5. **Establish maintenance processes** to keep docs current
6. **Gather feedback** from users and iterate

Remember: Documentation is not a one-time effort. It requires ongoing maintenance and improvement to remain valuable to your team.
