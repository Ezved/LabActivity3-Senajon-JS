/**
 * Lab Activity 3 — Kanban Board
 * Fill in the TODO sections. Keep UI updates flowing through render().
 */

const state = {
	tasks: [
		{ id: "t1", title: "Read the lab README", status: "todo" },
		{ id: "t2", title: "Implement render()", status: "doing" },
		{ id: "t3", title: "Demo add / move / edit / delete", status: "done" },
	],
};

const STATUSES = ["todo", "doing", "done"];

function uid() {
	return `t${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Paint every task into the correct column from state.tasks.
 * Also update the count badges ([data-count="todo|doing|done"]).`
 */

const STATUS_LABELS = { todo: "To Do", doing: "Doing", done: "Done" };

function render() {
	const bodies = {};
	for (const status of STATUSES) {
		const body = document.querySelector(`[data-column-body="${status}"]`);
		body.innerHTML = "";
		bodies[status] = body;
	}

	for (const task of state.tasks) {
		const card = document.createElement("div");
		card.className = "card";

		const title = document.createElement("h3");
		title.textContent = task.title;
		card.appendChild(title);

		const actions = document.createElement("div");
		actions.className = "card-actions";

		for (const status of STATUSES) {
			if (status === task.status) continue;
			const moveBtn = document.createElement("button");
			moveBtn.dataset.action = "move";
			moveBtn.dataset.id = task.id;
			moveBtn.dataset.status = status;
			moveBtn.textContent = `Move → ${STATUS_LABELS[status]}`;  ``` ` 
			actions.appendChild(moveBtn);
		}

		const editBtn = document.createElement("button");
		editBtn.dataset.action = "edit";
		editBtn.dataset.id = task.id;
		editBtn.textContent = "Edit";
		actions.appendChild(editBtn);

		const deleteBtn = document.createElement("button");
		deleteBtn.dataset.action = "delete";
		deleteBtn.dataset.id = task.id;
		deleteBtn.textContent = "Delete";
		actions.appendChild(deleteBtn);

		card.appendChild(actions);
		bodies[task.status].appendChild(card);
	}

	for (const status of STATUSES) {
		if (bodies[status].children.length === 0) {
			const empty = document.createElement("p");
			empty.className = "empty";
			empty.textContent = "No tasks";
			bodies[status].appendChild(empty);
		}
		const count = state.tasks.filter((t) => t.status === status).length;
		document.querySelector(`[data-count="${status}"]`).textContent = count;
	}
}

function addTask(title) {
	state.tasks.push({ id: uid(), title, status: "todo" });
}

function moveTask(id, status) {
	if (!STATUSES.includes(status)) return;
	const task = state.tasks.find((t) => t.id === id);
	if (task) task.status = status;
}

function editTask(id, title) {
	const trimmed = title.trim();
	if (!trimmed) return;
	const task = state.tasks.find((t) => t.id === id);
	if (task) task.title = trimmed;
}

function deleteTask(id) {
	if (!confirm("Delete this task?")) return;
	state.tasks = state.tasks.filter((t) => t.id !== id);
}

function init() {
	const form = document.querySelector("#task-form");
	const board = document.querySelector("#board");

	form?.addEventListener("submit", (e) => {
		e.preventDefault(); // keep the page from reloading
		const input = document.querySelector("#task-title");
		const title = input?.value.trim();
		if (!title) return;
		addTask(title);
		input.value = "";
		input.focus();
		render();
	});

	// Event delegation: one listener handles all card buttons
	board?.addEventListener("click", (e) => {
		const btn = e.target.closest("button[data-action]");
		if (!btn) return;

		const { action, id, status } = btn.dataset;

		switch (action) {
			case "move":
				moveTask(id, status);
				render();
				break;
			case "edit": {
				const task = state.tasks.find((t) => t.id === id);
				if (!task) return;
				const newTitle = prompt("Edit task title:", task.title);
				if (newTitle === null || !newTitle.trim()) return;
				editTask(id, newTitle);
				render();
				break;
			}
			case "delete":
				deleteTask(id);
				render();
				break;
		}
	});

	render();
}

document.addEventListener("DOMContentLoaded", init);
