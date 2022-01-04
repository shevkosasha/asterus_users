//получаем и задизейбливаем кнопку
const addBtn = document.querySelector('.add-button');
addBtn.disabled = true;

// массив юзеров для первоначальной отрисовки
const users = [
    {name: 'Jane', age: '34', sex: 'Female'},
    {name: 'Jack', age: '28', sex: 'Male'},
    {name: 'Mike', age: '25', sex: 'Male'},
    {name: 'Rick', age: '40', sex: 'Male'},
];

// функция для изменения класса-модификатора инпутов инпутов. Если информация введена неверно, то рисуется красный бордер, иначе зеленый
const toggleClassName = (elem, className) => {    
    if (className === 'wrong') {
        elem.classList.add('wrong');
        elem.classList.remove('ok');
    }
    if (className === 'ok') {
        elem.classList.add('ok');
        elem.classList.remove('wrong');
    }            
}

//функции проверки имени, возраста и пола
const checkName =  (name) => !(name && name.length > 1 && isNaN(name));
const checkAge = (age) => !(age && age > 0 && age < 150 && !isNaN(age));
const checkSex = (sex) => {
    const currentSex = '' || sex.toLowerCase();
    const rightSex = ['male','m','female','f','мужской','м','женский','ж'];
    return !rightSex.includes(currentSex);
}  

//функция переключения состояния инпутов на форме
const updateInputState = (elem, isWrong) => {
    (isWrong) ? toggleClassName(elem, 'wrong') : toggleClassName(elem,'ok');
}
//функция обновления состояния кнопки Add. Если все данные введены верно, кнопка активна, иначе задизейблена.
const updateBtnState = (state) => addBtn.disabled = state;

//функция для форматирования имени, первая буква в UpperCase, остальные в LowerCase
const firstLetterToUppercCase = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

//функция форматирования пола. Варианты для мужскго поля приводятся к "Male", для женского к 'Female'
const formatSex = (sex) => {
    const male = ['male','m','мужской','м'];
    const female = ['female','f','женский','ж'];
    if (male.includes(sex.toLowerCase())) {
        return "Male";
    } else if (female.includes(sex.toLowerCase())) {
        return 'Female';
    }
};

