"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../lib/api";
import type { QuizAnswer, QuizSheet } from "../lib/extras";
import { qp } from "../lib/paths";

// The compatibility questionnaire, one topic at a time. Answers save when you
// move on, so it can be done in pieces.
export default function Quiz() {
  const [sheet, setSheet] = useState<QuizSheet | null>(null);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [step, setStep] = useState(0);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api<QuizSheet>("/quiz")
      .then((s) => {
        setSheet(s);
        setAnswers(s.answers);
        // Pick up at the first topic with something left to answer.
        const next = s.areas.findIndex((a) => a.questions.some((q) => !s.answers[q.key]));
        setStep(next === -1 ? 0 : next);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (!sheet) return error ? <p className="qp-error mx-auto max-w-2xl" role="alert">{error}</p> : <p className="qp-muted py-16 text-center">Loading…</p>;

  const area = sheet.areas[step];
  const answered = Object.keys(answers).length;
  const last = step === sheet.areas.length - 1;

  function pick(key: string, answer: number) {
    setAnswers((a) => ({ ...a, [key]: { answer, importance: a[key]?.importance ?? 1 } }));
    setDirty((d) => new Set(d).add(key));
  }
  function weigh(key: string, importance: number) {
    setAnswers((a) => (a[key] ? { ...a, [key]: { ...a[key], importance } } : a));
    setDirty((d) => new Set(d).add(key));
  }

  async function save(): Promise<boolean> {
    if (dirty.size === 0) return true;
    setSaving(true);
    setError("");
    try {
      const body = Object.fromEntries([...dirty].map((k) => [k, answers[k] ?? null]));
      const r = await api<{ answers: Record<string, QuizAnswer> }>("/quiz/answers", { method: "PUT", body: { answers: body } });
      setAnswers(r.answers);
      setDirty(new Set());
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function go(to: number) {
    if (!(await save())) return;
    if (to >= sheet!.areas.length) setDone(true);
    else {
      setStep(to);
      window.scrollTo({ top: 0 });
    }
  }

  if (done) {
    return (
      <div className="qp-card mx-auto max-w-xl space-y-4 p-8 text-center">
        <p className="text-5xl">💞</p>
        <h1 className="text-3xl font-bold">Saved</h1>
        <p className="qp-muted">
          You've answered {answered} of {sheet.total}. We use this to put better fits in front of you, and to show how you line up with someone on their profile.
          Nobody sees your individual answers.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href={qp("discover")} className="qp-btn qp-btn-primary">See who fits</Link>
          <button className="qp-btn qp-btn-ghost" onClick={() => setDone(false)}>Review my answers</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">What matters to you</h1>
        <p className="qp-muted">
          The things new couples most often trip over. Answer for yourself, then say how much it matters that a partner is close to you on it.
          Skip anything you like. Your individual answers are never shown to anyone.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold">Topic {step + 1} of {sheet.areas.length}</span>
          <span className="qp-muted">{answered} of {sheet.total} answered</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--qp-line)" }} role="progressbar" aria-valuemin={0} aria-valuemax={sheet.total} aria-valuenow={answered} aria-label="Questions answered">
          <div className="h-full rounded-full" style={{ width: `${(answered / sheet.total) * 100}%`, background: "var(--qp-teal)" }} />
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {sheet.areas.map((a, i) => {
            const complete = a.questions.every((q) => answers[q.key]);
            return (
              <button key={a.key} className="qp-navlink text-sm" aria-current={i === step ? "page" : undefined} onClick={() => go(i)} disabled={saving}>
                {complete ? "✓ " : ""}{a.title}
              </button>
            );
          })}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{area.title}</h2>
          <p className="qp-muted">{area.blurb}</p>
        </div>
        {area.questions.map((q) => {
          const mine = answers[q.key];
          return (
            <fieldset key={q.key} className="qp-card space-y-3 p-5">
              <legend className="float-left mb-3 w-full text-lg font-bold">{q.text}</legend>
              <div className="clear-both grid gap-2 sm:grid-cols-2">
                {q.options.map((o, i) => (
                  <label key={o} className="qp-option" data-on={mine?.answer === i ? "true" : undefined}>
                    <input type="radio" className="sr-only" name={q.key} checked={mine?.answer === i} onChange={() => pick(q.key, i)} />
                    {o}
                  </label>
                ))}
              </div>
              {mine && (
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="qp-muted" id={`imp-${q.key}`}>A partner being close to me on this matters:</span>
                  <div className="flex flex-wrap gap-1" role="radiogroup" aria-labelledby={`imp-${q.key}`}>
                    {sheet.importance.map((label, i) => (
                      <button key={label} type="button" role="radio" aria-checked={mine.importance === i} className="qp-chip" data-on={mine.importance === i ? "true" : undefined} onClick={() => weigh(q.key, i)}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </fieldset>
          );
        })}
      </section>

      {error && <p className="qp-error" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {step > 0 && <button className="qp-btn qp-btn-ghost" onClick={() => go(step - 1)} disabled={saving}>Back</button>}
        <button className="qp-btn qp-btn-primary" onClick={() => go(step + 1)} disabled={saving}>
          {saving ? "Saving…" : last ? "Save and finish" : "Save and continue"}
        </button>
      </div>
    </div>
  );
}
