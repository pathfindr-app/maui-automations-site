import test from 'node:test'
import assert from 'node:assert/strict'
import { buildBlueprint } from '../src/blueprint.mjs'

const base = {
  business: 'Roofing company',
  teamSize: '2-10',
  goal: 'Stop inbound leads getting lost between email, texts, and our tracking sheet',
  workflow: 'Inbound leads',
  tools: ['Google Workspace', 'Google Sheets', 'Jobber'],
  access: 'I own or administer most accounts',
  risk: 'Customer communication with approval',
  channel: 'Telegram or text-style chat',
  priority: 'Reduce dropped work',
}

test('recommends a bounded operator for repeated cross-app lead work', () => {
  const result = buildBlueprint(base)
  assert.equal(result.recommendation.kind, 'AI operator')
  assert.match(result.recommendation.title, /lead/i)
  assert.match(result.boundary.humanApproval, /send|approve|commit/i)
  assert.ok(result.stack.some((item) => /Google Workspace/.test(item.name)))
  assert.ok(result.skills.some((skill) => /lead/i.test(skill)))
})

test('does not oversell an operator for one predictable internal handoff', () => {
  const result = buildBlueprint({
    ...base,
    goal: 'Copy one completed form into one internal spreadsheet',
    workflow: 'One fixed handoff',
    tools: ['Google Forms', 'Google Sheets'],
    risk: 'Internal preparation only',
    priority: 'Easiest possible start',
  })
  assert.equal(result.recommendation.kind, 'Fixed automation')
  assert.match(result.recommendation.reason, /predictable|fixed/i)
})

test('keeps financial or regulated consequences under human control', () => {
  const result = buildBlueprint({
    ...base,
    goal: 'Prepare insurance claim updates and payment decisions',
    workflow: 'Reports and claims',
    risk: 'Money, insurance, legal, or regulated decisions',
  })
  assert.match(result.boundary.humanApproval, /human|person/i)
  assert.equal(result.manifest.approvalMode, 'human_decides_and_executes')
  assert.ok(result.warnings.some((warning) => /money|insurance|regulated/i.test(warning)))
})

test('labels provider plan and API requirements as verification items', () => {
  const result = buildBlueprint(base)
  const google = result.stack.find((item) => item.name === 'Google Workspace')
  assert.ok(google)
  assert.equal(google.requirementStatus, 'verify')
  assert.match(google.requirement, /admin|OAuth|API/i)
  assert.doesNotMatch(google.requirement, /Business Standard|required plan|must upgrade/i)
})

test('returns a serializable implementation manifest without credentials', () => {
  const result = buildBlueprint(base)
  const serialized = JSON.stringify(result.manifest)
  assert.doesNotMatch(serialized, /password|secret|api[_ -]?key/i)
  assert.equal(JSON.parse(serialized).businessType, 'Roofing company')
  assert.ok(result.nextSteps.length >= 4)
})
