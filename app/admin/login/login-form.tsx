"use client"

import { useActionState } from "react"
import { loginAction, type LoginState } from "@/app/actions/admin-auth"

const initialState: LoginState = {}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="font-sans text-[0.7rem] uppercase tracking-eyebrow text-ink-foreground/50"
        >
          Senha de acesso
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-md border border-ink-foreground/15 bg-ink-foreground/[0.04] px-4 py-3 font-sans text-ink-foreground outline-none transition-colors placeholder:text-ink-foreground/30 focus:border-accent"
          placeholder="••••••••"
        />
      </div>

      {state.error ? (
        <p role="alert" className="font-sans text-sm text-red-400">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 font-sans text-sm font-medium uppercase tracking-wide-editorial text-ink transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Verificando…" : "Entrar"}
      </button>
    </form>
  )
}
