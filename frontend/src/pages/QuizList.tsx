import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

interface Quiz {
	id: string
	title: string
	questionCount: number
}

const QuizList = () => {
	const [quizzes, setQuizzes] = useState<Quiz[]>([])

	useEffect(() => {
		fetchQuizzes()
	}, [])

	const fetchQuizzes = async () => {
		try {
			const response = await axios.get<Quiz[]>('http://localhost:1111/quizzes')
			setQuizzes(response.data)
		} catch (err) {
			console.error('Failed to fetch quizzes:', err)
		}
	}

	const handleDelete = async (id: string) => {
		if (!confirm('Are you sure you want to delete this quiz?')) return

		try {
			await axios.delete(`http://localhost:1111/quizzes/${id}`)
			setQuizzes(prev => prev.filter(quiz => quiz.id !== id))
		} catch (err) {
			console.error('Failed to delete quiz:', err)
		}
	}

	return (
		<div className='p-6 max-w-4xl mx-auto'>
			<h1 className='text-3xl font-bold mb-6'>Quiz List</h1>
			{quizzes.length === 0 ? (
				<p className='text-gray-500'>No quizzes found.</p>
			) : (
				<div className='space-y-4'>
					{quizzes.map(quiz => (
						<div
							key={quiz.id}
							className='p-4 border rounded-lg hover:bg-gray-50 transition-colors'
						>
							<div className='flex justify-between items-center'>
								<Link
									to={`/quizzes/${quiz.id}`}
									className='text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline'
								>
									{quiz.title}
								</Link>
								<div className='flex items-center space-x-4'>
									<span className='text-sm text-gray-500'>
										{quiz.questionCount} question
										{quiz.questionCount !== 1 && 's'}
									</span>
									<button
										onClick={() => handleDelete(quiz.id)}
										className='px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'
									>
										Delete
									</button>
								</div>
							</div>
						</div>
					))}
					<div className='text-center mt-8'>
						<Link
							to='/create'
							className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
						>
							Create Quiz
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default QuizList
