import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { HelpCircle } from "lucide-react";
  import { useState } from "react";
  import { Card, CardContent } from "@/components/ui/card";
  
  const quizData = [
    {
      question:
        "Ein Kunde beschwert sich lautstark über ein fehlerhaftes Produkt. Was ist Ihre erste Reaktion?",
      answers: [
        "Sie unterbrechen den Kunden und erklären, dass es nicht Ihre Schuld ist.",
        "Sie hören aktiv zu, zeigen Empathie und entschuldigen sich für die Unannehmlichkeiten.",
        "Sie leiten den Kunden sofort an einen Vorgesetzten weiter.",
        "Sie ignorieren die Beschwerde, da der Kunde nur Dampf ablassen will.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Ein Kunde fragt nach einer Funktion, die Ihr Produkt nicht hat. Was antworten Sie?",
      answers: [
        "\"Nein, das haben wir nicht.\"",
        "\"Das ist eine interessante Idee! Auch wenn wir das im Moment nicht anbieten, kann ich Ihnen zeigen, wie Sie mit den vorhandenen Funktionen ein ähnliches Ergebnis erzielen können.\"",
        "\"Warum brauchen Sie das überhaupt?\"",
        "\"Das wird vielleicht in Zukunft entwickelt.\"",
      ],
      correctAnswer: 1,
    },
    {
      question: "Wie beenden Sie ein positives Kundengespräch am besten?",
      answers: [
        "Schnell auflegen, um Zeit zu sparen.",
        "Die besprochenen Lösungen zusammenfassen und sich für das Gespräch bedanken.",
        "Dem Kunden ein weiteres Produkt verkaufen.",
        "Fragen, ob er an einer Umfrage teilnehmen möchte.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Ein Kunde beschwert sich auf Social Media über Ihr Unternehmen. Wie reagieren Sie?",
      answers: [
        "Ignorieren, um kein Aufsehen zu erregen.",
        "Öffentlich freundlich antworten, sich entschuldigen und eine Lösung anbieten, dann privat Details klären.",
        "Den Beitrag melden, damit er entfernt wird.",
        "Dem Kunden öffentlich widersprechen und die Fakten klarstellen.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Ein Stammkunde droht, den Service zu kündigen, weil er mit den Preisen unzufrieden ist. Wie gehen Sie vor?",
      answers: [
        "Erklären, dass die Preise nicht verhandelbar sind.",
        "Die Situation analysieren, den Mehrwert betonen und gegebenenfalls einen maßgeschneiderten Rabatt oder ein Upgrade anbieten.",
        "Ihn an den Vertrieb verweisen.",
        "Diskutieren, warum die Konkurrenz sowieso teurer ist.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Der Kunde versteht eine technische Erklärung nicht und wirkt frustriert. Was tun Sie?",
      answers: [
        "Die gleiche Erklärung langsamer wiederholen.",
        "Mit einfachen Worten und Beispielen erklären und sicherstellen, dass alle Fragen beantwortet sind.",
        "Ihn an die FAQ verweisen.",
        "Einfach schweigen und warten, ob er noch Fragen stellt.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Während eines Telefongesprächs unterbricht der Kunde Sie mehrmals. Wie reagieren Sie?",
      answers: [
        "Sie weisen ihn darauf hin, dass Unterbrechungen unhöflich sind.",
        "Sie hören geduldig zu, machen sich Notizen und reagieren erst, wenn der Kunde fertig ist.",
        "Sie sprechen einfach lauter weiter.",
        "Sie beenden das Gespräch.",
      ],
      correctAnswer: 1,
    },
    {
      question:
        "Ein Kunde fragt nach einer Erstattung außerhalb der offiziellen Rückgabefrist. Was ist der beste Ansatz?",
      answers: [
        "Strikt die Rückgaberichtlinie zitieren und die Anfrage ablehnen.",
        "Fall prüfen, Verständnis zeigen und eine faire Lösung anbieten, z. B. Teilerstattung oder Gutschein, basierend auf Firmenrichtlinien.",
        "Den Kunden bitten, eine schriftliche Beschwerde einzureichen.",
        "Dem Kunden sagen, dass Ausnahmen nie möglich sind.",
      ],
      correctAnswer: 1,
    },
  ];
  
  export function QuizDialog() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
  
    const handleAnswerClick = (index: number) => {
      setSelectedAnswer(index);
      if (index === quizData[currentQuestionIndex].correctAnswer) {
        setScore(score + 1);
      }
      setShowResult(true);
    };
  
    const handleNextQuestion = () => {
      setShowResult(false);
      setSelectedAnswer(null);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    };
  
    const handleRestartQuiz = () => {
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setScore(0);
    };
  
    const currentQuestion = quizData[currentQuestionIndex];
  
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Quiz
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Kundenanfragen-Quiz
            </DialogTitle>
          </DialogHeader>
          <div>
            {currentQuestionIndex < quizData.length ? (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">
                    {currentQuestion.question}
                  </h3>
                  <div className="space-y-2">
                    {currentQuestion.answers.map((answer, index) => (
                      <Button
                        key={index}
                        variant={
                          selectedAnswer === index
                            ? index === currentQuestion.correctAnswer
                              ? "default"
                              : "destructive"
                            : "outline"
                        }
                        className="w-full justify-start text-left h-auto whitespace-normal"
                        onClick={() => !showResult && handleAnswerClick(index)}
                        disabled={showResult}
                      >
                        {answer}
                      </Button>
                    ))}
                  </div>
                  {showResult && (
                    <div className="mt-4 text-center">
                      <p className="font-bold">
                        {selectedAnswer === currentQuestion.correctAnswer
                          ? "Richtig!"
                          : "Leider falsch."}
                      </p>
                      <Button onClick={handleNextQuestion} className="mt-2">
                        Nächste Frage
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="text-center">
                <h3 className="text-xl font-bold">Quiz beendet!</h3>
                <p className="mt-2">
                  Ihr Ergebnis: {score} von {quizData.length} richtigen Antworten.
                </p>
                <Button onClick={handleRestartQuiz} className="mt-4">
                  Quiz neu starten
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }