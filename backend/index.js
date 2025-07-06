
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const cors = require('cors')

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json()) 

app.get('/', (req, res) => {
	console.log('Received a request at /')
	res.send('Hello from our server!')
})

// POST /quizzes - Create a new quiz
app.post('/quizzes', async (req, res) => {
	try {
		const { title, questions } = req.body

		const newQuiz = await prisma.quiz.create({
			data: {
				title,
				questions: {
					create: questions.map(q => ({
						text: q.text,
						type: q.type,
						options: q.options
							? {
									create: q.options.map(opt => ({
										text: opt.text,
										isCorrect: opt.isCorrect,
									})),
							  }
							: undefined,
					})),
				},
			},
			include: {
				questions: {
					include: { options: true },
				},
			},
		})

		res.status(201).json(newQuiz)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to create quiz' })
	}
})

// GET /quizzes - List all quizzes (title + number of questions)
app.get('/quizzes', async (req, res) => {
	try {
		const quizzes = await prisma.quiz.findMany({
			select: {
				id: true,
				title: true,
				questions: {
					select: { id: true },
				},
			},
		})

		const quizzesWithCount = quizzes.map(quiz => ({
			id: quiz.id,
			title: quiz.title,
			questionCount: quiz.questions.length,
		}))

		res.json(quizzesWithCount)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to fetch quizzes' })
	}
})

// GET /quizzes/:id - Get a full quiz with questions
app.get('/quizzes/:id', async (req, res) => {
	try {
		const { id } = req.params

		const quiz = await prisma.quiz.findUnique({
			where: { id: parseInt(id) },
			include: {
				questions: {
					include: {
						options: true,
					},
				},
			},
		})

		if (!quiz) {
			return res.status(404).json({ error: 'Quiz not found' })
		}

		res.json(quiz)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to fetch quiz' })
	}
})

// DELETE /quizzes/:id - Delete a quiz
app.delete('/quizzes/:id', async (req, res) => {
	try {
		const { id } = req.params

		await prisma.quiz.delete({
			where: { id: parseInt(id) },
		})

		res.status(204).end()
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to delete quiz' })
	}
})

// DELETE /questions/:id - Delete a question and its associated options
app.delete('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.option.deleteMany({
      where: { questionId: parseInt(id) }
    });

    await prisma.question.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).end(); 
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ 
      error: 'Failed to delete question',
      details: error.message 
    });
  }
});

// POST /quizzes/:quizId/questions - Add a new question to a quiz
app.post('/quizzes/:quizId/questions', async (req, res) => {
  try {
    const { quizId } = req.params;
    const { text, type, options } = req.body;

    if (!text || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (type === 'CHECKBOX' && (!options || options.length === 0)) {
      return res.status(400).json({ error: 'Checkbox questions require options' });
    }

    const question = await prisma.question.create({
      data: {
        text,
        type,
        quizId: parseInt(quizId),
        options: type === 'CHECKBOX' ? {
          create: options.map(opt => ({
            text: opt.text,
            isCorrect: opt.isCorrect
          }))
        } : undefined
      },
      include: {
        options: true
      }
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add question' });
  }
});

// Start server
app.listen(1111, () => {
	console.log('Server listening on port 1111')
})
