var project_data = {
    "metadata": {
        "project_name": "Empty Project",
        "project_category": "unknown",
        "creator": "by You",
        "created_time": "2024-03-03",
        "description": "This is a description for this project."
    },
    "roles": [
        [
            "John Doe",
            "Musician"
        ],
        [
            "Jane Bird",
            "Designer"
        ],
        [
            "Jeremy Cave",
            "Writer"
        ]
    ],
    "settings": {
        "statusPicker": {
            "Work in Progress": "#ff8822",
            "Finished": "#55dd00",
            "Abandoned": "#EE0000"
        },
        "theme": {
            "background-color": "#aaa",
            "header-color": ['#EEEEEE', '#BBBBBB'],
            "notes-color": "#331100"
        }
    },
    "project": {
    }
};

//UI element
const mainUI = document.getElementById('UI');

document.getElementById('chapSelector').onchange = function () {
    var note = document.getElementById('isnote');
    var chap = document.getElementById('ischap')
    if (this.value === 'chapter') {
        chap.style.display = 'block';
        note.style.display = 'none';
    } else if (this.value === 'note') {
        chap.style.display = 'none';
        note.style.display = 'block';
    } else {
        chap.style.display = 'none';
        note.style.display = 'none';
    }
}

// date param
var currentTime = new Date();
var timeOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };

const mainProject = document.getElementById('project');
const settings = project_data["settings"];
const statusSelector = document.getElementById('statusSelector');
const statusArray = Object.keys(settings["statusPicker"]);

// var edit properties
var editScope = {};
var editTarget = "";
var editHolder;

// Project elements metadata
const projName = document.getElementById('projectName');
const projCategory = document.getElementById('projectCategory');
const projDesc = document.getElementById('projectDesc');
const projDateAuthor = document.getElementById('projectDateAuthor');

var breakLength = 0;
var notesLength = 0;

document.getElementById('inputFile').addEventListener('change', function () {
    loadData();
})

function process() {
    currentTime = new Date();
    mainUI.style.top = window.scrollY + 'px';
    requestAnimationFrame(process);
};
process()

function pageInit() {
    for (let i = 0; i < statusArray.length; i++) {
        var optionElement = document.createElement("option");
        optionElement.value = statusArray[i];
        optionElement.setAttribute('data-color', settings["statusPicker"][statusArray[i]]);
        optionElement.innerText = statusArray[i];
        statusSelector.appendChild(optionElement)
    };
}
pageInit();

function downloadData() {
    var dictionaryString = 'project_data = ' + JSON.stringify(project_data, null, 2) + ';';

    var blob = new Blob([dictionaryString], { type: 'application/javascript' });

    var link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = project_data['metadata']['project_name'] + '.js';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
}

function loadData() {
    var fileInput = document.getElementById('inputFile');
    if (fileInput.files.length === 0) {
        alert('Please select a file.');
        return;
    }

    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
        var fileContent = event.target.result;

        try {
            eval(fileContent);
            loadProject();
        } catch (error) {
            alert('Error loading dictionary: ' + error.message);
        }
    };

    reader.readAsText(file);
}



function loadProject() {
    // init
    mainProject.innerHTML = "";
    breakLength = 0;
    notesLength = 0;

    var chapters = Object.keys(project_data['project']);

    //Sets all the metadata values to its element
    projName.innerText = project_data['metadata']['project_name'];
    projCategory.innerText = project_data['metadata']['project_category'];
    projDateAuthor.innerText = 'by ' + project_data['metadata']['creator'] + ' created the ' + project_data['metadata']['created_time'];
    projDesc.innerText = project_data['metadata']['description'];

    // set theme
    document.body.style.backgroundColor = project_data['settings']['theme']['background-color'];
    document.getElementById('project-meta').style.background = 'linear-gradient(to bottom,' + project_data['settings']['theme']['header-color'][0] + ', ' + project_data['settings']['theme']['header-color'][1] + ')';

    //update colors
    var moyenne = (getColorMoyenne(project_data['settings']['theme']['header-color'][0]) + getColorMoyenne(project_data['settings']['theme']['header-color'][1])) / 2;
    console.log(moyenne / 255)
    if ((moyenne / 255) < 0.5) {
        document.getElementById('projectName').style.color = '#DDDDDD';
    } else {
        document.getElementById('projectName').style.color = '#222222';
    }

    for (let i = 0; i < chapters.length; i++) {
        let isDic = project_data['project'][chapters[i]];

        if (typeof isDic !== "object") {
            // if is a break 
            if (chapters[i].includes('break')) {

                const breakChap = document.createElement('div');
                breakChap.className = 'breakChap';
                mainProject.append(breakChap);

                breakChap.setAttribute('data-categoryid', chapters[i]);
                breakLength++;
                // let users delete breaks
                breakChap.onclick = function () {
                    delete project_data['project'][this.getAttribute('data-categoryid')];
                    console.log(breakLength)
                    loadProject()
                }
                // if is a notes
            } else if (chapters[i].includes('notes')) {
                const notesChap = document.createElement('div');
                notesChap.innerHTML = isDic;
                notesChap.className = 'notesChap'; notesChap.style.backgroundColor = project_data['settings']['theme']['notes-color'];
                if ((getColorMoyenne(project_data['settings']['theme']['notes-color']) / 255) < 0.5) {
                    notesChap.style.color = '#EEEEEE';
                } else {
                    notesChap.style.color = '#111111';
                }


                mainProject.append(notesChap);

                notesChap.setAttribute('data-categoryid', chapters[i]);

                notesLength++;
                // let users edit notes
                notesChap.onclick = function () {
                    console.log(this.getAttribute('data-categoryid'));
                }
            }
            continue;
        }

        // get the main values
        let chapMetadata = project_data['project'][chapters[i]]['metadata'];
        var taskList = Object.keys(project_data['project'][chapters[i]]['tasks']);

        var contDiv = document.createElement("div"); contDiv.id = "project-container"; mainProject.appendChild(contDiv); contDiv.style.backgroundColor = chapMetadata['background-color'];
        var chapDiv = document.createElement("div"); chapDiv.id = "chapters"; contDiv.appendChild(chapDiv);
        var chapList = document.createElement("div"); chapList.id = "chapter-list"; contDiv.appendChild(chapList);
        chapDiv.onmouseover = function () { popupMessage('block') }; chapDiv.onmouseout = function () { popupMessage('none') };
        chapDiv.onclick = function () { statusSelect(this) };

        // adapt text color
        var chapTextColor;

        if ((getColorMoyenne(chapMetadata['background-color']) / 255) < 0.5) {
            chapTextColor = '#EEEEEE';
        } else {
            chapTextColor = '#111111';
        };
        chapDiv.style.color = chapTextColor;

        var chapName = document.createElement("h2"); chapName.innerText = chapters[i]; chapDiv.appendChild(chapName);

        // Let user edit chapters
        chapDiv.onclick = function () {
            console.log(chapters[i]);
        }

        // Create the status icon and changes its color to the presets status
        var statusIcon = document.createElement("div"); statusIcon.className = "statusIcon"; statusIcon.id = "statusIcon"; chapDiv.appendChild(statusIcon);

        var isFinished = true;
        var tempLength = 0;

        //Creates the tasks
        for (let u = 0; u < taskList.length; u++) {
            // adjust Category status from the tasks status
            if (project_data['project'][chapters[i]]['tasks'].hasOwnProperty(taskList[u])) {
                if (!project_data['project'][chapters[i]]['tasks'][taskList[u]]['metadata']['status']) {
                    isFinished = false;
                } else {
                    tempLength += 1;
                }
            };

            let taskId = chapters[i] + "/" + taskList[u];
            var taskDiv = document.createElement("div"); taskDiv.id = 'task'; chapList.append(taskDiv);
            var taskText = document.createElement("p"); taskText.innerText = taskList[u]; taskDiv.appendChild(taskText);
            var inputBox = document.createElement("input"); inputBox.type = "checkbox"; inputBox.name = Object.keys(taskList[u])[0]; inputBox.id = taskId; taskDiv.appendChild(inputBox);

            taskDiv.style.color = chapTextColor;

            taskDiv.setAttribute('data-taskid', 'div/' + taskId);
            inputBox.setAttribute('data-taskid', 'input/' + taskId);
            taskText.setAttribute('data-taskid', 'text/' + taskId);

            let taskMetadata = project_data['project'][chapters[i]]['tasks'][taskList[u]]["metadata"];
            inputBox.checked = taskMetadata["status"];

            // allows users to 
            taskText.onclick = function () {
                console.log(this.getAttribute('data-taskid'));
            }

            // allows users to update tasks
            inputBox.onchange = function () {
                const chapter = this.parentNode.parentNode.parentNode.querySelector('div#chapters').innerText.trimEnd();
                project_data['project'][chapter]['tasks'][this.parentNode.innerText.trimEnd()]['metadata']['status'] = this.checked;
                loadProject();
            }
        };


        //Updates the category in real time
        if (isFinished && tempLength !== 0) {
            chapMetadata["status"] = 'Finished';
        } else {
            if (tempLength > 0) {
                chapMetadata["status"] = 'Work in Progress';
            } else {
                chapMetadata["status"] = 'Abandoned';
            }
        };

        statusIcon.style.backgroundColor = settings["statusPicker"][chapMetadata["status"]];

        // To create new tasks !!
        const addTaskDiv = document.createElement('div'); addTaskDiv.id = "addTask"; addTaskDiv.setAttribute('data-addtask', chapters[i]); addTaskDiv.innerText = '+'; chapList.append(addTaskDiv);
        addTaskDiv.onclick = function () {
            editScope = project_data['project'][this.getAttribute('data-addtask')]['tasks'];
            editTarget = this.getAttribute('data-addtask');
            UIvisible('taskEditor', 'flex');
        }
    };
    var addChap = document.createElement('div'); addChap.id = 'addChap'; addChap.innerHTML = '<p>+</p>'; mainProject.appendChild(addChap)
    // Add chapters here!!
    addChap.onclick = function () {
        editScope = project_data['project'];
        UIvisible('chapEditor', 'flex')
    }
    //Final debug
}
function statusSelect(obj) {
    const projectTarget = project_data['project'][obj.innerText];
    const statusIcon = obj.querySelector('#statusIcon');
    statusIcon.style.backgroundColor = "#FFF";

    setTimeout(() => {
        loadProject();
    }, 500);
}

var tempUI;
function UIvisible(ui, type) {
    mainUI.style.display = type;
    tempUI = document.getElementById(ui);
    tempUI.style.display = type;
}
function showUI(type) {
    mainUI.style.display = 'flex';
    tempUI = document.getElementById(type);
    tempUI.style.display = 'flex';
}
function hideUI(type) {
    mainUI.style.display = 'none';
    tempUI = document.getElementById(type);
    tempUI.style.display = 'none';
}
function addToProject(type) {
    if (type === 'task') {
        const taskName = document.getElementById('taskName');
        if (taskName.value === '') {
            alert('Please put a name');
            return;
        };
        project_data['project'][editTarget]['tasks'] = addToDictionaryIndex(editScope, taskName.value, { "metadata": { "status": false, "creation_date": currentTime.toLocaleString('en-US', timeOptions), "completion_date": "" } }, 999);
        document.getElementById('taskName').value = '';
    } else if (type === 'chapter') {
        var chapType = document.getElementById('chapSelector').value;
        if (chapType === 'break') {
            project_data['project'] = addToDictionaryIndex(editScope, 'break' + breakLength, '', 999);
        } else if (chapType === 'note') {
            var noteContent = document.getElementById('noteEdit').value;
            if (noteContent === '') {
                alert('Please write a note');
                return;
            }
            project_data['project'] = addToDictionaryIndex(editScope, 'notes' + notesLength, noteContent, 999);
            document.getElementById('noteEdit').value = '';
        } else {
            var chapName = document.getElementById('chapEditName').value;
            if (chapName === '') {
                alert('Please put a name');
                return;
            }
            var chapColor = document.getElementById('chapEditColor').value;
            project_data['project'] = addToDictionaryIndex(editScope, chapName, { "metadata": { "status": "Work in Progress", "creation_date": currentTime.toLocaleString('en-US', timeOptions), "completion-date": "", "background-color": chapColor }, "tasks": {} }, 999);
            document.getElementById('chapEditName').value = '';
            document.getElementById('chapEditColor').value = '#888888';
        }
    }

    editHolder = '';
    editScope = {};
    editTarget = '';

    mainUI.style.display = 'none';
    tempUI.style.display = 'none';
    tempUI = '';
    loadProject();
}