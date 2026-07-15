
const inputElement = document.getElementById('input');
const addBtn = document.getElementById('btn');
const error = document.getElementById('ErrorPara');
const para = document.getElementById('paras'); 

// 1. Grab the HTML elements we need
const themeToggleBtn = document.getElementById('toggle-theme');

// 2. Run immediately on page load to apply saved user preferences
// This checks if the user chose dark mode before, or if their system defaults to dark
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
  document.documentElement.classList.add('dark');
  savedTheme.className='text-white';
} else {
  document.documentElement.classList.remove('dark');
}

// 3. Listen for clicks on your Logo button
themeToggleBtn.addEventListener('click', () => {
  // Check if dark mode is currently active
  if (document.documentElement.classList.contains('dark')) {
    // Switch to Light Mode
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light'); // Save preference
  } else {
    // Switch to Dark Mode
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark'); // Save preference
  }
});

// localStorage.setItem("todoTask", JSON.stringify(taskArray));
// 1. LOAD DATA: Load objects instead of raw strings
let taskArray = JSON.parse(localStorage.getItem("todoTask")) || [];

// 2. RENDER EXISTING DATA: Pass the entire task object to the UI builder
taskArray.forEach(taskObject => {
  renderTaskUI(taskObject);
});

inputElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    todo();
  }
});

addBtn.addEventListener('click', todo);

function todo() {
  error.textContent = "";
  const userInput = inputElement.value.trim().toLowerCase();
  
  if (userInput !== "") {
    // NEW CODE TO CHECK IF THE CHORES ALREADY EXIST
    const isDuplicate= taskArray.some(task=>task.text.toLowerCase()===userInput.toLowerCase());
    if(isDuplicate){
      error.textContent="this chores already exist on your list";
      error.style.color="orange";
      error.className="font-bold text-[25px] text-center";
      return;
    }

    // 3. NEW STRUCTURE: Create a task object with text and completed status
    const newTask = {
      id:crypto.randomUUID(), //create Unique identifier for each array item 
      text: userInput,
      completed: false // Brand new tasks start as incomplete
    };

    taskArray.push(newTask);
    localStorage.setItem("todoTask", JSON.stringify(taskArray));

    // Render the new item object to the screen
    renderTaskUI(newTask);

    updatedUI();

    inputElement.value = ''; 

  } else {
    error.textContent = "please enter a chores !!!";
    error.style.color = 'red';
    error.className = 'font-bold text-2xl text-center';
  }
}

// HELPER FUNCTION: Builds the UI with a working checkbox
function renderTaskUI(taskObject) {
  const listItem = document.createElement('li');
  listItem.className = 'flex items-center gap-[20px] font-bold ml-[10px] mb-4 border-b border-[#ebecec]';

  // A. Create the Checkbox Element
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = taskObject.completed; // Set it checked if it was saved as true
  checkbox.className = 'w-5 h-5 cursor-pointer accent-rose-500';

  // B. Create a text container wrapper
  const textSpan = document.createElement('span');
  textSpan.textContent = taskObject.text;
  textSpan.className = 'flex-1'; // Makes text take up space so delete button stays right
  
  if (taskObject.completed) {
    textSpan.classList.add('line-through', 'text-gray-400');
  } else {
    textSpan.classList.add('text-black', 'dark:text-white');
  }


  // D. Event Listener: When checkbox is checked/unchecked
  checkbox.addEventListener('change', function() {
    // Update the completed state inside our array object
    taskObject.completed = checkbox.checked;

    // Apply or remove visual line-through
    // New dynamic code:
if (checkbox.checked) {
  textSpan.classList.add('line-through', 'text-gray-400');
  textSpan.classList.remove('text-black', 'dark:text-white');
} else {
  textSpan.classList.remove('line-through', 'text-gray-400');
  // This lets Tailwind manage light/dark colors
  textSpan.classList.add('text-black', 'dark:text-white'); 
}

    // Save the newly updated checkbox state to LocalStorage
    localStorage.setItem("todoTask", JSON.stringify(taskArray));
  });
  
  // E. Create the Delete Button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'bg-rose-400 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold mb-4';
  
  deleteButton.addEventListener('click', function() {
    // Filter by the unique ID instead of text string
    taskArray = taskArray.filter(task => task.id !== taskObject.id);
    localStorage.setItem("todoTask", JSON.stringify(taskArray));
    listItem.remove(); 
    updatedUI();
  });

  // Assemble all pieces in order: [Checkbox] [Text] [Delete Button]
  listItem.appendChild(checkbox);
  listItem.appendChild(textSpan);
  listItem.appendChild(deleteButton);

  para.prepend(listItem);
}


const para2=document.createElement('p');
para2.className='flex justify-end relative'

const deleteAllBtn=document.createElement('button');
deleteAllBtn.textContent='Delete All';
deleteAllBtn.className=' bg-rose-500 text-white pl-2  pr-2 pt-1 pb-1 rounded-lg font-bold mt-4 fixed bottom-2 ';

para2.appendChild(deleteAllBtn);
para.after(para2);
deleteAllBtn.addEventListener('click',clearAll,)

function clearAll(){
  taskArray=[];
  localStorage.setItem("todoTask", JSON.stringify(taskArray));
  para.innerHTML="";
  updatedUI();
  // deleteAllBtn.textContent="";
}

function updatedUI(){
if(taskArray.length  > 0){
para2.style.display="flex"
}else{
  para2.style.display="none"
}
}
updatedUI();
  
