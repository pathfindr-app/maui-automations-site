export type BlueprintInput = {
  business: string
  teamSize: string
  goal: string
  workflow: string
  tools: string[]
  access: string
  risk: string
  channel: string
  priority: string
}

export type Blueprint = {
  recommendation: { kind: string; title: string; reason: string; outcome: string }
  boundary: { systemMay: string; humanApproval: string; exception: string }
  stack: Array<{ name: string; role: string; requirement: string; requirementStatus: 'included' | 'verify' }>
  skills: string[]
  warnings: string[]
  nextSteps: string[]
  manifest: {
    version: number
    businessType: string
    teamSize: string
    primaryWorkflow: string
    desiredResult: string
    implementationClass: string
    channel: string
    tools: string[]
    accessStatus: string
    approvalMode: string
    priority: string
    skills: string[]
  }
}

export function buildBlueprint(input: BlueprintInput): Blueprint
