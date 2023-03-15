import {useState, useEffect} from 'react';

// The below code 

const API_BASE = "http://localhost:3001";

function App(){
	// Below, the useState is a "hook" or function from React that lets you make "state variables" which can change their state based on certain events which triggers them to re-render. useState takes in one value, and returns an array with two things in it. The first is the current value of the state variable, and the second is the function that is used to update that variable. So, what you see below is us setting these arrays of variables using useState. The first item in the array on the left side is the name of the state variable, and the second one is the name of the function it will use to update that variable.
	const [todos, setTodos] = useState([]); // This empty array is where out todos will be stored
	const [popupActive, setPopupActive] = useState(false);
	const [newTodo, setNewTodo] = useState("");


	useEffect(() => {
		GetTodos();
		console.log(todos);
	
	}, []) // Here we are passing an empty array, so this once it loads and the component mounts. Since array is empty there is no dependency so this happens only once. If there was an object in the array, it would trigger every time that object updated

	const GetTodos = () => {
		fetch(API_BASE + "/todos")
			.then(res => res.json())
			.then(data => setTodos(data))
			.catch(err => console.error("Error: ", err));
	}

	const completeTodo = async (id) => {
		const data = await fetch(API_BASE + "/todo/complete/" + id) // data is a Promise object returned by fetch
			.then(res => res.json());

		setTodos(todos => todos.map(todo => {
			if (todo._id === data._id){
				todo.complete = data.complete;
			}
			return todo;
		}))
	}

	const deleteTodo = async (id) => {
		const data = await fetch(API_BASE + "/todo/delete/" + id, {method: "DELETE"}) // in server.js this calls mongoose's findByIdandDelete method
			.then(res => res.json()); // Converts response to json when Promise object resolves
				// Our todo should not be equal  
			setTodos(todos => todos.filter(todo => todo._id !== data._id)); // Update todos in React component, removing the deleted todo from the array. If this line weren't there we would need to refresh page to make it go away
	}

	const deleteComplete = async () => {
		const data = await fetch (API_BASE + "/todo/delete_complete/", {method: "DELETE"})
			.then(res => res.json())
			.catch(()=>console.log("fetch in deleteComplete failed!"));
			setTodos(todos => todos.filter(todo => todo.complete === false));
	}

	const addTodo = async () => {
		const data = await fetch(API_BASE + "/todo/new", {
			method: "POST",
			headers: {
				"Content-type": "application/json"
			},
			body: JSON.stringify({
				text:newTodo
			})
			}).then(res => res.json());
			setTodos([...todos, data]);
			setPopupActive(false);
			setNewTodo("");
	}

	return (
		<div className="App">
			<h1>Welcome, Sam!</h1>
			<h4>My TODOs</h4>

			<div className="todos">
				{/* Below, map runs a function on every item in todos, and that function is our arrow/lambda function which displays the HTML divs, and dynamically fills in the text of each todo, and even dynamically updates the classes in className to reflect whether its complete or not */}
				{todos.map(todo =>(
					<div className={"todo "+(todo.complete? "is-complete": "")} key={todo._id} onClick={()=> completeTodo(todo._id)}>
						<div className="checkbox"></div>
						<div className="text">{todo.text}</div>
						<div className="delete-todo" onClick={()=> deleteTodo(todo._id)}>X</div>
					</div>
				))}
			</div>

			<div className="addPopup" onClick={()=> setPopupActive(true)}>+</div>
			<div className="deleteComplete" onClick={()=> deleteComplete()}>Delete Complete</div>

			{/* Below, we're checking if the popup is active by checking the bool of popupActive. If it is we create all these HTML divs which will be the make new popup */}
			{popupActive ? (
				<div className="popup">
					<div className="closePopup" onClick={()=> setPopupActive(false)}>X</div>
					<div className="content">
						<h3>Add Task</h3>
						{newTodo}
						<input 
						type="text"
						className="add-todo-input" 
						onChange={e => setNewTodo(e.target.value)}
						value={newTodo}></input>
					<div className="button" onClick={addTodo}>Create Task</div>
					</div>

				</div>
			): ""}

		</div>
	);
}

export default App;
