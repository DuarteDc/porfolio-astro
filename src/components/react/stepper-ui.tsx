import { Stepper } from 'stepper-ui'
import { FirstForm } from './stepper/first-form'
import { SecondForm } from './stepper/second-form'
export const StepperUI = () => {
  return (
    <Stepper
      wrapperClassName='w-full  mx-auto bg-white/5  rounded-lg shadow-lg p-5 shadow-md shadow-purple-500/20 text-white'
      renderStepIcon={(step, _isActive, isCompleted) => (
        <div
          className={` px-10 py-2 text-white rounded-full border border-purple-600 flex items-center justify-center  ${
            isCompleted ? 'bg-purple-600' : ''
          }`}
        >
          {isCompleted ? '✓' : step + 1} {` `}
          Step
        </div>
      )}
      steps={[
        {
          name: 'Step 1',
          component: FirstForm
        },
        {
          name: 'Step 2',
          component: SecondForm
        }
      ]}
      renderButtons={({ backStep, nextStep }) => (
        <div className='flex justify-between mt-5'>
          <button
            onClick={backStep}
            type='button'
            className='bg-purple-500/15 border border-purple-600 rounded-xl hover:border-purple-500 text-white px-4 py-2 '
          >
            Previous
          </button>
          <button
            onClick={() => {
              console.log('clicking next step')
              nextStep()
            }}
            className='bg-purple-500/15 border border-purple-600 rounded-xl hover:border-purple-500 text-white px-4 py-2 '
          >
            Next
          </button>
        </div>
      )}
    />
  )
}
