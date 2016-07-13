// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);

    var buttons = [
        this.popup.querySelector('.door-riddle__button_0'),
        this.popup.querySelector('.door-riddle__button_1'),
        this.popup.querySelector('.door-riddle__button_2')
    ];

    buttons.forEach(function (b) {
        b.addEventListener('pointerdown', _onButtonPointerDown.bind(this));
        b.addEventListener('pointerup', _onButtonPointerUp.bind(this));
        b.addEventListener('pointercancel', _onButtonPointerUp.bind(this));
        b.addEventListener('pointerleave', _onButtonPointerUp.bind(this));
    }.bind(this));

    function _onButtonPointerDown(e) {
        e.target.classList.add('door-riddle__button_pressed');
        checkCondition.apply(this);
    }

    function _onButtonPointerUp(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    /**
     * Проверяем, можно ли теперь открыть дверь
     */
    function checkCondition() {
        var isOpened = true;
        buttons.forEach(function (b) {
            if (!b.classList.contains('door-riddle__button_pressed')) {
                isOpened = false;
            }
        });

        // Если все три кнопки зажаты одновременно, то откроем эту дверь
        if (isOpened) {
            this.unlock();
        }
    }
}

// Наследуемся от класса DoorBase
Door0.prototype = Object.create(DoorBase.prototype);
Door0.prototype.constructor = DoorBase;
// END ===================== Пример кода первой двери =======================

