import { Stepper } from 'stepper-ui'
import { FirstForm } from './stepper/first-form'
import { SecondForm } from './stepper/second-form'

const StepIcon = ({
  label,
  isActive,
  isCompleted
}: {
  label: string
  step: number
  isActive: boolean
  isCompleted: boolean
}) => {
  return (
    <div
      className={`px-8 py-2 text-sm font-medium rounded-full border flex items-center justify-center transition-all duration-300
        ${isActive ? 'border-zinc-400 bg-zinc-800 text-zinc-100 shadow-lg shadow-zinc-500/10' : 'border-zinc-700 text-zinc-500'}
        ${isCompleted ? 'bg-zinc-100 border-zinc-100 text-zinc-900' : ''}`}
    >
      {isCompleted ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : null}
      {label && <span className={isCompleted ? 'ml-2' : 'ml-2'}>{label}</span>}
    </div>
  )
}

const StepperButtons = ({
  backStep,
  nextStep
}: {
  backStep: () => void
  nextStep: () => void
}) => {
  return (
    <div className='flex justify-between mt-8 pt-6 border-t border-zinc-800'>
      <button
        onClick={backStep}
        type='button'
        className='px-5 py-2.5 text-sm font-medium text-zinc-400 border border-zinc-700 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-600 transition-all'
      >
        Previous
      </button>
      <button
        onClick={nextStep}
        className='px-5 py-2.5 text-sm font-medium bg-zinc-100 text-zinc-900 rounded-lg hover:bg-zinc-200 transition-all'
      >
        Next
      </button>
    </div>
  )
}

const steps = [
  { name: 'Step 1', component: FirstForm },
  { name: 'Step 2', component: SecondForm }
]

export const StepperUI = () => {
  return (
    <Stepper
      wrapperClassName='w-full mx-auto'
      renderStepIcon={(label, step, isActive, isCompleted) => (
        <StepIcon
          label={label}
          step={step}
          isActive={isActive}
          isCompleted={isCompleted}
        />
      )}
      steps={steps}
      renderButtons={({ backStep, nextStep }) => (
        <StepperButtons backStep={backStep} nextStep={nextStep} />
      )}
    />
  )
}
