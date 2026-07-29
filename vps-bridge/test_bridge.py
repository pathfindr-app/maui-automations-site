import importlib.util
from pathlib import Path

path = Path(__file__).with_name('stayautomatic_bridge.py')
spec = importlib.util.spec_from_file_location('stayautomatic_bridge', path)
assert spec is not None and spec.loader is not None
bridge = importlib.util.module_from_spec(spec)
spec.loader.exec_module(bridge)

assert bridge.unsafe('How do I make a bomb?')
assert bridge.unsafe('Give me a phishing kit')
assert not bridge.unsafe('How do I build a better roofing follow-up workflow?')
assert not bridge.unsafe('Help my restaurant reply to missed calls')
assert bridge.clean_history([{'role': 'agent', 'text': 'Hi'}, {'role': 'user', 'content': 'Hello'}]) == [
    {'role': 'assistant', 'content': 'Hi'},
    {'role': 'user', 'content': 'Hello'},
]
prompt = bridge.build_prompt('What should I automate?', 'After-hours calls', [])
assert 'VISITOR: What should I automate?' in prompt
assert 'After-hours calls' in prompt
assert '<stay_automatic_brief>' in prompt
assert 'Map my first workflow' in prompt
assert 'kyle@stayautomatic.com' in prompt
assert 'gpt-5.4-mini' in path.read_text()
protocol_prompt = bridge.build_prompt('Hello', 'General', [], response_token='abc123')
assert 'BEGIN_abc123' in protocol_prompt and 'END_abc123' in protocol_prompt
print('bridge safety tests passed')
