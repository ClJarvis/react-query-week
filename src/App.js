import { useQuery, useMutation, useQueryClient } from 'react-query';
import './App.css';
/// adding to test git updates

const fetchUsers = async () => {
	const response = await fetch('https://reqres.in/api/users');
	if(!response.ok){
		throw new Error('Something went wrong!');
	}
	return response.json();
};

const addUser = async user => {
	const response = await fetch('https://reqres.in/api/users', {
		method: "POST",
		body:JSON.stringify({
			first_name: user.first_name,
			last_name: user.last_name
		}),
		headers:{
			'Content-type': 'application/json; charset=UTF-8'
		}
	});
	if(!response.ok){
		throw new Error('Something went wrong!');
	}
	return response.json(); 
}

function App() {
	// call the userQueryClient
	const queryClient = useQueryClient();

	// Grab all users
  const { data: users, isLoading, error } = useQuery(
    'users',
    fetchUsers
  );
	// create mutaution to add user
	const { mutate, mutateAsync, isLoading: isAddingUser, error: addError } = useMutation(addUser);
	

	const handleAddUser = async () => {
		const newUser = await mutateAsync({first_name: 'React Query', last_name: 'Rules!'});
		console.log("this was an async mutation");
		console.log(newUser);
	//	queryClient.invalidateQueries('users');
		queryClient.setQueryData('users', oldData => ({
			...oldData, 
			data: [newUser, ...oldData.data]
		}));
		
	};

	if (isLoading) return <p>Loading</p>;
	if ( error || addError) return <p>Something went wrong ...</p>;

	console.log(users);

	  return (
	  	<div className='App'>
    	{isAddingUser ? <p>Adding user ..</p> : null}
    <button onClick={handleAddUser}>Add User</button>
      {users.data.map(user => (
      	<p key={user.id}> 
      		{user.first_name} {user.last_name}
      	</p>
      	))}
    </div>
  );
}

export default App;
