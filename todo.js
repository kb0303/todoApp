(function () {
	var tasks = [];
	const tasksList = document.getElementById('list');
	const addTaskInput = document.getElementById('add');
	const tasksCounter = document.getElementById('tasks-counter');
	const deleteTaskBtn = document.getElementsByClassName("delete");

	// Notification popup variables
	const toastLiveExample = document.getElementById('liveToast');
	let notificationText = document.getElementById('notification_text');
	let notificationTime = document.getElementById('notification_time');

	async function fetchTodos() {
		try {
			const response = await fetch('https://jsonplaceholder.typicode.com/todos');
			const data = await response.json();

			tasks = data.slice(0, 10);
			tasksCounter.innerText = tasks.length
			renderList();
		} catch (error) {
			console.log(error);
		}

	}

	function addTaskToDom(task) {
		const li = document.createElement('li');

		li.innerHTML = `
        <input type="checkbox" id="${task.id}" class="custom-checkbox" ${task.completed ? 'checked' : ''}>
        <label for="${task.id}">${task.title}</label>
        <img src="./delete.png" class="delete" data-id="${task.id}" />
	`
		tasksList.append(li)
	}

	function renderList() {
		tasksList.innerHTML = '';

		for (let i = 0; i < tasks.length; i++) {
			addTaskToDom(tasks[i])
		}
	}

	function toggleTaskStatus(taskId) {
		const selectedTask = tasks.find(t => t.id == taskId);
		if (!selectedTask) {
			showNotification("Task not found!", true)
		} else {
			if (selectedTask.completed == false) {
				selectedTask.completed = true;
			} else {
				selectedTask.completed = false;
			}
			showNotification("Task status toggled successfully", false)
		}

	}

	function deleteTask(taskId) {
		const selectedTask = tasks.findIndex(t => t.id == taskId);
		tasks.splice(selectedTask, 1);
		tasksCounter.innerText--
		renderList();
		showNotification("Task deleted successfully", false)
	}

	function addTask(task) {
		if (task) {
			console.log(task);
			tasks.push(task);
			renderList();
			tasksCounter.innerText++
			showNotification("Task Added Successfully", false)
			return;
		} else {
			showNotification("Task Can Not Be Added", true)
		}
	}

	function showNotification(title, err) {
		if (notificationText.length > 0) {
			notificationText.textContent = '';
			notificationText.textContent = title;

			let time = new Date()
			notificationTime.textContent = formatTime(time);

			const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
			toastBootstrap.show();
		}
		notificationText.textContent = title;

		let time = new Date()
		notificationTime.textContent = formatTime(time);

		const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
		toastBootstrap.show();


		if (err == true) {
			toastLiveExample.classList.add("bg-danger")
		} else {
			toastLiveExample.classList.remove("bg-danger")
		}
	}

	function handleInputKeyPress(e) {
		if (e.key == 'Enter') {
			const text = e.target.value;
			if (!text) {
				showNotification('write something to add a task', true);
				return;
			}

			const task = {
				title: text,
				id: Date.now().toString(),
				completed: false
			}

			e.target.value = '';
			addTask(task);
		}
	}

	function handleClickListener(e) {
		const target = e.target;

		if (target.className == 'delete') {
			let taskId = target.dataset.id;
			deleteTask(taskId);
			return;
		} else if (target.className == 'custom-checkbox') {
			let taskId = target.id;
			toggleTaskStatus(taskId);
			return;
		}
	}


	const formatTime = (date) => {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true
		}).format(date);
	}


	function initialiseApp() {
		fetchTodos();
		addTaskInput.addEventListener("keyup", handleInputKeyPress)
		document.addEventListener("click", handleClickListener)
	}

	initialiseApp();
})()