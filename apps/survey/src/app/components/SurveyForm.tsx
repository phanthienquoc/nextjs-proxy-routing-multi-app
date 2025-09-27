'use client';

import { useMemo, useState } from 'react';

type Props = {
  questions: Array<{ id: number; text: string }>;
};

type Answers = Record<number, string>;

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

type SubmissionError = string | null;

export default function SurveyForm({ questions }: Props) {
  const [email, setEmail] = useState('');
  const [answers, setAnswers] = useState<Answers>(() => ({}));
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState<SubmissionError>(null);

  const canSubmit = useMemo(() => {
    return email.length > 3 && questions.every((question) => Boolean(answers[question.id]?.trim()));
  }, [email, answers, questions]);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit || state === 'submitting') {
      return;
    }

    setState('submitting');
    setError(null);

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          answers: Object.fromEntries(
            Object.entries(answers).map(([id, value]) => [id, value.trim()])
          )
        })
      });

      if (!response.ok) {
        throw new Error('Unable to persist survey response.');
      }

      setState('success');
      setAnswers({});
      setEmail('');
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    }
  };

  return (
    <div>
      <header>
        <h1>Product feedback survey</h1>
        <p className="small-print">
          This page is statically generated and revalidated every minute (SGR) while submitting answers through the shared API
          in the main application.
        </p>
      </header>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          <span>Work email</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        {questions.map((question) => (
          <fieldset key={question.id}>
            <label>
              <span>{question.text}</span>
              <textarea
                name={`question-${question.id}`}
                rows={4}
                placeholder="Share your thoughts..."
                value={answers[question.id] ?? ''}
                onChange={(event) => handleAnswerChange(question.id, event.target.value)}
                required
              />
            </label>
          </fieldset>
        ))}
        <button type="submit" disabled={!canSubmit || state === 'submitting'}>
          {state === 'submitting' ? 'Submitting…' : 'Send feedback'}
        </button>
        {state === 'success' ? <p className="success">Thank you for sharing your feedback!</p> : null}
        {state === 'error' ? <p className="error">{error}</p> : null}
      </form>
    </div>
  );
}
