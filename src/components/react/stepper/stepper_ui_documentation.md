# StepperUI Documentation

## Overview
`StepperUI` is a **React multi-step form component** that lets users navigate through steps, validates each step, and persists form state using `localStorage`.

It is modular and consists of:
- `StepperUI` – main stepper component.
- `StepIcon` – renders step indicators with active/completed states.
- `StepperButtons` – renders navigation buttons.
- Example steps: `FirstForm` and `SecondForm`.

---

## Installation

```bash
npm install stepper-ui
```

> Ensure your project supports **TypeScript** if you want type checking.

---

## Components

### StepperUI
Main component that orchestrates all steps.

```tsx
import { StepperUI } from './components/react/stepper-ui'

export default function App() {
  return <StepperUI />
}
```

Props:

| Prop | Type | Description |
|------|------|-------------|
| `wrapperClassName` | `string` | CSS classes for the stepper container |
| `steps` | `Step[]` | Array of steps with `name` and `component` |
| `renderStepIcon` | `(step: number, isActive: boolean, isCompleted: boolean) => JSX.Element` | Optional custom step indicator |
| `renderButtons` | `(props: StepperButtonProps) => JSX.Element` | Optional custom navigation buttons |

---

### StepIcon
Renders a circular step indicator.

```tsx
<StepIcon step={0} isActive={true} isCompleted={false} />
```

- `step` – index of the step  
- `isActive` – boolean if step is currently active  
- `isCompleted` – boolean if step has been completed  

---

### StepperButtons
Navigation buttons for Previous/Next actions.

```tsx
<StepperButtons backStep={backStep} nextStep={nextStep} />
```

- `backStep` – function to go to the previous step  
- `nextStep` – function to go to the next step  

---

## Example Usage

```tsx
import { StepperUI } from './components/react/stepper-ui'

export default function App() {
  return (
    <div className="p-10 bg-gray-900 min-h-screen">
      <h1 className="text-white text-4xl mb-6">Stepper Demo</h1>
      <StepperUI />
    </div>
  )
}
```

- The stepper automatically handles **step navigation**.  
- Each step component can implement validation using the `ValidateStep` interface from `stepper-ui`.  
- State is **persisted in localStorage**, so users can refresh the page without losing data.  

---

### Defining Steps

Steps are defined as an array of objects with `name` and `component`:

```tsx
import { FirstForm } from './components/react/stepper/first-form'
import { SecondForm } from './components/react/stepper/second-form'

const steps = [
  { name: 'Personal Info', component: FirstForm },
  { name: 'Password', component: SecondForm }
]
```

`StepperUI` uses this array internally to render the step content and navigation.

---

### Customizing Step Icons

You can override how step icons are displayed:

```tsx
<StepperUI
  renderStepIcon={(step, isActive, isCompleted) => (
    <div className={`circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      {isCompleted ? '✓' : step + 1}
    </div>
  )}
/>
```

---

### Customizing Navigation Buttons

Override Previous/Next buttons:

```tsx
<StepperUI
  renderButtons={({ backStep, nextStep }) => (
    <div className="flex gap-4">
      <button onClick={backStep}>Back</button>
      <button onClick={nextStep}>Next</button>
    </div>
  )}
/>
```

---

### Notes

- `StepperUI` **must run on the client** (`client:load` in Astro or inside React).  
- Each step component should implement `canContinue()` if it requires validation.  
- The component is fully modular – you can replace icons, buttons, or step components easily.

