import Home from '../views/Home.vue';
import Signin from '../views/Signin.vue';
import Signup from '../views/Signup.vue';

export default [
	{
		path: '/',
		name: 'home',
		component: Home,
	},
	{
		path: '/signin',
		name: 'signin',
		component: Signin,
	},
	{
		path: '/signup',
		name: 'signup',
		component: Signup,
	},
];
