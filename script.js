
// 1. Grab all HTML elements
const inputElement = document.getElementById('input');
const addBtn = document.getElementById('btn');
const error = document.getElementById('ErrorPara');
const para = document.getElementById('paras'); 
const themeToggleBtn = document.getElementById('toggle-theme');
const menuToggleBtn = document.getElementById('menu-toggle');
const hidden = document.getElementById('hidden');

// Keep track of the active view filter ('all', 'active', or 'completed')
let currentFilter = 'all';

// 2. DARK MODE THEME CONTROLLER
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', () => {
  if (document.documentElement.classList.contains('dark')) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light'); 
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark'); 
  }
});

// 3. STORAGE & APPLICATION INITIALIZATION
let taskArray = JSON.parse(localStorage.getItem("todoTask")) || [];

// Render matching items based on saved preferences
function initialRender() {
  para.innerHTML = "";
  if (taskArray.length === 0) {
        para.innerHTML = `<p class="text-center text-gray-500 dark:text-gray-400 font-medium py-8 text-xl">No tasks entered yet. Add a chore to get started!</p>`;
        return;
  }
  taskArray.forEach(taskObject => {
    if (currentFilter === 'all') {
      renderTaskUI(taskObject);
    } else if (currentFilter === 'active' && !taskObject.completed) {
      renderTaskUI(taskObject);
    } else if (currentFilter === 'completed'&& taskObject.completed) {
      renderTaskUI(taskObject);
    }
  });
}
initialRender();

// 4. USER INPUT EVENT LISTENERS
inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    todo();
  }
});

addBtn.addEventListener('click', todo);

function todo() {
  error.textContent = "";
  const userInput = inputElement.value.trim();
  
  if (userInput !== "") {
    // DUPLICATE CHECK: Checks text field inside objects (case-insensitive)
    const isDuplicate = taskArray.some(task => task.text.toLowerCase() === userInput.toLowerCase());

    if (isDuplicate) {
      error.textContent = "This chore is already on your list!";
      error.style.color = 'orange'; 
      error.className = 'font-bold text-2xl text-center';
      return; 
    }

    const newTask = {
      id: crypto.randomUUID(), 
      text: userInput,
      completed: false 
    };

    taskArray.push(newTask);
    localStorage.setItem("todoTask", JSON.stringify(taskArray));

    // Refresh display
    initialRender();
    updatedUI();
    inputElement.value = ''; 

  } else {
    error.textContent = "please enter a chores !!!";
    error.style.color = 'red';
    error.className = 'font-bold text-2xl text-center';
  }
}

// 5. HELPER FUNCTION: RENDERS TASK TO SCREEN
function renderTaskUI(taskObject) {
  const listItem = document.createElement('li');
  // Added soft border for dark mode compatibility (dark:border-slate-800/60)
  listItem.className = 'flex items-center gap-[20px] font-bold ml-[10px] mb-4 border-b border-[#ebecec] dark:border-slate-800/60 pb-2';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObject.completed; 
  checkbox.className = 'w-5 h-5 cursor-pointer accent-rose-500';

  const textSpan = document.createElement('span');
  textSpan.textContent = taskObject.text;
  textSpan.className = 'flex-1'; 

  // Apply visual style on initial page render
  if (taskObject.completed) {
    textSpan.classList.add('line-through', 'text-gray-400');
  } else {
    textSpan.classList.add('text-black', 'dark:text-white');
  }

  // Handle active status toggle checkbox clicks
  checkbox.addEventListener('change', function() {
    taskObject.completed = checkbox.checked;
    localStorage.setItem("todoTask", JSON.stringify(taskArray));
    
    // Smoothly redraw to ensure filtered views match structural states instantly
    initialRender();
  });
  
  const deleteButton = document.createElement('button');
  deleteButton.innerHTML =`
  <img src="delete.svg" class="dark:invert">
  `;
  // deleteButton.className = 'bg-rose-300 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold';
  deleteButton.className = 'p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-all duration-200 flex items-center justify-center';

  
  deleteButton.addEventListener('click', function() {
    taskArray = taskArray.filter(task => task.id !== taskObject.id);
    localStorage.setItem("todoTask", JSON.stringify(taskArray));
    listItem.remove(); 
    initialRender();
    updatedUI();
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(textSpan);
  listItem.appendChild(deleteButton);

  para.prepend(listItem);
}

// 6. CLEAR ALL CONTROL ZONE
const para2 = document.createElement('p');
para2.className = 'flex justify-end relative';

const deleteAllBtn = document.createElement('button');
deleteAllBtn.innerHTML =`
<img src="/delete.svg"class="dark:invert" >
<p> All</p>
`;
deleteAllBtn.className = 'flex  gap-2 bg-[#b14a43] hover:bg-[#963b35] text-white px-4 py-2 rounded-lg font-bold mt-4 fixed bottom-4 shadow-md transition-colors duration-200 z-30';
para2.appendChild(deleteAllBtn);
para.after(para2);
deleteAllBtn.addEventListener('click', clearAll);

function clearAll(){
  taskArray = [];
  localStorage.setItem("todoTask", JSON.stringify(taskArray));
  para.innerHTML = "";
  updatedUI();
}

function updatedUI(){
  if(taskArray.length > 0){
    para2.style.display = "flex";
  } else {
    para2.style.display = "none";
  }
}
updatedUI();

// ==========================================
// 7. SIDEBAR TOGGLE & FILTER ACTIONS
// ==========================================

// Sidebar Interactive Navigation Filter Links
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

if (filterAll) {
  filterAll.addEventListener('click', () => {
    currentFilter = 'all';
    applyFilterHighlight(filterAll);
    initialRender();
  });
}
if (filterActive) {
  filterActive.addEventListener('click', () => {
    currentFilter = 'active';
    applyFilterHighlight(filterActive);
    initialRender();
  });
}
if (filterCompleted) {
  filterCompleted.addEventListener('click', () => {
    currentFilter = 'completed';
    applyFilterHighlight(filterCompleted);
    initialRender();
  });
}

// 2. The master function that toggles colors AND recalculates numbers
function applyFilterHighlight(activeElement) {
  // Calculate real-time numbers from your task database array
  const totalAll = taskArray.length;
  const totalActive = taskArray.filter(task => !task.completed).length;
  const totalCompleted = taskArray.filter(task => task.completed).length;

  // Instantly rewrite the text with the fresh numbers
  if (filterAll) filterAll.textContent = `All (${totalAll})`;
  if (filterActive) filterActive.textContent = `Active (${totalActive})`;
  if (filterCompleted) filterCompleted.textContent = `Completed (${totalCompleted})`;
  filterAll.className="font-bold hover:bg-white/40 dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer";
  filterActive.className="font-bold hover:bg-white/40 dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer";
  filterCompleted.className="font-bold hover:bg-white/40 dark:hover:bg-white/10 p-2 rounded-lg cursor-pointer";

  // Standard color highlight toggling
  [filterAll, filterActive, filterCompleted].forEach(el => {
    if (el) el.classList.remove('text-rose-600', 'dark:text-rose-400');
  });
  if (activeElement) activeElement.classList.add('text-rose-600', 'dark:text-rose-400');
}
