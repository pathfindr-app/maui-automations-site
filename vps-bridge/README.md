# Stay Automatic OAuth bridge

The public site sends text-only questions to this localhost bridge through Nginx. The bridge invokes ChatGPT OAuth through an isolated Hermes home with no tools, project rules, memories, plugins, or MCP servers.

## Runtime files

- Knowledge brief: `stayautomatic_knowledge.md`
- Public Hermes config template: `hermes-public-config.yaml`
- Runtime Hermes home: `/root/kyle/runtime/stayautomatic-hermes-home`
- Empty working directory: `/root/kyle/runtime/stayautomatic-chat-empty`
- Bridge secret: `/root/.hermes/stayautomatic-bridge.secret` (`0600`)

The runtime Hermes home uses a symlink to `/root/.hermes/auth.json`; OAuth credentials are not copied into this repository or Vercel.

## Install/update runtime config

```bash
install -d -m 0700 /root/kyle/runtime/stayautomatic-hermes-home
install -m 0600 vps-bridge/hermes-public-config.yaml /root/kyle/runtime/stayautomatic-hermes-home/config.yaml
ln -sfn /root/.hermes/auth.json /root/kyle/runtime/stayautomatic-hermes-home/auth.json
install -m 0644 vps-bridge/stayautomatic-ai-bridge.service /etc/systemd/system/stayautomatic-ai-bridge.service
systemctl daemon-reload
systemctl restart stayautomatic-ai-bridge.service
```

## Verification

```bash
python3 vps-bridge/test_bridge.py
systemctl is-active stayautomatic-ai-bridge.service
curl -fsS https://stayautomatic-api.178-105-28-39.sslip.io/health
```

The model response must satisfy a random per-request output-marker protocol. Missing markers fail closed so reasoning or CLI noise cannot be returned publicly.
