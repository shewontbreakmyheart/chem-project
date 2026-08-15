/* ================================================================
   INTERACTIVE QUIZ
   ================================================================
   A 5-question quiz with instant feedback, progress tracking,
   and a final score screen with answer review.

   Each question has: question text, 4 options, correct answer
   index, and an explanation shown after answering.
   ================================================================ */

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const questions: QuizQuestion[] = [
  {
    question: 'Which purification method removes dissolved salts from water?',
    options: ['Simple filtration', 'Boiling', 'Distillation', 'Chlorination'],
    correct: 2,
    explanation:
      'Distillation removes dissolved salts because the salts do not evaporate — only water turns to steam, leaving salts behind in the flask.',
  },
  {
    question: 'What does alum (Al₂(SO₄)₃) do when added to murky water?',
    options: [
      'Kills bacteria by oxidation',
      'Forms a floc that traps particles and settles them out',
      'Raises the pH of the water',
      'Dissolves all suspended solids',
    ],
    correct: 1,
    explanation:
      'Alum reacts with water to form Al(OH)₃ — a fluffy precipitate called "floc" that traps fine particles and settles to the bottom.',
  },
  {
    question: 'What is the recommended chlorine concentration for drinking water (WHO)?',
    options: ['0.01–0.1 mg/L', '0.2–5 mg/L', '10–50 mg/L', '100–500 mg/L'],
    correct: 1,
    explanation:
      'The WHO recommends 0.2–5 mg/L of free chlorine. Too little won\'t kill pathogens; too much makes water taste bad and can be harmful.',
  },
  {
    question: 'Which layer in a sand filter is primarily responsible for removing dissolved organic compounds and odours?',
    options: ['Fine sand', 'Gravel', 'Activated charcoal', 'Cotton cloth'],
    correct: 2,
    explanation:
      'Activated charcoal has millions of microscopic pores that adsorb dissolved organic compounds, chlorine, and odours — something physical filtration alone cannot do.',
  },
  {
    question: 'In the distillation apparatus, what is the purpose of the cold water jacket in the condenser?',
    options: [
      'To cool the Bunsen burner',
      'To freeze the dissolved salts',
      'To condense steam back into liquid water',
      'To filter out impurities',
    ],
    correct: 2,
    explanation:
      'Cold water flows through the condenser jacket, cooling the steam inside the inner tube so it condenses back into liquid water.',
  },
]

export function initQuiz(): void {
  const containerEl = document.getElementById('quizContainer')
  if (!containerEl) return
  const container: HTMLElement = containerEl

  let currentQuestion = 0
  let score = 0
  let answers: boolean[] = []

  /* Render the quiz interface */
  function render(): void {
    if (currentQuestion >= questions.length) {
      renderResults()
      return
    }

    const q = questions[currentQuestion]
    const progress = ((currentQuestion) / questions.length) * 100

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress">
          <span class="quiz-progress-text">Question ${currentQuestion + 1} of ${questions.length}</span>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progress}%"></div>
          </div>
          <span class="quiz-progress-text">Score: ${score}/${currentQuestion}</span>
        </div>
        <h3 class="quiz-question">${q.question}</h3>
        <div class="quiz-options" id="quizOptions">
          ${q.options
            .map(
              (opt, i) => `
            <button class="quiz-option" data-index="${i}">
              <span class="quiz-option-letter">${String.fromCharCode(65 + i)}</span>
              <span>${opt}</span>
            </button>
          `
            )
            .join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback"></div>
        <div class="quiz-nav">
          <span></span>
          <button class="btn btn-primary quiz-next-btn" id="quizNext">${currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}</button>
        </div>
      </div>
    `

    /* Wire up option buttons */
    const options = container.querySelectorAll<HTMLButtonElement>('.quiz-option')
    const feedback = container.querySelector<HTMLElement>('#quizFeedback')
    const nextBtn = container.querySelector<HTMLButtonElement>('#quizNext')

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        const selectedIndex = parseInt(opt.dataset['index'] || '0')
        const isCorrect = selectedIndex === q.correct

        answers.push(isCorrect)
        if (isCorrect) score++

        // Disable all options
        options.forEach((o) => {
          o.disabled = true
          const idx = parseInt(o.dataset['index'] || '0')
          if (idx === q.correct) {
            o.classList.add('correct')
          } else if (idx === selectedIndex) {
            o.classList.add('incorrect')
          }
        })

        // Show feedback
        if (feedback) {
          feedback.className = `quiz-feedback show ${isCorrect ? 'correct' : 'incorrect'}`
          feedback.innerHTML = `
            <strong>${isCorrect ? 'Correct!' : 'Not quite.'}</strong> ${q.explanation}
          `
        }

        // Show next button
        nextBtn?.classList.add('show')
      })
    })

    /* Wire up next button */
    nextBtn?.addEventListener('click', () => {
      currentQuestion++
      render()
    })
  }

  /* Render the results screen */
  function renderResults(): void {
    const percentage = (score / questions.length) * 100
    const circumference = 377 // 2 * PI * 60
    const offset = circumference - (percentage / 100) * circumference

    let message: string
    let scoreColor: string
    if (percentage === 100) {
      message = 'Perfect score! You\'re a water purification expert!'
      scoreColor = 'var(--success-500)'
    } else if (percentage >= 60) {
      message = 'Great job! You have a solid understanding of water purification.'
      scoreColor = 'var(--primary-500)'
    } else {
      message = 'Good effort! Review the sections above and try again.'
      scoreColor = 'var(--warning-500)'
    }

    container.innerHTML = `
      <div class="quiz-results">
        <div class="quiz-score-circle">
          <svg viewBox="0 0 140 140">
            <circle class="score-bg" cx="70" cy="70" r="60"></circle>
            <circle class="score-fill" cx="70" cy="70" r="60" style="stroke: ${scoreColor}; stroke-dashoffset: ${circumference};"></circle>
          </svg>
          <span class="quiz-score-text" style="color: ${scoreColor};">${score}/${questions.length}</span>
        </div>
        <h3>Quiz Complete!</h3>
        <p>${message}</p>
        <div class="quiz-review">
          ${questions
            .map((q, i) => {
              const isCorrect = answers[i]
              return `
              <div class="quiz-review-item">
                <div class="quiz-review-icon ${isCorrect ? 'correct' : 'incorrect'}">
                  ${isCorrect ? '✓' : '✗'}
                </div>
                <div class="quiz-review-text">
                  <strong>Q${i + 1}:</strong> ${q.question}<br>
                  <em>Answer:</em> ${q.options[q.correct]}
                </div>
              </div>
            `
            })
            .join('')}
        </div>
        <button class="btn btn-primary" id="quizRestart" style="margin-top: var(--sp-3);">Try Again</button>
      </div>
    `

    // Animate the score circle
    const scoreFill = container.querySelector<SVGCircleElement>('.score-fill')
    if (scoreFill) {
      window.requestAnimationFrame(() => {
        scoreFill.style.strokeDashoffset = String(offset)
      })
    }

    // Wire up restart button
    document.getElementById('quizRestart')?.addEventListener('click', () => {
      currentQuestion = 0
      score = 0
      answers = []
      render()
    })
  }

  /* Start the quiz */
  render()
}
