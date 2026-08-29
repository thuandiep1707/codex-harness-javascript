# Runtime Resource Lifecycle

Apply this rule to any internal agent that starts a long-lived runtime resource such as a development server, preview server, browser process, watcher, test service, background command, or other process that may outlive the immediate command turn.

## Ownership

A runtime resource is owned only when the agent has direct evidence that it created or launched that resource during the current child-agent execution.

Track ownership immediately when the resource starts. Do not wait until task completion.

For an owned process, record the strongest available runtime identity:

- command;
- working directory;
- PID;
- process-group/session identifier when available;
- parent PID and known descendants when available;
- actual bound port(s), including auto-redirected ports;
- ownership evidence tying the resource to the current child agent and Jira Subtask.

Emit a transient `.protocols/runtime-resource-event.yaml` acquire event as soon as a long-lived owned resource is created, and a release or cleanup-failed event when its lifecycle ends. The parent Primary Controller maintains the cross-agent runtime ledger; Orchestrator receives only the cleanup evidence needed for workflow decisions.

Runtime resource events are transient coordination evidence. Do not persist them as workflow files in the product repository and do not use Jira as a live process registry.

## Cleanup contract

Resource cleanup is `finally` behavior. It applies on every exit path, including:

- completed;
- blocked;
- failed;
- interrupted;
- timeout;
- pause;
- cancel;
- revision-required.

The resource creator has first cleanup responsibility. Before returning its final report, the agent must:

1. gracefully stop each owned long-lived process when possible;
2. stop owned descendants/process group so child servers or watchers cannot remain alive;
3. escalate to forced termination only when graceful shutdown does not complete;
4. verify the owned PID/process tree is no longer running;
5. verify every known owned port is released;
6. record released and unresolved resources in `agent-report`.

Do not report `agent-ready-to-close: true` while an owned resource remains active or cleanup is unverified.

## Port safety

Never kill a process merely because it occupies a port.

Port occupancy is not ownership evidence. A port may belong to a developer-managed server or another workflow. Kill a process only when process identity/ancestry or equivalent evidence proves that the current child agent created or owns it.

If ownership is ambiguous, do not kill the process. Mark the resource unresolved and return cleanup evidence to the Primary Controller.

When a framework automatically redirects from an occupied requested port to another port, track and clean the **actual bound port**, not the requested port.

## Parent fallback

The Primary Controller owns child-agent lifecycle and the transient resource ledger across specialist executions.

If a specialist crashes, times out, is interrupted, or becomes unavailable before cleanup completes, the Primary Controller becomes fallback cleanup supervisor and attempts cleanup only for resources with sufficient ownership evidence. Orchestrator may decide that unresolved cleanup blocks workflow progress, but it does not execute process/port cleanup itself.

If safe cleanup cannot be completed or verified, report `runtime-cleanup-blocked`. Never hide an unresolved child process, process tree, or owned port leak behind a successful specialist result.
