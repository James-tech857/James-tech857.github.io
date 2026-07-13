
// // const inputElement = document.getElementById('input');
// // const addBtn = document.getElementById('btn');
// // const error=document.getElementById('ErrorPara');
// // const para = document.getElementById('paras'); // This should be a <ul> or <ol> element

// // let taskArray = [];

// // // DATA Storage
// // const setData= localStorage.setItem("tadoTask", JSON.stringify("taskArray"));
// // taskArray=JSON.parse(localStorage.getItem("setData"))|| [];
// // console.log(taskArray);

// // inputElement.addEventListener('keydown',(event)=>{
// //   if(event.key==='Enter'){
// //     todo();
// //     }
// //   })

// // addBtn.addEventListener('click', todo);

// // function todo() {
// //   error.textContent="";
// //   const userInput = inputElement.value.trim().toLowerCase();
// //     if(userInput!==""){
// //       const listItem = document.createElement('li');
// //         listItem.textContent = userInput; 
// //         listItem.className='flex gap-[200px] font-bold ml-[10px]';
// //         // Create the delete button
// //         const deleteButton = document.createElement('button');
// //         deleteButton.textContent = 'Delete';
// //         deleteButton.className='bg-red-600 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold mb-4';
        
// //         // Add delete functionality
// //         deleteButton.addEventListener('click', function() {
// //           listItem.remove(); 
// //         });

// //         // Assemble and display
// //         listItem.appendChild(deleteButton);
// //         para.prepend(listItem);

// //         // Clear input field after successfully adding
// //         inputElement.value = ''; 

// //     }else{
// //     // Show error if the typed task is not in the array
// //     error.textContent = "please enter the right task !!!";
// //     error.style.color = 'red';
// //     error.className='font-bold';
// //   }
// // }


// const inputElement = document.getElementById('input');
// const addBtn = document.getElementById('btn');
// const error = document.getElementById('ErrorPara');
// const para = document.getElementById('paras'); 

// // 1. LOAD DATA: Correctly get your tasks array on page load
// let taskArray = JSON.parse(localStorage.getItem("todoTask")) || [];

// // 2. RENDER EXISTING DATA: Display tasks saved from your last session
// taskArray.forEach(taskText => {
//   renderTaskUI(taskText);
// });

// inputElement.addEventListener('keydown', (event) => {
//   if (event.key === 'Enter') {
//     todo();
//   }
// });

// addBtn.addEventListener('click', todo);

// function todo() {
//   error.textContent = "";
//   const userInput = inputElement.value.trim().toLowerCase();
  
//   if (userInput !== "") {
//     // 3. SAVE DATA: Add new task to array and save to LocalStorage
//     taskArray.push(userInput);
//     localStorage.setItem("todoTask", JSON.stringify(taskArray));

//     // Render the new item to the screen
//     renderTaskUI(userInput);

//     // Clear input field after successfully adding
//     inputElement.value = ''; 

//   } else {
//     error.textContent = "please enter the right task !!!";
//     error.style.color = 'red';
//     error.className = 'font-bold';
//   }
// }

// // HELPER FUNCTION: Creates the list item UI and handles deletion
// function renderTaskUI(taskText) {
//   const listItem = document.createElement('li');
//   listItem.textContent = taskText; 
//   listItem.className = 'flex gap-[200px] font-bold ml-[10px]';
  
//   const deleteButton = document.createElement('button');
//   deleteButton.textContent = 'Delete';
//   deleteButton.className = 'bg-red-600 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold mb-4';
  
//   // Update storage when an item is deleted
//   deleteButton.addEventListener('click', function() {
//     // Remove task from array
//     taskArray = taskArray.filter(task => task !== taskText);
//     // Resave updated array to LocalStorage
//     localStorage.setItem("todoTask", JSON.stringify(taskArray));
//     // Remove element from screen
//     listItem.remove(); 
//   });

//   listItem.appendChild(deleteButton);
//   para.prepend(listItem);
// }


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

  // D. Event Listener: When checkbox is checked/unchecked
  checkbox.addEventListener('change', function() {
    // Update the completed state inside our array object
    taskObject.completed = checkbox.checked;

    // Apply or remove visual line-through
    if (checkbox.checked) {
      textSpan.style.textDecoration = 'line-through';
      textSpan.style.color = '#9ca3af';
    } else {
      textSpan.style.textDecoration = 'none';
      textSpan.style.color = 'black';
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
  
