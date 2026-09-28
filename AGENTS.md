<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Platform keys use server-only `app_secrets` then runtime secrets; user credentials remain encrypted.
- Social outputs use `src/lib/post-format.ts` across site, queue, and Telegram.
- Cloud browsing uses `src/lib/cloud-browser.server.ts`; sensitive intents require owner approval.
- Supabase Function Secrets and runtime secrets are isolated write-only stores.
- Multi-step browsing lives in `src/lib/browser-agent.server.ts`; page content is untrusted and sensitive clicks stop for approval.
- Shared tools live in AppShell; employee-specific shortcuts remain in chat.
- `runEmployeeTurn` delegates out-of-specialty work via smartHandoff while keeping the conversation.
- Employee tools live in `employee-toolbelt.ts`; browser tasks stop before payment.
- Chat action commands use `chat-commands.ts`; edits use `reviseEmployeeAction`.
- All employee paths derive research depth, reasoning effort, risk, and success checks from `src/lib/turn-plan.ts`; this prevents conflicting execution decisions.
- Telegram buttons stay inside the chat: `telegram-ui*.server.ts` keep no `publicOrigin()` deep links, and manual platform credentials are collected in-chat via `src/lib/telegram-connect.server.ts` so no flow depends on the website.
- Brand data is optional per turn via `src/lib/brand-relevance.ts` (opt-out/opt-in from recent user messages); forcing the brand name into every post broke user intent.
