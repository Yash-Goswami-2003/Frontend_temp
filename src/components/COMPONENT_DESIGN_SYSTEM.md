# Component Design System

## Core Principles

### 1. Compact
- Minimal vertical spacing (`gap-1.5`, `gap-2`)
- Tight padding (`px-3 py-2`, `px-4 py-2.5`)
- No unnecessary wrapper divs
- Single-purpose components

### 2. Modern
- Rounded corners (`rounded-lg`, `rounded-xl`)
- Subtle shadows on hover/focus
- Smooth transitions (`transition-all duration-200`)
- Focus rings instead of outlines

### 3. Rich
- Multiple visual states: default, hover, focus, error, disabled
- Helper text and error messages
- Visual feedback for all interactions
- Accessible by default

### 4. Clean UX
- Clear visual hierarchy
- Consistent spacing scale
- Obvious error states
- Label + input association

## Configurable Component Rules

### 1. Props Interface
```javascript
{
  // Identity
  fieldName: string,      // Required: unique identifier, used as label fallback
  path: string,           // Required: form field path (react-hook-form)
  
  // Display
  label: string,          // Optional: label text (defaults to fieldName)
  placeholder: string,    // Optional: input placeholder
  helper: string,         // Optional: helper text below input
  
  // Behavior
  type: string,           // Optional: input type (default: 'text')
  validations: object,    // Optional: react-hook-form validation rules
  
  // Rest spread for register() output
  ...props
}
```

### 2. Form Integration
- Use `useFormContext()` to access `register` and `formState`
- Spread `register(path, validations)` on input element
- Read errors from `formState.errors[path]?.message`
- No manual `onChange`, `onBlur`, `ref` handling

### 3. Styling Pattern (Tailwind)
```javascript
// Wrapper: compact flex column
"flex flex-col gap-1.5 w-full"

// Label: subtle, clear
"text-sm font-medium text-gray-700"

// Input: rich states
"px-4 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg"
"transition-all duration-200 ease-out"
"placeholder:text-gray-400"
"hover:border-gray-300"
"focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
"disabled:bg-gray-50 disabled:text-gray-400"

// Error state (conditional)
"border-red-500 focus:border-red-500 focus:ring-red-100"

// Error message
"text-xs text-red-500 font-medium"

// Helper text
"text-xs text-gray-500"
```

### 4. State Handling
| State | Visual Treatment |
|-------|------------------|
| Default | `border-gray-200`, neutral |
| Hover | `border-gray-300`, slight lift |
| Focus | `border-blue-500`, `ring-2 ring-blue-100` |
| Error | `border-red-500`, `ring-red-100`, red message |
| Disabled | `bg-gray-50`, `text-gray-400`, no pointer |
| Valid | (No special styling, clean default) |

### 5. Accessibility
- Always pair `label` with `input` via `htmlFor` + `id`
- Use semantic HTML elements
- Error text is visible and associated
- Focus states are obvious

### 6. JSON Config Contract
All configurable components accept a config object with:
- `c_name`: Component identifier for ComponentRenderer
- `fieldName`: Human-readable field identifier
- `path`: Data path (supports nesting: `user.profile.email`)
- `label`: Display label
- `placeholder`: Input placeholder
- `helper`: Helper description
- `validations`: react-hook-form validation object

### 7. Implementation Checklist
- [ ] Props destructured with defaults where sensible
- [ ] `fieldName` or `label` used for display
- [ ] `path` used for `register()` and error lookup
- [ ] Error message displays from `formState.errors`
- [ ] Helper text shows only when no error
- [ ] Tailwind classes follow system
- [ ] No custom CSS classes (pure Tailwind)
- [ ] Component exported for `componentMap`

## Example Config
```javascript
{
  fieldName: 'email',
  path: 'user.email',
  c_name: 'TextInput',
  label: 'Email Address',
  placeholder: 'you@example.com',
  helper: 'We will never share your email',
  validations: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email'
    }
  }
}
```
