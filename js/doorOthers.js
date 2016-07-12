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

    var _this = this;

    function _onButtonPointerDown(e) {
        _this.unlock();
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
    var clickableBoltPosition = -160;
    var draggableBoltPosition = -160;
    var clickableBolt = this.popup.querySelector('.bolt--clickable');
    var draggableBolt = this.popup.querySelector('.bolt--draggable');
    var clickableButton = this.popup.querySelector('.bolt__button--clickable');
    var draggableButton = this.popup.querySelector('.bolt__button--draggable');
    var counter;
    var startX;

    clickableButton.addEventListener('pointerdown', moveBoltForward.bind(this));
    clickableButton.addEventListener('pointerup', removePressed);
    draggableButton.addEventListener('pointerdown', startDragBolt.bind(this));

    function moveBoltForward(e) {
        e.preventDefault();
        e.target.classList.add('door-riddle__button_pressed');
        clickableBoltPosition += 30;
        clickableBolt.style.right = clickableBoltPosition + 'px';
        if (clickableBoltPosition >= 0) {
            clickableBoltPosition = 0;
            clickableBolt.style.right = clickableBoltPosition + 'px';
            clearInterval(counter);
            return;
        }
        if (!counter) {
            counter = setInterval(function () {
                if (clickableBoltPosition > -160) {
                    clickableBoltPosition--;
                    clickableBolt.style.right = clickableBoltPosition + 'px';
                }
                else {
                    clearInterval(counter);
                    counter = undefined;
                }
            }, 20)
        }
        checkCondition.apply(this);
    }

    function removePressed(e) {
        e.target.classList.remove('door-riddle__button_pressed');
    }

    function startDragBolt(e) {
        startX = e.clientX;
        document.addEventListener('pointermove', processDragBolt, false);
        document.addEventListener('pointerup', finishDragBolt, false);
    }

    function processDragBolt(e) {
        var position = draggableBoltPosition + startX - e.clientX;
        if (position > 0) {
            position = 0;
        }
        draggableBolt.style.right = position + 'px';
    }

    function finishDragBolt(e) {
        draggableBoltPosition = draggableBoltPosition + startX - e.clientX;
        if (draggableBoltPosition > 0) {
            draggableBoltPosition = 0;
        }
        draggableBolt.style.right = draggableBoltPosition + 'px';
        console.log(document.elementFromPoint(e.clientX, e.clientY));
        checkCondition();
        document.removeEventListener('pointermove', processDragBolt);
        document.removeEventListener('pointerup', finishDragBolt);
    }

    var _this = this;

    function checkCondition() {
        if (/*clickableBoltPosition >= 0 && */draggableBoltPosition >= 0) {
            _this.unlock();
            clearInterval(counter);
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
    this.popup.addEventListener('click', function () {
        this.unlock();
    }.bind(this), false);
    // var _this = this;
    // var parts = [
    //     document.querySelector('.part--1'),
    //     document.querySelector('.part--2'),
    //     document.querySelector('.part--3'),
    //     document.querySelector('.part--4')
    // ];
    // var kettle = document.querySelector('.kettle__inner');
    // parts.forEach(function (part) {
    //     part.addEventListener('pointerdown', function (e) {
    //         var startX, startY, posX, posY;
    //         startX = e.clientX;
    //         startY = e.clientY;
    //         posX = parseInt(window.getComputedStyle(e.target, null).getPropertyValue('left'));
    //         posY = parseInt(window.getComputedStyle(e.target, null).getPropertyValue('top'));
    //         e.target.classList.add('part--pressed');
    //         e.target.addEventListener('pointermove', processMovePart, false);
    //         e.target.addEventListener('pointerup', finishMovePart, false);
    //
    //         function processMovePart(e) {
    //             var position = [startX - e.clientX, startY - e.clientY];
    //
    //             e.target.style.left = posX - position[0] + 'px';
    //             e.target.style.top = posY - position[1] + 'px';
    //         }
    //
    //         function finishMovePart(e) {
    //             e.target.classList.remove('part--pressed');
    //             e.target.removeEventListener('pointermove', processMovePart);
    //             e.target.removeEventListener('pointerup', finishMovePart);
    //             var elements = document.elementsFromPoint(e.clientX, e.clientY);
    //             if (elements.indexOf(kettle) !== -1) {
    //                 e.target.classList.add('part--ready');
    //             }
    //             checkCondition();
    //         }
    //     }, false);
    //
    //
    //     function checkCondition() {
    //         var isOpened = true;
    //
    //         parts.forEach(function (part) {
    //             if (!part.classList.contains('part--ready')) {
    //                 isOpened = false;
    //             }
    //         });
    //         if (isOpened) {
    //             _this.unlock();
    //         }
    //     }
    // });
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
    var ctx = canvas.getContext('2d');
    var coords = canvas.getBoundingClientRect();
    var stars = [
        document.querySelector('.star--1'),
        document.querySelector('.star--2'),
        document.querySelector('.star--3'),
        document.querySelector('.star--4'),
        document.querySelector('.star--5')
    ];

    popup.addEventListener('pointerdown', startDraw, false);

    function selectStar(e) {
        if (!e.target.classList.contains('star--selected')) {
            e.target.classList.add('star--selected');
            path += e.target.innerText;
        }
        if (path === '12345') {
            _this.unlock();
        }
        console.log(path);
    }

    function startDraw(e) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.moveTo(e.clientX  - coords.left, e.clientY - coords.top);
        ctx.lineWidth = 10;
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        stars.forEach(function (star) {
            star.addEventListener('pointermove', selectStar, false);
        });
        document.addEventListener('pointermove', processDraw, false);
        document.addEventListener('pointerup', finishDraw, false);
    }

    function processDraw(e) {
        ctx.lineTo(e.clientX  - coords.left, e.clientY - coords.top);
        ctx.stroke();
    }

    function finishDraw(e) {
        stars.forEach(function (star) {
            star.removeEventListener('pointerover', selectStar);
        });
        document.removeEventListener('pointermove', processDraw, false);
        document.removeEventListener('pointerup', finishDraw, false);
    }

    // ==== END Напишите свой код для открытия сундука здесь ====

    this.showCongratulations = function () {
        alert('Поздравляю! Игра пройдена!');
    };
}
Box.prototype = Object.create(DoorBase.prototype);
Box.prototype.constructor = DoorBase;
