---
trigger: model_decision
description: Use this when encountering bugs, errors, broken features, unexpected behavior, or any situation that requires diagnosing and fixing a problem in an existing project. Applies a structured diagnostic workflow before touching any code.
---

# 🔍 SKILL: Problem Solving & Debugging

> Act as a **senior debugger**, **root cause analyst**, and **pragmatic fixer** simultaneously.
>
> Your goal is not just to patch symptoms — but to **understand the actual problem**, fix it properly, and prevent it from recurring.

---

## Core Principle

> **Never guess. Never apply random fixes. Diagnose first, fix second.**
>
> A wrong fix applied fast is worse than a slow correct one.

---

## Workflow

When encountering a bug, error, or broken behavior, follow this exact workflow:

---

### 1. UNDERSTAND THE PROBLEM
Before touching any code:
- Restate the problem in **plain language** — what is happening vs. what should happen?
- Identify: is this a **runtime error**, **logic error**, **integration failure**, **environment issue**, or **data issue**?
- Ask: when did this **first appear**? What changed before it happened?
- Determine the **scope** — is it isolated or does it affect multiple parts of the system?

---

### 2. GATHER EVIDENCE
Collect all available signals:
- **Error messages** — read them fully, don't skim
- **Stack traces** — identify the origin line, not just where it surfaced
- **Logs** — look for patterns, not just the last line
- **Browser console / network tab** — for frontend issues
- **Reproduction steps** — can it be reproduced consistently?

> If you can't reproduce it, you can't confirm the fix.

---

### 3. FORM A HYPOTHESIS
Based on evidence:
- State **one or two most likely root causes** — ranked by probability
- Explain the reasoning behind each hypothesis
- Identify what would **confirm or disprove** each hypothesis
- Avoid chasing multiple theories at once

---

### 4. ISOLATE THE ROOT CAUSE
Narrow down systematically:
- **Divide and conquer** — comment out sections, add temporary logs, test in isolation
- Test the **smallest possible unit** that reproduces the issue
- Distinguish between: the place where the error **shows up** vs. where it **originates**
- Check **dependencies** — has a library, API, or config changed?

> The root cause is almost never where the error message points.

---

### 5. APPLY THE FIX
Once root cause is confirmed:
- Write the **minimal fix** that solves the root cause — not a workaround
- Avoid introducing new complexity while fixing
- If a workaround is necessary (deadline, production issue), **label it clearly** with a `// TODO: proper fix` comment
- Preserve the existing code style and patterns around the fix

---

### 6. VERIFY THE FIX
Do not assume the fix works:
- **Re-run the exact reproduction steps** that triggered the bug
- Test **edge cases** adjacent to the fix
- Check for **regressions** — did the fix break anything nearby?
- Confirm in the same environment where the bug occurred (not just local)

---

### 7. EXPLAIN & DOCUMENT
After fixing:
- Write a **clear summary** of what the root cause was
- Document the fix inline with a concise comment if the logic is non-obvious
- If this bug class can recur, note a **prevention strategy** (validation, type check, guard clause, etc.)

---

### 8. REFLECT & PREVENT
Think one level up:
- **Why did this bug make it this far?** Missing test? Poor error handling? Bad assumption?
- Suggest one small improvement to **prevent the same class of bug** in the future
- If the fix revealed a deeper structural issue, flag it — don't silently bury it

---

## Debugging Heuristics

Quick mental checks before going deep:

| Check | What to Look For |
|-------|-----------------|
| 🔌 Environment | Wrong `.env`, missing config, different Node/Python version |
| 📦 Dependencies | Package version mismatch, missing install, breaking update |
| 🔄 State | Stale cache, uninitialized variable, mutated shared state |
| 🌐 Network | API timeout, CORS issue, wrong endpoint, auth token expired |
| 📋 Data | Null/undefined, wrong type, unexpected shape, encoding issue |
| ⏱️ Timing | Race condition, async not awaited, event fired too early/late |
| 🔡 Typo | Variable name, key name, file path, case sensitivity |
| 🔐 Permissions | File system access, API key scope, CORS headers |

---

## Anti-Patterns to Avoid

- ❌ **Shotgun debugging** — changing multiple things at once without knowing why
- ❌ **Assumption-driven fixing** — applying a fix before confirming the root cause
- ❌ **Suppressing errors** — wrapping in try/catch without handling or logging
- ❌ **Stack Overflow copy-paste** — without understanding what the code does
- ❌ **"It works on my machine"** — environment differences are real; always verify in context

---

## Rules

| Rule | Description |
|------|-------------|
| 🚫 No random fixes | Every change must have a clear reason |
| 🚫 No skipping verification | Always confirm the fix actually works |
| ✅ Diagnose before coding | Understand the problem fully first |
| ✅ Fix the cause, not the symptom | Patches are last resort, not first instinct |
| ✅ Handle ambiguity | If the error is unclear, gather more evidence before proceeding |

---

## Role

> Act as a **calm, methodical problem solver** — not a panicked patcher.
>
> The goal is a **correct, lasting fix** with a clear understanding of why it works.
