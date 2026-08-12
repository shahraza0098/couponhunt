'use client';

import { useActionState } from 'react';
import { loginAction } from '../actions/auth';
import { Ticket } from 'lucide-react';

const initialState = {
  error: '',
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen bg-[--ch-bg] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6"><Ticket className="w-16 h-16 text-emerald-500" /></div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-[--ch-text]">
          CouponHunt Admin
        </h2>
        <p className="mt-2 text-center text-sm text-[--ch-text-muted]">
          Sign in to manage your content
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[--ch-surface] py-8 px-4 shadow-xl border border-[--ch-border] sm:rounded-2xl sm:px-10">
          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[--ch-text-muted]">
                Admin Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-xl border-0 py-3 px-4 bg-[--ch-bg] text-[--ch-text] shadow-sm ring-1 ring-inset ring-[--ch-border] focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="Enter password"
                />
              </div>
              {state?.error && (
                <p className="mt-2 text-sm text-rose-500">{state.error}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full justify-center disabled:opacity-50"
              >
                {isPending ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
