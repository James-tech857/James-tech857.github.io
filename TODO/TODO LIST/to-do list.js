
const inputElement = document.getElementById('input');
const addBtn = document.getElementById('btn');
const choresSelect=document.getElementById('choreSelect')
const error=document.getElementById('ErrorPara');
const para = document.getElementById('paras'); // This should be a <ul> or <ol> element

// const taskArray = ["buy milk", "workout", "play football", "play games", "sleeping"];

const taskArray = [
  "make the bed",
  "wash the dishes",
  "wipe kitchen counters",
  "take out the trash",
  "sweep or vacuum floors",
  "squeegee shower walls",
  "feed pets",
  "one quick declutter session"
];
function dropdown(){
taskArray.forEach((taskEach) =>{
const option=document.createElement("option")
option.value=taskEach;
option.textContent=taskEach;
option.className="capitalize"
choresSelect.prepend(option);
})
}
dropdown();
choresSelect.addEventListener('change', (event) =>{
inputElement.value = event.target.value;
})
inputElement.addEventListener('keydown',(event)=>{
  if(event.key==='Enter'){
    todo();
    }
  })
addBtn.addEventListener('click', todo);
function todo() {
        error.textContent="";
  const userInput = inputElement.value.trim().toLowerCase();
  // 2. Check if the user's input matches ANY task in the array *before* looping
  if (taskArray.includes(userInput)) {
    // 3. Loop through the array to find and display the matching items
    taskArray.forEach((taskEach) => {
      // ONLY create a list item if it matches what the user typed
      if (taskEach === userInput) {
        // Create the list item
        const listItem = document.createElement('li');
        listItem.textContent = taskEach; 
        listItem.className='flex gap-[200px] font-bold ml-[10px]';
        // Create the delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className='bg-red-600 text-white pl-2 pr-2 pt-1 pb-1 rounded-lg font-bold mb-4';
        
        // Add delete functionality
        deleteButton.addEventListener('click', function() {
          listItem.remove(); 
        });

        // Assemble and display
        listItem.appendChild(deleteButton);
        para.prepend(listItem);
      }
    });

    // Clear input field after successfully adding
    inputElement.value = ''; 

  } else{
    // Show error if the typed task is not in the array
    error.textContent = "please enter the right task !!!";
    error.style.color = 'red';
    error.className='font-bold';
  }
}



// const inputElement = document.getElementById('input');
// const addBtn = document.getElementById('btn');
// const error = document.getElementById('ErrorPara');
// const para = document.getElementById('paras'); 

// // 1. Remove the static array. We will store API data here dynamically.
// let taskArray = [];

// // 2. Fetch the chores from the API as soon as the page loads
// async function fetchTasksFromAPI() {
//   try {
//     // Using a free, public mock API that returns a list of items
//     const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
//     const data = await response.json();
//     console.log(data);
    
//     // Extract the text titles from the API response and normalize them to lowercase
//     taskArray = data.map(item => item.title.toLowerCase());
    
//     console.log("Tasks loaded from API:", taskArray);
//   } catch (err) {
//     error.textContent = "Failed to load tasks from server.";
//     error.style.color = 'red';
//   }
// }

// // Run the fetch function immediately
// fetchTasksFromAPI();

// inputElement.addEventListener('keydown', (event) => {
//   if (event.key === 'Enter') {
//     todo();
//   }
// });

// addBtn.addEventListener('click', todo);

// function todo() {
//   error.textContent = "";
//   const userInput = inputElement.value.trim().toLowerCase();

//   // The rest of your logic remains exactly the same, but now checks the API data!
//   if (taskArray.includes(userInput)) {
//     taskArray.forEach((taskEach) => {
//       if (taskEach === userInput) {
//         const listItem = document.createElement('li');
//         listItem.textContent = taskEach + "    "; 

//         const deleteButton = document.createElement('button');
//         deleteButton.textContent = 'Delete';
        
//         deleteButton.addEventListener('click', function() {
//           listItem.remove(); 
//         });

//         listItem.appendChild(deleteButton);
//         para.prepend(listItem);
//       }
//     });

//     inputElement.value = ''; 

//   } else {
//     error.textContent = "please enter the right task!";
//     error.style.color = 'red';
//   }
// }