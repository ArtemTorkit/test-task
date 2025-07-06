import { Link } from 'react-router-dom'

const Header = () => {
	return (
		<header>
			<nav>
				<Link to='/quizzes' className='link-logo'>
					Quiz Builder
				</Link>
				<div className='space-x-4'>
					<Link to='/quizzes' className='link'>
						All Quizzes
					</Link>
					<Link to='/create' className='link'>
						Create Quiz
					</Link>
				</div>
			</nav>
		</header>
	)
}

export default Header
