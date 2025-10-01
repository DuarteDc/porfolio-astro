import { Stepper } from 'stepper-ui'
import { FirstForm } from './stepper/first-form'
import { SecondForm } from './stepper/second-form'

const StepIcon = ({
  step,
  isActive,
  isCompleted
}: {
  step: number
  isActive: boolean
  isCompleted: boolean
}) => {
  return (
    <div
      className={`px-10 py-2 text-white rounded-full border border-purple-600 flex items-center justify-center transition-all duration-300
        ${isActive ? 'shadow-purple-500/30 shadow-xl' : ''}  
        ${isCompleted ? 'bg-purple-600' : ''}`}
    >
      {isCompleted ? '✓' : step + 1} {` Step`}
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
    <div className='flex justify-between mt-5'>
      <button
        onClick={backStep}
        type='button'
        className='bg-purple-500/15 border border-purple-600 rounded-xl hover:border-purple-500 text-white px-4 py-2 transition'
      >
        Previous
      </button>
      <button
        onClick={nextStep}
        className='bg-purple-500/15 border border-purple-600 rounded-xl hover:border-purple-500 text-white px-4 py-2 transition'
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
      wrapperClassName='w-full mx-auto bg-white/5 rounded-lg shadow-lg p-5 shadow-md shadow-purple-500/20 text-white'
      renderStepIcon={(step, isActive, isCompleted) => (
        <StepIcon step={step} isActive={isActive} isCompleted={isCompleted} />
      )}
      steps={steps}
      renderButtons={({ backStep, nextStep }) => (
        <StepperButtons backStep={backStep} nextStep={nextStep} />
      )}
    />
  )
}