/**
 * @class Door1
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door1(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия второй двери здесь ====
    // Для примера дверь откроется просто по клику на неё
    var _this = this;
    var clickableBoltPosition = -160;
    var draggableBoltPosition = -160;
    var clickableBolt = this.popup.querySelector('.bolt--clickable');
    var draggableBolt = this.popup.querySelector('.bolt--draggable');
    var clickableButton = this.popup.querySelector('.bolt__button--clickable');
    var draggableButton = this.popup.querySelector('.bolt__button--draggable');
    var dialogs = _this.popup.querySelector('.dialogs');
    var counter;
    var startX;

    clickableButton.addEventListener('pointerdown', moveBoltForward);
    clickableButton.addEventListener('pointerup', removePressed);
    draggableButton.addEventListener('pointerdown', startDragBolt);

    function moveBoltForward(e) {
        e.preventDefault();
        e.target.classList.add('door-riddle__button_pressed');
        clickableBoltPosition += 30;
        clickableBolt.style.right = clickableBoltPosition + 'px';
        if (clickableBoltPosition >= 0) {
            clickableBoltPosition = 0;
            clickableBolt.style.right = clickableBoltPosition + 'px';
            clearInterval(counter);
            checkCondition();
            return;
        }
        if (!counter) {
            counter = setInterval(function () {
                if (clickableBoltPosition > -160 && clickableBoltPosition < 0) {
                    clickableBoltPosition--;
                    clickableBolt.style.right = clickableBoltPosition + 'px';
                }
                else {
                    clearInterval(counter);
                    counter = undefined;
                }
            }, 20)
        }
        checkCondition();
    }

    function removePressed(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    function startDragBolt(e) {
        if (draggableBoltPosition >= 0) return;
        startX = e.clientX;
        e.target.setPointerCapture(e.pointerId);
        e.target.addEventListener('pointermove', processDragBolt, false);
        e.target.addEventListener('pointerup', finishDragBolt, false);
    }

    function processDragBolt(e) {
        var position = draggableBoltPosition + startX - e.clientX;
        if (position > 0) position = 0;
        draggableBolt.style.right = position + 'px';
    }

    function finishDragBolt(e) {
        draggableBoltPosition = draggableBoltPosition + startX - e.clientX;
        if (draggableBoltPosition > 0) draggableBoltPosition = 0;
        draggableBolt.style.right = draggableBoltPosition + 'px';
        checkCondition();
        e.target.removeEventListener('pointermove', processDragBolt);
        e.target.removeEventListener('pointerup', finishDragBolt);
    }

    function checkCondition() {
        if (clickableBoltPosition >= 0 && draggableBoltPosition >= 0) {
            showDialog(dialogs, 1);
            setTimeout(function () {
                _this.unlock();
            }, 2000)
        }
    }

    // ==== END Напишите свой код для открытия второй двери здесь ====
}
Door1.prototype = Object.create(DoorBase.prototype);
Door1.prototype.constructor = DoorBase;

/**
 * @class Door2
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door2(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия третей двери здесь ====
    var _this = this;
    var dialogs = _this.popup.querySelector('.dialogs');
    var parts = [
        document.querySelector('.part--1'),
        document.querySelector('.part--2'),
        document.querySelector('.part--3'),
        document.querySelector('.part--4'),
        document.querySelector('.part--5'),
        document.querySelector('.part--6')
    ];
    var kettle = document.querySelector('.kettle__inner');

    parts.forEach(function (part) {
        part.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            //if (e.target.classList.contains('part--ready')) return;
            var startX, startY, posX, posY;
            var elem = e.target;

            startX = e.clientX;
            startY = e.clientY;
            posX = elem.offsetLeft;
            posY = elem.offsetTop;
            elem.classList.add('part--pressed');
            elem.addEventListener('pointermove', processMovePart, false);
            elem.addEventListener('pointerup', finishMovePart, false);
            elem.addEventListener('pointercancel', finishMovePart, false);

            function processMovePart(e) {
                var position = [startX - e.clientX, startY - e.clientY];

                elem.setPointerCapture(e.pointerId);
                elem.style.left = posX - position[0] + 'px';
                elem.style.top = posY - position[1] + 'px';
            }

            function finishMovePart(e) {
                var elements = document.elementsFromPoint(e.clientX, e.clientY);

                elem.classList.remove('part--pressed');
                elem.removeEventListener('pointermove', processMovePart);
                elem.removeEventListener('pointerup', finishMovePart);
                if (elements.indexOf(kettle) !== -1) {
                    elem.classList.add('part--ready');
                    kettle.style.backgroundColor = 'rgba(' +
                        (Math.floor(Math.random() * 256)) +
                        ',' + (Math.floor(Math.random() * 256)) +
                        ',' + (Math.floor(Math.random() * 256)) +
                        ', 0.8)';
                }
                checkCondition();
            }
        }, false);


        function checkCondition() {
            var isOpened = true;

            parts.forEach(function (part) {
                if (!part.classList.contains('part--ready')) {
                    isOpened = false;
                }
            });
            if (isOpened) {
                showDialog(dialogs, 1);
                setTimeout(function () {
                    _this.unlock();
                }, 2000);
            }
        }
    });
    // ==== END Напишите свой код для открытия третей двери здесь ====
}
Door2.prototype = Object.create(DoorBase.prototype);
Door2.prototype.constructor = DoorBase;

/**
 * Сундук
 * @class Box
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Box(number, onUnlock) {
    DoorBase.apply(this, arguments);

    // ==== Напишите свой код для открытия сундука здесь ====
    var _this = this;
    var popup = this.popup;
    var path = '';
    var canvas = document.getElementById('canvas');
    var popupContent = this.popup.querySelector('.popup__content');
    var ctx = canvas.getContext('2d');
    var dialogs = _this.popup.querySelector('.dialogs');
    var dementor = _this.popup.querySelector('.dementor');
    var diary = _this.popup.querySelector('.diary');
    var teeth = _this.popup.querySelector('.teeth');
    var indicator = _this.popup.querySelector('.indicator');
    var stars = [
        document.querySelector('.star--1'),
        document.querySelector('.star--2'),
        document.querySelector('.star--3'),
        document.querySelector('.star--4'),
        document.querySelector('.star--5')
    ];
    setCanvasParams();
    var coords = canvas.getBoundingClientRect();

    window.addEventListener('resize', setCanvasParams, false);
    popup.addEventListener('pointerdown', startDraw, false);

    function setCanvasParams() {
        canvas.width = popupContent.offsetWidth;
        canvas.height = popupContent.offsetHeight;
        /*
        * На Android слетают настройки ctx при ресайзе окна
        * */
        ctx.lineWidth = 10;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(function (star) {
            star.classList.remove('star--selected');
        });
    }

    function selectStar(e) {
        if (!e.target.classList.contains('star--selected')) {
            e.target.classList.add('star--selected');
            path += e.target.innerText;
        }
    }

    function startDraw(e) {
        e.preventDefault();
        clear();
        ctx.moveTo(e.clientX - coords.left, e.clientY - coords.top);
        ctx.beginPath();
        stars.forEach(function (star) {
            star.addEventListener('pointermove', selectStar, false);
        });
        document.addEventListener('pointermove', processDraw, false);
        document.addEventListener('pointerup', finishDraw, false);
    }

    function processDraw(e) {
        e.preventDefault();
        ctx.lineTo(e.clientX - coords.left, e.clientY - coords.top);
        ctx.stroke();
    }

    function finishDraw(e) {
        e.preventDefault();
        ctx.closePath();
        if (path === '12345') {
            showDialog(dialogs, 1);
            popup.removeEventListener('pointerdown', startDraw);
            dementor.style.display = 'none';
            canvas.style.display = 'none';
            stars.forEach(function (star) {
               star.style.display = 'none';
            });
            clear();
            teeth.style.display = 'block';
            diary.style.display = 'block';
            indicator.style.display = 'block';
            teeth.addEventListener('pointerdown', increaseIndicator, false);
            teeth.addEventListener('pointerup', throwTeeth, false);
        } else {
            path = '';
        }
        stars.forEach(function (star) {
            star.removeEventListener('pointerover', selectStar);
        });
        document.removeEventListener('pointermove', processDraw, false);
        document.removeEventListener('pointerup', finishDraw, false);
    }

    function increaseIndicator(e) {
        var height = 0;
        var interval = setInterval(function () {
            if (height > 150) {
                indicator.classList.add('indicator--ready');
                clearInterval(interval);
                showDialog(dialogs, 2);
                return;
            }
            height++;
            indicator.style.height = height + 'px';
        }, 20);
    }

    function throwTeeth() {
        if (indicator.offsetHeight > 100) {
            showDialog(dialogs, 3);
            setTimeout(function () {
                _this.unlock();
            }, 2000);
        }
    }

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function () {
        alert('Поздравляю! Игра пройдена!');
    };
}

function showDialog(dialogs, id) {
    var dialogsArr = dialogs.querySelectorAll('.dialog');
    for (var i = 0, len = dialogsArr.length; i < len; i++) {
        if (dialogsArr[i].classList.contains('dialog--current')) {
            dialogsArr[i].classList.remove('dialog--current');
            break;
        }
    }
    dialogsArr[id].classList.add('dialog--current');
}

Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
