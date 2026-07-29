const text = (value) => String(value ?? '').trim()
const lower = (value) => text(value).toLowerCase()

const workflowProfiles = [
  { match: /lead|inquir|call|follow.?up/, title: 'Lead response coordinator', skill: 'Lead intake and follow-up', outcome: 'Capture each inquiry, prepare the next response, and create an owned follow-up record.' },
  { match: /report|claim|document/, title: 'Report preparation lane', skill: 'Document and report preparation', outcome: 'Assemble approved source material into a review-ready draft with missing items flagged.' },
  { match: /photo|deliver|folder|dropbox/, title: 'Customer delivery coordinator', skill: 'Customer photo and file delivery', outcome: 'Stage each customer delivery, verify identity and status, and preserve a completion record.' },
  { match: /social|content|post/, title: 'Content preparation lane', skill: 'Social content preparation', outcome: 'Prepare source-grounded content and place public publishing behind approval.' },
  { match: /email|inbox|admin|workspace/, title: 'Inbox and operations coordinator', skill: 'Inbox and daily operations summary', outcome: 'Turn scattered messages and open items into an owned queue with proposed next actions.' },
]

const providerRules = [
  { match: /google|gmail|drive|sheets|calendar/i, name: 'Google Workspace', requirement: 'Confirm Workspace admin role, OAuth consent policy, and API availability for the exact services during setup.' },
  { match: /microsoft|outlook|onedrive|teams/i, name: 'Microsoft 365', requirement: 'Confirm tenant administrator support, OAuth consent policy, and Graph access for the exact services during setup.' },
  { match: /jobber/i, name: 'Jobber', requirement: 'Confirm account owner or administrator access and API availability for the current subscription during setup.' },
  { match: /quickbooks/i, name: 'QuickBooks', requirement: 'Confirm company administrator access and approved app authorization; financial actions remain human-controlled.' },
  { match: /meta|instagram|facebook/i, name: 'Meta / Instagram', requirement: 'Confirm Business Portfolio ownership, page permissions, and current publishing API eligibility.' },
  { match: /dropbox/i, name: 'Dropbox', requirement: 'Confirm account ownership, approved folder scope, and OAuth app authorization.' },
  { match: /forms/i, name: 'Form intake', requirement: 'Confirm the form owner and a supported destination or webhook before connecting production submissions.' },
]

function unique(items) {
  return [...new Set(items)]
}

export function buildBlueprint(input) {
  const business = text(input.business) || 'Local business'
  const goal = text(input.goal) || 'Improve one repeated workflow'
  const workflow = text(input.workflow) || goal
  const combined = `${goal} ${workflow}`
  const toolText = (input.tools ?? []).join(' ')
  const risk = text(input.risk)
  const fixed = /one fixed|fixed handoff|copy one|predictable/i.test(combined) && (input.tools ?? []).length <= 2
  const occasional = /occasional|few times a month|write two|brainstorm/i.test(combined)
  const highRisk = /money|insurance|legal|regulated|financial|payment/i.test(`${risk} ${combined}`)
  const profile = workflowProfiles.find((candidate) => candidate.match.test(combined)) ?? {
    title: 'Business workflow coordinator',
    skill: 'Custom workflow procedure',
    outcome: 'Prepare one repeated lane with a visible owner, approval point, and completion record.',
  }

  const kind = occasional ? 'AI chat' : fixed ? 'Fixed automation' : 'AI operator'
  const reason = kind === 'Fixed automation'
    ? 'This is a predictable handoff between a small number of systems, so fixed rules are the simplest reliable starting point.'
    : kind === 'AI chat'
      ? 'This work is occasional and remains useful while a person is actively in the conversation, so a persistent operator would be unnecessary.'
      : 'This work repeats across messages, records, or tools and benefits from context, a persistent queue, and a human approval boundary.'

  const humanApproval = highRisk
    ? 'A human reviews the evidence, makes the decision, and executes every money, insurance, legal, or regulated action.'
    : /customer|public|approval|send|publish/i.test(risk)
      ? 'A person approves every customer-facing send, public publish, price, promise, and external commitment.'
      : 'A person reviews exceptions and any action that changes an external record until the pilot is proven.'

  const stack = [{
    name: kind === 'AI operator' ? 'Stay Automatic operator runtime' : kind,
    role: kind === 'AI operator' ? 'Persistent home for the approved workflow, procedure, tools, and record.' : 'Smallest implementation class that fits the job.',
    requirement: kind === 'AI operator' ? 'Choose managed or owner-controlled hosting during implementation; no infrastructure purchase is required for the blueprint.' : 'No new platform is required until the first test confirms the fit.',
    requirementStatus: 'included',
  }]

  for (const rule of providerRules) {
    if (rule.match.test(toolText) && !stack.some((item) => item.name === rule.name)) {
      stack.push({ name: rule.name, role: 'Existing business system in the proposed lane.', requirement: rule.requirement, requirementStatus: 'verify' })
    }
  }
  if (/telegram|chat|text/i.test(input.channel)) {
    stack.push({ name: 'Telegram or approved messaging channel', role: 'Requests, approvals, and exception alerts.', requirement: 'Confirm channel ownership and create a dedicated bot or integration during setup.', requirementStatus: 'verify' })
  }

  const skills = unique([
    profile.skill,
    highRisk ? 'Human approval and escalation gate' : 'Completion log and exception handoff',
    /google|microsoft|email|inbox/i.test(toolText) ? 'Workspace retrieval and preparation' : null,
  ].filter(Boolean))

  const approvalMode = highRisk
    ? 'human_decides_and_executes'
    : /customer|public|approval|send|publish/i.test(risk)
      ? 'draft_then_approve'
      : 'supervised_pilot'

  const warnings = [
    'Do not enter passwords, API keys, payment details, or other credentials in this blueprint.',
    highRisk ? 'Money, insurance, legal, and regulated decisions stay with a qualified person.' : 'Start with minimum access and keep external actions behind approval during the pilot.',
    'Provider plan, API, and OAuth requirements must be verified against the current account before implementation.',
  ]

  const nextSteps = [
    'Confirm the trigger, expected result, and one person who owns exceptions.',
    'Verify account ownership, administrator access, and provider integration eligibility.',
    `Build a draft-only version of the ${profile.title.toLowerCase()}.`,
    'Test normal, missing-information, duplicate, and tool-failure cases.',
    'Run a seven-day supervised pilot and decide whether to expand, revise, or stop.',
  ]

  return {
    recommendation: { kind, title: profile.title, reason, outcome: profile.outcome },
    boundary: {
      systemMay: kind === 'AI chat' ? 'Analyze and draft while a person is present.' : 'Read approved sources, classify routine inputs, prepare the next step, and record what happened.',
      humanApproval,
      exception: 'Stop on missing information, ambiguous identity, unsupported requests, or failed tools and route the case to the workflow owner.',
    },
    stack,
    skills,
    warnings,
    nextSteps,
    manifest: {
      version: 1,
      businessType: business,
      teamSize: text(input.teamSize),
      primaryWorkflow: profile.title,
      desiredResult: goal,
      implementationClass: kind.toLowerCase().replaceAll(' ', '_'),
      channel: text(input.channel),
      tools: unique(input.tools ?? []),
      accessStatus: text(input.access),
      approvalMode,
      priority: text(input.priority),
      skills,
    },
  }
}