//функция для добавления строк с данными добавленного юзера в таблицу
const addRow = (name, age, sex) => {

    const tBody = document.querySelector('.table-content');

    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td class = "cell name">${firstLetterToUppercCase(name)}</td>
        <td class = "cell age">${age}</td>
        <td class = "cell sex">${formatSex(sex)}</td>
        <td class="delete-button">X</td>
    `;            
    tBody.append(tr);
};


//обработчик инпутов формы
document.addEventListener('input',(e) => {
    if (e.target.tagName === 'INPUT'){
        e.preventDefault();
        // получаем значения инпутов
        const name = document.querySelector('.user-name').value;
        const age = document.querySelector('.user-age').value;
        const sex = document.querySelector('.user-sex').value;
        //проверяем значения на соответствие заданным условиям
        const isNameWrong = checkName(name);
        const isAgeWrong = checkAge(age);
        const isSexWrong = checkSex(sex);

        //обновляем состояние текущего инпута, если его значение соответствует условиям, будет показан зеленый бордер, иначе красный
        switch (true) {
            case e.target.classList.contains('user-name'): updateInputState(e.target, isNameWrong); break;
            case e.target.classList.contains('user-age'): updateInputState(e.target, isAgeWrong); break;
            case e.target.classList.contains('user-sex'): updateInputState(e.target, isSexWrong); break;
        }
        // результаты проверок значений сохраняем в переменную state
        const state = isNameWrong || isAgeWrong || isSexWrong;
        // в соответствии с state активируем или дизейблим кнопку Add.
        updateBtnState(state); 
    }
});

document.addEventListener('click',(e) => {
    // обработчик кнопки Add
    if (e.target && e.target.classList.contains('add-button')){                
        // получаем значения инпутов
        const name = document.querySelector('.user-name').value;
        const age = document.querySelector('.user-age').value;
        const sex = document.querySelector('.user-sex').value;
        // поскольку их значения уже были проверены, сразу передаем полученные значения в функцию добавления новой строчки в таблице
        addRow(name, age, sex);
        //очищаем инпуты и удаляем классы-модификаторыж
        document.querySelectorAll('.user-input').forEach(elem => {
            elem.value = '';
            elem.classList.remove('wrong');
            elem.classList.remove('ok');
        });
    }
    // по кнопке удаления строчки просто удаляем строчку таблицы
    if (e.target && e.target.classList.contains("delete-button")) {
        e.target.parentNode.remove();
    }

    // обработчик редактирования содержимого ячеек таблицы. По условию задачи не нужно было этого делать, но я решил сделать и этот функционал
    if (e.target && e.target.classList.contains('cell')) {

        // логика следующая: по клику на ячейку меняем ее содержимое на инпут, там редактируем значение.
        // По событию blur проверяем введенное значение и если оно соответствует условиям удаляем инпут и сохраняем его значение в ячейку.
        // Если значение не соответствует, рисуем красный бордер вокруг ячейки.
        

        //сохраняем текущую ячейку в отдельну переменную; удаялем класс, чтобы не сработал обработчик там, где он не нужен,  сохраняем содержимое в отдельную переменную
        let cell = e.target; 
        cell.classList.remove('cell'); 
        let value = e.target.textContent; 

        //подставляем вместо содержимого инпут 
        const type = (e.target.classList.contains('age')) ? 'number' : 'text';
        const input = `<input type=${type} class='edit' name='name' value=${value}>`;
        e.target.innerHTML = input; 

        const editInput = document.querySelector('.edit');
        editInput.focus(); 

        //обработчик добавленного инпута
        editInput.addEventListener('blur', (e) => { 

            //сохраняем в value содержимое инпута
            value = document.querySelector('.edit').value; 
            
            //функция обновления ячейки
            const updateCellState = (state) => {
                //из переданного объекта state вытягиваем результат проверки и контекст. Контекст используется для форматирования значения
                const {isWrong, context} = state;

                if (isWrong) {
                    // если проверка не пройдена, добавляем класс-модификатор, который рисует красный бордер
                    cell.classList.add('wrong');
                }
                else {
                    // если все ок, обновляем ячейку
                    switch (context) {
                        case 'name': cell.textContent = firstLetterToUppercCase(value); break;
                        case 'age': cell.textContent = value; break;
                        case 'sex': cell.textContent = formatSex(value); break;
                    } 
                    if (cell.classList.contains('wrong')) {
                        cell.classList.remove('wrong');
                    }
                    //возвращаем класс для обработчика                         
                    cell.classList.add('cell');
                }
               
            }
            // в state здесь сохраняем результат проверки и контекст, в зависимости от ячейки, где сработало событие
            const state = (cell.classList.contains('name')) ? {isWrong: checkName(value), context: 'name'} :
                          (cell.classList.contains('age')) ? {isWrong: checkAge(value), context: 'age'} :
                          (cell.classList.contains('sex')) ? {isWrong: checkSex(value), context: 'sex'} : null;  
            // вызываем функцию обновления ячейки
            updateCellState(state);
            
        });
    }
});

//первичная отрисовка таблицы по сохраненным в объекте users пользователям
(() => {

    //получаем заголовки из объекта юзеров для стартового варианта таблицы
    const headers = Object.keys(users[0]);
    headers.push('delete'); 
    
    const tHead = document.querySelector('.table-head');
    // добавляем заголовки на страницу
    headers.forEach(elem => {                
        const th = document.createElement('th');
        th.textContent = firstLetterToUppercCase(elem);
        tHead.append(th);
    })
    // добавляем юзеров на страницу
    users.forEach(user => addRow(user.name, user.age, user.sex));            
})();