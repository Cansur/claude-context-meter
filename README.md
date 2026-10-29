# context-meter

A Claude Code mod that keeps a one-line meter in the status line under the prompt, so you always see how full the context window is and how much of your subscription usage windows you have spent.

```
token [█████████░░░░░░░░░░░] 45% · 5h [██░░░░░░░░] 23% (리셋 2h13m 후) · 7d [████░░░░░░] 40% (리셋 3d5h 후) · API환산 $3.10
```

- `token` — context window fill (20-cell bar, ⚠ at 80% or more)
- `5h` / `7d` — subscription rate-limit windows and time until each resets (shown once the first response reports them; absent with an API key)
- `API환산` — what the session would cost at API prices, as `/cost` totals it (not a charge on a subscription)

It updates after every turn. Labels are in Korean.

## Install

At the prompt of a terminal session:

```
/plugin install context-meter --marketplace Cansur/claude-context-meter
```

Answer `y` to add the marketplace, then pick a scope (user scope loads it in every session).

From a shell:

```
claude plugin install context-meter --marketplace Cansur/claude-context-meter
```

In the desktop app: click + next to the prompt box, then Plugins, Add marketplace with `Cansur/claude-context-meter`, then Add plugin.

## License

MIT
