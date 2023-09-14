(() => {

    // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

    function createNumbersArray(count) {

        let arr = [];
        let value = 1;
        let id = 1;


        for (let i = 0; i < count; i = i + 2) {

          arr.push({value, open: false, verify: false, id: id });
          id++;
          arr.push({value, open: false, verify: false, id: id});
          value++;
          id++;
        }
        console.log(arr);
        return arr;
    }

    // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

    function shuffle(arr) {

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i].value, arr[j].value] = [arr[j].value, arr[i].value];
            [arr[i].open, arr[j].open] = [arr[j].open, arr[i].open];
            [arr[i].verify, arr[j].verify] = [arr[j].verify, arr[i].verify];
          }

          console.log("после рандома", arr);
          return arr;
    }

    // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек.
    // У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.


    function disabledCard (arr, flag) {
      for(const i in arr) {
        button = document.getElementById(`${arr[i].id}`);
        if(flag === 0 && arr[i].verify === false) {
          console.log("дизейбл всё")
          button.disabled = true;
        }


        if(flag === 1 && arr[i].verify === false){
          console.log("активейт всё")
          button.disabled = false;
        }

      }
    }

    function checkResult(arr){
      let count = 0;
      for(const i in arr){
        if(arr[i].verify === true){
          count++
        }

        if(count === arr.length-1)
          endGame(true);
      }
    }

    function checkCard(arr, value, id, el) {

      let prevId = 0;
      let prevEl;

      for(const i in arr) {
        if(arr[i].open === true && arr[i].verify === false){
          prevId = arr[i].id;
          prevEl = document.getElementById(`${prevId}`);

          disabledCard(arr, 0);
          break;
        }
      }

      if(prevId != 0 && arr[prevId - 1].id === arr[id - 1].id){
        prevId = 0;
        arr[id - 1].open = false;

        console.log("обнуление");
        console.log(prevId);
        disabledCard(arr, 1);
        return;
      }

      console.log("prevID = ",prevId);

      for(const i in arr) {

        if(arr[i].value == value && arr[i].open === false && arr[i].id === id){
          arr[i].open = true;

          console.log ("поставило open",prevId, id,arr[i], arr)
        }

        if(prevId != 0 && arr[prevId - 1].value === arr[id - 1].value){
          arr[prevId - 1].verify = true;
          arr[id - 1].verify = true;
          console.log("одинаковые",arr[prevId - 1].value, arr[id - 1].value);

          disabledCard(arr, 1);

          prevEl.disabled = true;
          el.disabled = true;

          checkResult(arr);
          return;
        }

        if(prevId != 0 && arr[prevId - 1].open === true && arr[id - 1].open === true){
          arr[id - 1].open = false;
          arr[prevId - 1].open = false;
          console.log("не одинаковые");

          setTimeout(()=>{
            prevEl.classList.toggle('card__background');
            el.classList.toggle('card__background');
            disabledCard(arr, 1);
          }, 500);



          prevId = 0;

          return;

        }
      }
    }

    function endGame(result) {
      let span = document.createElement('span');
      let button = document.createElement('a');
      let h1 = document.querySelector('.title');
      let ul = document.querySelector('.cards__list');
      let div = document.querySelector('.timer');
      let cards = document.querySelector('.cards');

      ul.remove();
      div.remove();


      span.classList.add('end-text');
      button.classList.add('btn-reset', 'form__btn', 'end-btn');
      button.href = 'index.html'
      h1.style = 'padding-top: 200px;';

      span.textContent = result ? 'Победа!' : 'Поражение';
      button.textContent = "Попробуем ещё?";

      cards.append(span);
      cards.append(button);

      // button.addEventListener('click', ()=>{
      //   createForm();
      // });
    }


    const time = (() => {
        let time = 60;
        console.log(time);

        return () => {
          time--;
          return time;
        }
    })();



    function timer() {
      const refreshId = setInterval(() => {
        const properID = time();
        let span = document.querySelector('.timer');
        span.textContent = properID;
        if (properID === 0) {
          clearInterval(refreshId);
          endGame(false);
        }
      }, 1000);
    }


    function createCard(arr) {

      let span = document.createElement('span');
      let div = document.createElement('div');
      let cards = document.querySelector('.cards');
      let ul = document.createElement('ul');
      ul.classList.add('list-reset', 'cards__list');
      div.classList.add('timer')

      console.log(cards, ul);

      span.textContent = 'Старт';

      timer();
      cards.append(div);
      div.append(span);
      cards.append(ul);

      for(let item of arr) {

        let li = document.createElement('li');
        let button = document.createElement('button');

        li.classList.add('cards__item');
        button.classList.add('cards__btn', 'btn-reset', 'card__background');

        button.id = `${item.id}`
        button.textContent = item.value;

        ul.append(li);
        li.append(button);



        li.addEventListener('click', (el) => {

          button.classList.toggle('card__background');

          checkCard(arr, item.value, item.id, el.target);

        })

      }


    }

    function startGame(count) {


      let title = document.querySelector('.title');
      let arr = createNumbersArray((count * count));
      let arrShuffle = shuffle(arr);

      title.style = "padding: 60px 0; padding-bottom: 30px; margin: 0;"
      document.documentElement.style.cssText = `--offsets: ${Math.sqrt((count * count)) - 1}` // задаёт поле

      createCard(arrShuffle);

      return arrShuffle;
    }

    function checkEven(numb) {

      if(numb%2 === 0)
        {console.log(numb, " - чётное")
        return true;}
      else
      {console.log("нечёт", numb)
        return false;}

    }



    function createForm() {
      // let span = document.querySelector('.end-text');
      // let button = document.querySelector('.end-btn');

      // console.log(span, button)

      // if(span && button){
      //   span.remove();
      //   button.remove();
      // }

      let cards = document.querySelector('.cards');
      let form = document.createElement('form');
      let input = document.createElement('input');
      let btnForm = document.createElement('button');
      let text = document.createElement('span');



      form.classList.add('form');
      text.textContent = 'Количество карточек по вертикали/горизонтали';
      text.classList.add('form__text');
      input.classList.add('form__input');
      input.type = 'number';
      input.placeholder = '4';
      // input.step = '2';
      // input.min = '2';
      // input.max = '10';
      // input.required = true;
      btnForm.classList.add('btn-reset', 'form__btn');
      btnForm.textContent = 'Начать игру';


      form.append(text);
      form.append(input);
      form.append(btnForm);
      cards.append(form);

      form.addEventListener('submit', (e)=>{
        // эта строчка необходима, чтобы предотвратить стандартное действие браузера
        // в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
        e.preventDefault();

        if(!checkEven(input.value) || input.value > 10 || input.value < 2) {
          input.value = 4;
        }

        form.remove(cards);
        startGame(input.value);



      })
    }

    document.addEventListener ('DOMContentLoaded', ()=> {



      createForm();




      // startGame(count);



    })

})();
