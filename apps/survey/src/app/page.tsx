import SurveyForm from './components/SurveyForm';

export const revalidate = 60;

type Question = {
  id: number;
  text: string;
};

const FALLBACK_QUESTIONS: Question[] = [
  { id: -1, text: 'How satisfied are you with the product experience?' },
  { id: -2, text: 'What could we improve in your workflow?' },
  { id: -3, text: 'How likely are you to recommend us to a colleague?' }
];

async function loadQuestions(): Promise<Question[]> {
  const base = process.env.NEXT_PUBLIC_MAIN_API_BASE ?? 'http://localhost:3000';

  try {
    const response = await fetch(`${base}/api/questions`, {
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      console.warn('[survey] Failed to load questions from host API – using fallback questions.');
      return FALLBACK_QUESTIONS;
    }

    const data = (await response.json()) as {
      questions: Question[];
    };

    return data.questions;
  } catch (error) {
    console.warn('[survey] Unable to reach host API – using fallback questions.', error);
    return FALLBACK_QUESTIONS;
  }
}

export default async function Page() {
  const questions = await loadQuestions();

  return <SurveyForm questions={questions} />;
}
