import './style.css'
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { fabric } from 'fabric'; 

var notesData = JSON.parse(localStorage.getItem('notesData')) || 
[{ id: '1', date: '12 May 2024', title: 'Job Interview Preparation', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa maiores sd amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsaamet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa ' }, { id: '2', date: '13 May 2024', title: 'Grocery List', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa maiores!' }, { id: '3', date: '14 May 2024', title: 'To Do List', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa maiores!' }, { id: '4', date: '15 May 2024', title: 'Important Notes', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa maiores!' }, { id: '5', date: '16 May 2024', title: 'Grocery List', content: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus velit neque minima! Magnam nam molestias expedita, et exercitationem ipsa maiores!' }];


var currentNote = null;
var container = document.createElement('div');
container.classList.add('container');

var iconDiv = document.createElement('div');
iconDiv.classList.add('icon-div');
var addBtn = document.createElement('button');
addBtn.classList.add('add-btn');
addBtn.innerHTML = `<i class="fa-solid fa-plus"></i>`
iconDiv.appendChild(addBtn)

var taskBtn = document.createElement('button');
taskBtn.classList.add('task-btn');
taskBtn.innerHTML = `<i class="fa-solid fa-check"></i>`
iconDiv.appendChild(taskBtn)

var scribbleBtn = document.createElement('button');
scribbleBtn.classList.add('subscribe-btn');
scribbleBtn.innerHTML = `<i class="fa-solid fa-pencil"></i>`
iconDiv.appendChild(scribbleBtn)

var shareBtn = document.createElement('button');
shareBtn.classList.add('share-btn');
shareBtn.innerHTML = `<i class="fa-solid fa-share"></i>`
iconDiv.appendChild(shareBtn)

container.appendChild(iconDiv);

var notesDiv = document.createElement('div');
notesDiv.classList.add('notes-div');

container.appendChild(notesDiv);

var noteContainer = document.createElement('div');
noteContainer.classList.add('noteContainer-div');
// noteContainer.setAttribute('contenteditable', 'true');

container.appendChild(noteContainer);


document.body.appendChild(container);

function saveToLocalStorage(){
    localStorage.setItem('notesData' , JSON.stringify(notesData))
}



function renderNotes(notesData) {
    notesDiv.innerHTML = '';

    notesData.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    })

    notesData.forEach(function (data, index) {
        var noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        if (index === 0) {
            noteDiv.style.backgroundColor = 'aquamarine';
        }
        var date = document.createElement('h3');
        date.textContent = data.date;
        date.classList.add('date-heading');
        noteDiv.appendChild(date);

        var title = document.createElement('h2');
        title.textContent = data.title;
        title.classList.add('title-heading');
        noteDiv.appendChild(title);

        var content = document.createElement('p');
        content.innerHTML = data.content
        content.classList.add('content-heading');
        // content.slice(0,10);
        noteDiv.appendChild(content);

        noteDiv.addEventListener('click', function () {
            document.querySelectorAll('.note').forEach(function (note) {
                note.style.backgroundColor = '';
            });
            noteDiv.style.backgroundColor = 'aquamarine';
            renderDataInContainer(data);
        })


        notesDiv.appendChild(noteDiv);
    })


}
function handleInput(event) {
    editedElem = event.target;
    editedText = editedElem.innerText.trim();
    console.log(currentNote, 'hello');


    if (editedElem.classList.contains('cont-title')) {
        currentNote.title = editedText;
        // console.log(notesData[index]);
    } else if (editedElem.classList.contains('cont-content')) {
        currentNote.content = editedText;
    }
    changeDate();
    saveToLocalStorage();
    renderNotes(notesData);

}

