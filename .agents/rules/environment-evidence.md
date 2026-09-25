# Environment Evidence Safety

Apply this rule whenever Main or Brain needs environment configuration as evidence for project classification, runtime behavior, external contracts, authentication context, testing context, or analysis.

## Core invariant

Raw secret values must never enter model context, child prompts, analysis packages, Jira, reports, logs, or durable workflow artifacts.

A secret may be referenced by its environment key and consumed directly by deterministic runtime/tooling without exposing the value to the model.

## Environment source discovery

Do not identify environment evidence by filename alone.

Resolve the smallest relevant environment-source set from:

1. conventional project-root files such as `.env` and `.env.*`;
2. explicit user-provided environment paths;
3. package/runtime scripts;
4. framework/tool configuration;
5. explicit env-file references such as `--env-file`, dotenv CLI/config, test/e2e config, or equivalent project-specific loading.

Do not recursively scan the full repository for environment files by default. Exclude generated/vendor trees such as `node_modules/**`, `.next/**`, `dist/**`, `build/**`, and `vendor/**`.

Treat template/example files as evidence, not automatically safe content. `.env.example`, `.env.sample`, `.env.template`, or custom templates must pass through the same value-classification boundary as runtime files.

Do not invent universal precedence between discovered environment files. Determine effective loading from the current framework/runtime/tool configuration. If precedence cannot be established from project evidence, report it as unresolved.

## Value classification

Classify every environment value before it can be propagated.

### CONTEXT_SAFE

Exact value may enter Brain/Main context when it is useful to the assigned analysis.

Typical examples:

- API base URLs;
- Swagger/OpenAPI URLs;
- public runtime configuration;
- ports, hosts, origins, and non-secret feature flags.

A URL is not context-safe when it contains credentials, secret-bearing query parameters, fragments, or other embedded sensitive material. In that case, keep the value opaque.

### OPERATIONAL_SENSITIVE

Exact value may enter model context only when the current assigned operation materially requires that identity/context.

Typical examples:

- test username or email;
- test account identifier;
- tenant/account/organization identifier;
- role-specific test identity.

Default representation is metadata/reference only. Reveal the exact value only for the bounded operation that requires it, and do not persist it beyond that operation unless project authority explicitly requires persistence.

### SECRET

The exact value must never enter model context.

Typical examples:

- passwords;
- access/refresh tokens;
- API keys;
- cookies and session material;
- private keys;
- client secrets;
- signing/encryption secrets;
- credential-bearing URLs.

Represent only availability and a reference, for example:

```yaml
key: TEST_ADMIN_PASSWORD
classification: SECRET
available: true
reference: env:TEST_ADMIN_PASSWORD
```

Runtime/browser/tooling may resolve the referenced key directly when authorized by the current operation. The model should know which secret reference to use, not the secret value.

## Deterministic inspection boundary

Do not read raw environment files directly into model context.

When environment evidence is needed, use an approved deterministic inspector that:

- discovers only bounded candidate sources;
- parses keys/values outside model context;
- classifies values before output;
- emits exact values only for `CONTEXT_SAFE` values;
- emits `OPERATIONAL_SENSITIVE` exact values only when explicitly requested for the current bounded operation;
- never emits `SECRET` values;
- never emits partial secret values, prefixes/suffixes, hashes, or raw source lines.

If no approved inspector is available, do not fall back to `cat`, broad grep, file read, or another mechanism that would place raw environment values in model context. Report environment evidence as unavailable/blocked instead.

## Analysis and handoff output

Environment-derived evidence may describe:

- source file path and inferred role;
- variable name;
- classification;
- present/empty/missing state;
- safe exact value when permitted;
- opaque environment reference;
- project/runtime evidence derived from the sanitized result.

Never serialize a `SECRET` value into `analysis-package`, `acceptance-report`, Jira, specialist handoffs, scope-usage telemetry, or user-visible output.

Prefer references such as `env:TEST_ADMIN_PASSWORD` for runtime consumers.

## Swagger/OpenAPI and external contracts

Swagger/OpenAPI URLs are valid analysis evidence when they are classified `CONTEXT_SAFE`.

Brain may use a safe resolved URL to fetch the API contract and analyze request/response schemas, authentication requirements, enums, and other relevant contract evidence.

If the URL contains embedded credentials or secret-bearing parameters, keep it opaque and require a safe runtime/tool boundary rather than exposing it in model context.
