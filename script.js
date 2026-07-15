

// 1. Grab all HTML elements
const inputElement = document.getElementById('input');
const addBtn = document.getElementById('btn');
const error = document.getElementById('ErrorPara');
const para = document.getElementById('paras'); 
const themeToggleBtn = document.getElementById('toggle-theme');
const menuToggleBtn = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');

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
  taskArray.forEach(taskObject => {
    if (currentFilter === 'all') {
      renderTaskUI(taskObject);
    } else if (currentFilter === 'active' && !taskObject.completed) {
      renderTaskUI(taskObject);
    } else if (currentFilter === 'completed' && taskObject.completed) {
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
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'bg-rose-400 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold';
  
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
deleteAllBtn.textContent = 'Delete All';
deleteAllBtn.className = 'bg-rose-500 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold mt-4 fixed bottom-2';

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

// Mobile Click Slide/Toggle Interceptor
if (menuToggleBtn && sidebar) {
  menuToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Stops the document click event from firing instantly
    
    // Toggle mobile display mode safely using Tailwind's layout engine
    sidebar.classList.toggle('max-lg:hidden');
    
    // Inject overlay positioning mechanics only when the menu is active
    sidebar.classList.add(
      'max-lg:absolute', 
      'max-lg:z-50', 
      'max-lg:top-[76px]', 
      'max-lg:left-2', 
      'max-lg:w-[240px]',
      'max-lg:shadow-2xl'
    );
  });

  // Close mobile sidebar menu if the user clicks anywhere else on the page canvas
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && e.target !== menuToggleBtn) {
      if (window.innerWidth < 1024) { 
        sidebar.classList.add('max-lg:hidden');
      }
    }
  });
}

// Sidebar Interactive Navigation Filter Links
const filterAll = document.getElementById('filter-all');
const filterActive = document.getElementById('filter-active');
const filterCompleted = document.getElementById('filter-completed');

function applyFilterHighlight(activeElement) {
  [filterAll, filterActive, filterCompleted].forEach(el => {
    if (el) el.classList.remove('text-rose-600', 'dark:text-rose-400');
  });
  if (activeElement) activeElement.classList.add('text-rose-600', 'dark:text-rose-400');
}

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