function changeDate() {
    currentNote.date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function renderDataInContainer(note, index) {
    currentNote = note;
    noteContainer.innerHTML = '';

    // var quillDiv = document.createElement('div');
    // quillDiv.classList.add('quillDiv');
    // noteContainer.appendChild(quillDiv);
    // const quill = new Quill('.quillDiv', {
    //     theme: 'snow'
    // });

    // var editor = document.querySelector('.ql-editor');

    var date = document.createElement('h3');
    date.textContent = note.date;
    date.classList.add('cont-date');
    // date.setAttribute('contenteditable', 'true');
    noteContainer.appendChild(date);

    var title = document.createElement('p');
    title.textContent = note.title;
    title.classList.add('cont-title');
    title.setAttribute('contenteditable', 'true');
    
    noteContainer.appendChild(title);

    
    if (note.typeOf === 'drawing') {
        var drawingDiv = document.createElement('div');
        drawingDiv.classList.add('drawing-canvas');
        drawingDiv.innerHTML = '<canvas id="drawingCanvas" ></canvas>';
        noteContainer.appendChild(drawingDiv);

        var canvas = new fabric.Canvas('drawingCanvas', {
            isDrawingMode: true
        });
        canvas.setHeight(400); 
        canvas.setWidth(noteContainer.clientWidth);
       

        if (note.content.includes('<img')) {
            var imgSrc = note.content.match(/src="([^"]+)"/)[1];
            fabric.Image.fromURL(imgSrc, function (img) {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
            });
        }
        canvas.on('object:modified', function () {
            autoSaveDrawing(canvas);
        });
        canvas.on('path:created', function () {
            autoSaveDrawing(canvas);
        });
        var clearButton = document.createElement('button');
        clearButton.textContent = 'Clear Canvas';
        clearButton.classList.add('clear-btn');
        noteContainer.appendChild(clearButton);

        clearButton.addEventListener('click', function () {
            canvas.clear();
            // currentNote.content = '';
            for (let i = 0; i < notesData.length; i++) {
                if (notesData[i].id === currentNote.id) {
                    notesData[i].content = '';
                }
            }
            saveToLocalStorage(); 
            renderNotes(notesData); 
        });

        
        // var saveButton = document.createElement('button');
        // saveButton.textContent = 'Save Drawing';
        // saveButton.className = 'saveBtn';
        // noteContainer.appendChild(saveButton);

        // saveButton.addEventListener('click', function () {
        //     var drawingData = canvas.toDataURL('image/png');
        //     // console.log(drawingData);
        //     currentNote.content = `<img src="${drawingData}" />`;
        //     saveToLocalStorage();
        //     renderNotes(notesData);
        //     renderDataInContainer(currentNote);
        // });
    }else{
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('quillDiv');
        // contentDiv.setAttribute('contenteditable', 'true'); 
        contentDiv.innerHTML = note.content;
        noteContainer.appendChild(contentDiv);

        contentDiv.addEventListener('input', function () {
            currentNote.content = contentDiv.textContent;
            date.textContent = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
            saveToLocalStorage()
            renderNotes(notesData);

        });

        var quill = new Quill(contentDiv, {
            theme: 'snow'
        });

        quill.on('text-change', function () {
            currentNote.content = quill.root.innerHTML;
            saveToLocalStorage()
            renderNotes(notesData);
        });
    }

    noteContainer.removeEventListener('input', handleInput)

    noteContainer.addEventListener('input', handleInput);

}

function autoSaveDrawing(canvas) {
    var drawingData = canvas.toDataURL('image/png');
    currentNote.content = `<img src="${drawingData}" />`;
    saveToLocalStorage();
    renderNotes(notesData);
    renderDataInContainer(currentNote);
}

function addButton() {
    var currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    var newNoteObj = { id: String(notesData.length + 1), date: currentDate, title: 'Add Title', content: 'Add Content' };
    notesData.unshift(newNoteObj);
    saveToLocalStorage();
    renderNotes(notesData);
    renderDataInContainer(newNoteObj, 0);
}

function taskButton() {
    var currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    var newNoteObj = { id: String(notesData.length + 1), date: currentDate, title: 'To Do List', content: "Add To do's : <ul><li></li></ul>" };
    notesData.unshift(newNoteObj);
    saveToLocalStorage();
    renderNotes(notesData);
    renderDataInContainer(newNoteObj, 0);
}

function scribbleButton() {
    var currentDate = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric',  });
    var newNoteObj = { id: String(notesData.length + 1), date: currentDate, title: 'Drawing Note', content: '',typeOf:'drawing' };
    notesData.unshift(newNoteObj);
    saveToLocalStorage();
    renderNotes(notesData);
    renderDataInContainer(newNoteObj, 0);

    // noteContainer.innerHTML = '';

    // currentNote.content = drawingDiv.innerHTML;
}
addBtn.addEventListener('click', addButton);
taskBtn.addEventListener('click', taskButton);
scribbleBtn.addEventListener('click', scribbleButton)

renderNotes(notesData);
renderDataInContainer(notesData[0]);
