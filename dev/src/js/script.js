document.addEventListener('DOMContentLoaded', function(){ 
    //обрезка описания до 62 символов
    function cropDescription(text, len = 62) {
        let maxLength = len;

        text.forEach(item => {
            let length = item.textContent.length;
            length > maxLength ? item.textContent = item.textContent.slice(0, maxLength) + ' ...' : item;
        });
        
        return text;
    }
    //изменение имени и появление кнопки готово
    function setNewName(product) {
        product.onclick = function(e) {
            let current = e.path[2];
            let flag = ( current.classList.contains('content-name') || (e.target).classList.contains('content-name'));

            if(flag) {
                let inpItem = current.querySelector('.name-field__inp');
                let readyBtn = current.querySelector('.name-ready');

                if(inpItem.hasAttribute('disabled')) { inpItem.removeAttribute('disabled'); }
                readyBtn.classList.add('active');
            }
        }
    }
    //drag and drop(перетаскивание продуктов)
    function productDrag(items) {
        let dragSrcEl = null;

        //начало перетаскивания
        function handleDragStart(e) {
          dragSrcEl = this;

          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/html', this.innerHTML);
        }
        
        function handleDragOver(e) {
          if (e.preventDefault) {
            e.preventDefault(); 
          }
        
          e.dataTransfer.dropEffect = 'move';
        
          return false;
        }
        
        //сброс элемента
        function handleDrop(e) {
          if (e.stopPropagation) {
            e.stopPropagation();
          }
        
          if (dragSrcEl != this) {
            dragSrcEl.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
          }
        
          return false;
        }
        
        items.forEach(function(item, num, arr) {
            item.addEventListener('dragstart', handleDragStart, false);
            item.addEventListener('dragover', handleDragOver, false);
            item.addEventListener('drop', handleDrop, false);
        })
    }

    //результат сравнения строки 
    function compareBtnClick() {
        const COMPARE_STRING = mainData.stingField.enterString;
        const COMPARE_BTN = mainData.stingField.checkString;

        //валидации строки(входящие скобки)
        function validateString(str) {
            let currentValue = str.value;
            let result;
            let num = +currentValue;

            function randomInteger(min, max) {
                // случайное число от min до (max+1)
                let rand = min + Math.random() * (max + 1 - min);
                return Math.floor(rand);
            }

            let options = {
                start: [
                    '{',
                    '[',
                    '('
                ],
                end: [
                    '}',
                    ']',
                    ')'
                ]
            } 

            switch(num) {
                case 1: {
                    let currentVal = randomInteger(1, 3);
                    result = options.start[currentVal - 1] + options.end[currentVal - 1];
                } break;
                case 2: {
                    function getNum() {
                        let currentVal1 = randomInteger(1, 3);
                        let currentVal2 = randomInteger(1, 3);

                        if(currentVal1 != currentVal2) {
                            let open = options.start[currentVal1 - 1] + options.start[currentVal2 - 1];
                            let close = options.end[currentVal2 - 1] + options.end[currentVal1 - 1];
                            let res = '';

                            res = open + close;
                            
                            return res;
                        } else {
                            return getNum();
                        }
                    }

                    result = getNum();
                    
                } break;
                case 3: {
                    function getNum() {
                        let currentVal1 = randomInteger(1, 3);
                        let currentVal2 = randomInteger(1, 3);
                        let currentVal3 = randomInteger(1, 3);

                        if(currentVal1 != currentVal2 && currentVal1 != currentVal3) {
                            let open = options.start[currentVal1 - 1] + options.start[currentVal2 - 1] + options.start[currentVal3 - 1];
                            let close = options.end[currentVal3 - 1] + options.end[currentVal2 - 1] + options.end[currentVal1 - 1];

                            let res = open + close;
                            return res;
                        } else {
                            getNum();
                        }

                    }

                    result = getNum();   
                } break;
            }
            
            return result;
        }

        COMPARE_BTN.onclick = function(e) {
            e.preventDefault();
            let result = validateString(COMPARE_STRING);

            result ? alert('true: ' + result) : alert('false: ' + result);
        }
        
    }
    //основные данные для аргументов функций 
    let mainData = {
        itemsDescription: document.querySelectorAll('.item-desc .item-desc__p'),
        productNameItems: document.querySelector('.main-block .block-items'),
        productItems: document.querySelectorAll('.main-block .block-items .item'),
        stingField: {
            enterString: document.getElementById('enterString'),
            checkString: document.getElementById('checkString')
        }
    }


    cropDescription(mainData.itemsDescription);
    setNewName(mainData.productNameItems);
    productDrag(mainData.productItems);
    compareBtnClick();
});