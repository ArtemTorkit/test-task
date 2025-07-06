import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from 'react-router-dom'

import Header from './components/Header'
import NewQuiz from './pages/NewQuiz'
import QuizList from './pages/QuizList'
import QuizDetail from './pages/QuizDetail'

function App() {
	return (
		<Router>
			<Header />
			<main className='max-w-5xl mx-auto p-4'>
				<Routes>
					<Route path='/' element={<Navigate to='/quizzes' />} />
					<Route path='/create' element={<NewQuiz />} />
					<Route path='/quizzes' element={<QuizList />} />
					<Route path='/quizzes/:id' element={<QuizDetail />} />
				</Routes>
			</main>
		</Router>
	)
}

export default App
