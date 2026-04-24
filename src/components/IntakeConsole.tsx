const prompts = [
  'Bottleneck: inbound leads get stuck between web forms and manual follow-up.',
  'Current tools: Gmail, Google Sheets, Jobber, QuickBooks, internal notes.',
  'Desired result: fewer dropped leads, faster response, cleaner visibility.',
]

const steps = [
  'Map the current workflow and where work is being repeated.',
  'Choose what should be automated, assisted, or custom-built.',
  'Ship a usable first system and refine it against real usage.',
]

function IntakeConsole() {
  return (
    <div className="intake-console" aria-label="Placeholder intake console">
      <div className="intake-screen">
        <div className="console-header">
          <span className="console-pill" />
          <span className="console-pill" />
          <span className="console-pill" />
          <span className="console-label">Placeholder discovery intake</span>
        </div>

        <div className="console-body">
          {prompts.map((line) => (
            <div className="console-line" key={line}>
              <span>&gt;</span>
              <p>{line}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="intake-sidebar">
        <p className="section-index">Sample engagement flow</p>
        <div className="intake-steps">
          {steps.map((step, index) => (
            <div className="intake-step" key={step}>
              <span>{`0${index + 1}`}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntakeConsole
