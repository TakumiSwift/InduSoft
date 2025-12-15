document.addEventListener('DOMContentLoaded', function(){

    var dataId;
    var dep_id;
    var percent_up;
    var chosenRow;
    var savedRowId;
    var savedRow;
    var previousSelectedRow;

    const baseURL = 'https://localhost:7293';

    const btnGetData = document.getElementById('btnGetData');

    const btnGetDataById = document.getElementById('btnGetDataById');
        const btnGetDataByIdConfirm = document.getElementById('btnGetDataByIdConfirm');

    const btnIndexing = document.getElementById('btnIndexing');
        const btnIndexSalarysUpConfirm = document.getElementById('btnIndexSalarysUpConfirm');

    const btnChangeNote = document.getElementById('btnChangeNote');
    const btnCreateNote = document.getElementById('btnCreateNote');
        const btnNewNoteClose = document.getElementById('btnNewNoteClose');
        const btnNewNoteConfirm = document.getElementById('btnNewNoteConfirm');


    const btnDeleteNote = document.getElementById('btnDeleteNote');
        const btnDeleteNoteClose = document.getElementById('btnDeleteNoteClose');
        const btnDeleteNoteConfirm = document.getElementById('btnDeleteNoteConfirm');

    const divFormToFindDataById = document.getElementById("formToFindDataById");
        const inputFieldWithIdForSearch = document.getElementById('inputFieldWithIdForSearch');

    const divToIndexSalarys = document.getElementById('formToIndexSalarys');
        const inputDepIdForIndexing = document.getElementById('inputDepIdForIndexing');
        const inputPercentForIndexing = document.getElementById('inputPercentForIndexing');

    const divToCreateNote = document.getElementById('formToCreateNote');
        const labelNewNoteID = document.getElementById('labelNewNoteID');
        const inputNewNoteID = document.getElementById('inputNewNoteID');
        const inputNewNoteDepId = document.getElementById('inputNewNoteDepId');
        const inputNewNoteChiefId = document.getElementById('inputNewNoteChiefId');
        const inputNewNoteName = document.getElementById('inputNewNoteName');
        const inputNewNoteSalary = document.getElementById('inputNewNoteSalary');
        const h3 = document.getElementById('labelCreateNote');

    const divToDeleteNote = document.getElementById('formToDeleteNote');
        const labelDeleteNote = document.getElementById('labelDeleteNote');

    const tableTitles = document.getElementById('tableTitles');
    const tableWithData = document.getElementById('tableWithData');
    const tableContainer = document.getElementById('tableContainer');

    
    
    

    function dataToTable(data){
        tableTitles.innerHTML = `<tr><td>ID</td>
                                        <td>DEPARTMENT_ID</td>
                                        <td>CHIEF_ID</td>
                                        <td>NAME</td>
                                        <td>SALARY</td></tr>`
        if(!Array.isArray(data))
        {
            data = [data];
        }
        tableWithData.innerHTML = data.map(item =>`
            <tr data-id="${item.id}"
                data-depId="${item.department_id}"
                data-chiefId="${item.chief_id}"
                data-name="${item.name}"
                data-salary="${item.salary}">
                <td>${item.id}</td>
                <td>${item.department_id}</td>
                <td>${item.chief_id || 'это руководитель'}</td>
                <td>${item.name}</td>
                <td>${item.salary}</td></tr>`).join('');
    }

    function dataFromSqlFuncToTable(data){
        tableTitles.innerHTML = `<tr><td>ID</td>
                                        <td>DEPARTMENT_ID</td>
                                        <td>CHIEF_ID</td>
                                        <td>NAME</td>
                                        <td>OLD_SALARY</td>
                                        <td>NEW_SALARY</td></tr>`
        if(!Array.isArray(data))
        {
            data = [data];
        }
        tableWithData.innerHTML = data.map(item =>`
                <tr><td>${item.employee_id}</td>
                    <td>${item.employee_name}</td>
                    <td>${item.employee_department_id}</td>
                    <td>${item.employee_chief_id || 'это руководитель'}</td>
                    <td>${item.employee_old_salary}</td>
                    <td>${item.employee_new_salary}</td></tr>`).join('');
    }

    function showInputField(regulator,div,btnDisplay){
        
        if(regulator == 1)
        {        
        div.style.display = "block";
        btnDisplay.style.display = "none";
        } else if(regulator == 0)
        {
            div.style.display = "none";
            btnDisplay.style.display = "block";
        }
    }

    function postFormConstructor(idT,dep_idT,chief_idT,nameT,salaryT) {
        if(!isNaN(dep_idT) && dep_idT.trim() != '')
        {
            if(nameT != null && nameT.trim() != '')
            {
                if(!isNaN(salaryT) && salaryT.trim() != '')
                {
                    const requestData = {
                            id: idT ? Number(idT) : 0,
                            department_id: dep_idT,
                            chief_id: chief_idT ? Number(chief_idT) : null,
                            name: nameT,
                            salary: salaryT
                        };
                        return requestData;                        
                }                
            }
        }
        alert('Введите числовое значение в поля:DEPARTMENT_ID,SALARY; и Любое значение в поле NAME');
        return null;
    }

    async function getAllTable() {
        
        const request = await fetch(`${baseURL}/api/table/employee`);
        const result = await request.json();
        dataToTable(result);            
    }

    async function getDataById(){
        dataId = inputFieldWithIdForSearch.value;
        if(isNaN(dataId) || dataId.trim() == '')
        {
            alert('Введите Числовое значение ID сотрудника');
            return;
        }
        const request = await fetch(`${baseURL}/api/table/employee/${dataId}`);
        const requestText = await request.text();
        if(requestText == "")
        {
            alert('Указанного ID нет в списке');
            return;
        }
        const result = JSON.parse(requestText);
        dataToTable(result);
        showInputField(0,divFormToFindDataById,btnGetDataById);
    }

    async function getDataFromFunction(){
        dep_id = inputDepIdForIndexing.value;
        percent_up = inputPercentForIndexing.value;
        
        if(dep_id == null || isNaN(dep_id))
        {
            alert('Введите числовое значение Department_Id');
            return;
        }
        if(percent_up == null || isNaN(percent_up))
            {
                alert('Введите числовое значение Percent_Up');
                return;
            }
        const request = await fetch(`${baseURL}/api/table/employee/updatesalaryfordepartment?dep_id=${dep_id}&percent_up=${percent_up}`);
        const result = await request.json();
        dataFromSqlFuncToTable(result);
        showInputField(0,divToIndexSalarys,btnIndexing); 
    }

    async function sendNewNoteToServer(regulator) {
        let formToSend = null;
        if(regulator == 0)
        {
            formToSend = postFormConstructor(null,
                                            inputNewNoteDepId.value,
                                            inputNewNoteChiefId.value,
                                            inputNewNoteName.value,
                                            inputNewNoteSalary.value);
        }
        else
        {
            formToSend = postFormConstructor(inputNewNoteID.value,
                                            inputNewNoteDepId.value,
                                            inputNewNoteChiefId.value,
                                            inputNewNoteName.value,
                                            inputNewNoteSalary.value);
        }
        if(formToSend == null)
        {
            return;
        }
        const request = await fetch(`${baseURL}/api/table/employee`,{
            method: 'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify(formToSend)
        });
        const result = await request.json();
        if(regulator == 0)
        {
            showInputField(0,divToCreateNote,btnCreateNote);
        }
        else
        {
            showInputField(0,divToCreateNote,btnChangeNote);
        }
        console.log(result);
        getAllTable();
    }

    async function deleteNoteFromServer() {
        const request = await fetch(`${baseURL}/api/table/employee/${savedRowId}`,{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        showInputField(0,divToDeleteNote,btnDeleteNote);
        getAllTable();
    }

    getAllTable();




    tableWithData.addEventListener('click',function(event){
        let clickedRow = event.target.closest('tr');
        if (previousSelectedRow != null && previousSelectedRow != clickedRow)
        {
            previousSelectedRow.classList.remove('selected-row');
        }
        clickedRow.classList.add('selected-row');
        previousSelectedRow = clickedRow;
        if(clickedRow.hasAttribute('data-id'))
        {
            chosenRow = {
                id: clickedRow.dataset.id,
                depId: clickedRow.dataset.depid,
                chiefId: clickedRow.dataset.chiefid,
                name: clickedRow.dataset.name,
                salary: clickedRow.dataset.salary
            };
        }        
    });

    document.addEventListener('click', function(event) {
        const clickedInTable = event.target.closest('#tableWithData') || 
                               event.target.closest('#fullTable');
        if (!clickedInTable) 
        {
            if (previousSelectedRow)
            {
                previousSelectedRow.classList.remove('selected-row');
                previousSelectedRow.style.backgroundColor = '';
                previousSelectedRow = null;
            }
        chosenRow = null;
        }
    });

    btnGetData.addEventListener('click',getAllTable);


    btnGetDataById.addEventListener('click',() => showInputField(1,divFormToFindDataById,btnGetDataById));
    btnGetDataByIdConfirm.addEventListener('click',getDataById);


    btnIndexing.addEventListener('click',() => showInputField(1,divToIndexSalarys,btnIndexing));
    btnIndexSalarysUpConfirm.addEventListener('click',getDataFromFunction);


    btnChangeNote.addEventListener('click',function(){
        if(chosenRow == null)
        {
            alert('Выберите строку в таблице для удаления записи');
            return;
        }
        savedRow = chosenRow;
        h3.textContent = 'Редактировать запись';
        labelNewNoteID.style.display = "block";
        inputNewNoteID.style.display = "block";
        inputNewNoteID.value = chosenRow.id;
        inputNewNoteDepId.value = chosenRow.depId;
        inputNewNoteChiefId.value = chosenRow.chiefId;
        inputNewNoteName.value = chosenRow.name;
        inputNewNoteSalary.value = chosenRow.salary;
        showInputField(1,divToCreateNote,btnChangeNote);
    });
    btnCreateNote.addEventListener('click',function(){
        labelNewNoteID.style.display = "none";
        inputNewNoteID.style.display = "none";
        h3.textContent = 'Создать запись';
        showInputField(1,divToCreateNote,btnCreateNote);
    });
    btnNewNoteClose.addEventListener('click',function(){
        if(inputNewNoteID.style.display == "none")
        {
            showInputField(0,divToCreateNote,btnCreateNote);
        }
        else
        {
            showInputField(0,divToCreateNote,btnChangeNote);
        }
    });
    btnNewNoteConfirm.addEventListener('click',function(){
        if(inputNewNoteID.style.display == "block")
        {
            sendNewNoteToServer(1);
        }
        else
        {
            sendNewNoteToServer(0);
        }
    });


    btnDeleteNote.addEventListener('click',function(){
        if(chosenRow == null)
        {
            alert('Выберите строку в таблице для удаления записи');
            return;
        }
        savedRowId = chosenRow.id;
        labelDeleteNote.textContent = `Вы действительно хотите удалить запись с ID = ${chosenRow.id}?`;
        showInputField(1,divToDeleteNote,btnDeleteNote);
    });
    btnDeleteNoteClose.addEventListener('click',() => showInputField(0,divToDeleteNote,btnDeleteNote));
    btnDeleteNoteConfirm.addEventListener('click',deleteNoteFromServer);
});