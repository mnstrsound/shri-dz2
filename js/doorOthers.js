// ===================== Пример кода первой двери =======================
/**
 * @class Door0
 * @augments DoorBase
 * @param {Number} number
 * @param {Function} onUnlock
 */
function Door0(number, onUnlock) {
    DoorBase.apply(this, arguments);
    var _this = this;
    var dialogs = _this.popup.querySelector('.dialogs');

    var gears = [
        this.popup.querySelector('.gear--1'),
        this.popup.querySelector('.gear--2'),
        this.popup.querySelector('.gear--3'),
        this.popup.querySelector('.gear--4')
    ];

    var counter;

    function reset() {
        gears.forEach(function (gear) {
            gear.classList.remove('gear--ready');
            gear.removeAttribute('style');
            showDialog(dialogs, 1);
        });
    }

    gears.forEach(function (gear) {
        gear.addEventListener('pointerdown', function (e) {
            var startX, startY, posX, posY;
            var elem = e.target;

            startX = e.clientX;
            startY = e.clientY;
            posX = elem.offsetLeft;
            posY = elem.offsetTop;
            elem.setPointerCapture(e.pointerId);

            elem.classList.add('gear--selected');
            gear.addEventListener('pointermove', processMove, false);
            gear.addEventListener('pointerup', finishMove, false);
            gear.addEventListener('pointercancel', finishMove, false);

            function processMove(e) {
                var position = [startX - e.clientX, startY - e.clientY];
                elem.style.left = posX - position[0] + 'px';
                elem.style.top = posY - position[1] + 'px';
            }

            function finishMove(e) {
                elem.classList.remove('gear--selected');
                var qSel = e.target.getAttribute('data-slot');
                var slot = document.querySelector(qSel);
                var rect = slot.getBoundingClientRect();
                var coords =  {
                    minX: rect.left,
                    maxX: rect.left + slot.offsetWidth,
                    minY: rect.top,
                    maxY: rect.top + slot.offsetHeight
                };
                if (e.clientX > coords.minX && e.clientX < coords.maxX && e.clientY > coords.minY && e.clientY < coords.maxY) {
                    e.target.classList.add('gear--ready');
                }
                if (!counter) {
                    counter = setTimeout(function () {
                        var isOpened = true;
                        gears.forEach(function (gear) {
                            if (!gear.classList.contains('gear--ready')) {
                                reset();
                                isOpened = false;
                                clearTimeout(counter);
                                counter = undefined;
                            }
                        });

                        if (isOpened) {
                            showDialog(dialogs, 2);
                            clearTimeout(counter);
                            counter = undefined;
                            setTimeout(function () {
                                _this.unlock();
                            }, 2000);
                        }
                    }, 300);
                }
                elem.removeEventListener('pointermove', processMove);
            }

        }, false);
    });
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
    var _this = this;
    var clickableBoltPosition = -150;
    var draggableBoltPosition = -150;
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
        e.target.classList.add('bolt__button--pressed');
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
                if (clickableBoltPosition > -150 && clickableBoltPosition < 0) {
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
        e.target.classList.remove('bolt__button--pressed');
    }

    function startDragBolt(e) {
        if (draggableBoltPosition >= 0) return;
        e.target.classList.add('bolt__button--pressed');
        startX = e.clientX;
        e.target.setPointerCapture(e.pointerId);
        e.target.addEventListener('pointermove', processDragBolt, false);
        e.target.addEventListener('pointerup', finishDragBolt, false);
        e.target.addEventListener('pointercancel', finishDragBolt, false);
    }

    function processDragBolt(e) {
        var position = draggableBoltPosition + startX - e.clientX;
        if (position > 0) position = 0;
        if (position < -150) position = -150;
        draggableBolt.style.right = position + 'px';
    }

    function finishDragBolt(e) {
        e.target.classList.remove('bolt__button--pressed');
        draggableBoltPosition = draggableBoltPosition + startX - e.clientX;
        if (draggableBoltPosition > 0) draggableBoltPosition = 0;
        if (draggableBoltPosition < -150) draggableBoltPosition = -150;
        draggableBolt.style.right = draggableBoltPosition + 'px';
        checkCondition();
        e.target.removeEventListener('pointermove', processDragBolt);
        e.target.removeEventListener('pointerup', finishDragBolt);
        e.target.removeEventListener('pointercancel', finishDragBolt);
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
    var rect = kettle.getBoundingClientRect();
    var coords =  {
        minX: rect.left,
        maxX: rect.left + kettle.offsetWidth,
        minY: rect.top,
        maxY: rect.top + kettle.offsetHeight
    };

    parts.forEach(function (part) {
        part.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            var startX, startY, posX, posY;
            var elem = e.target;

            elem.setPointerCapture(e.pointerId);
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
                elem.style.left = posX - position[0] + 'px';
                elem.style.top = posY - position[1] + 'px';
            }

            function finishMovePart(e) {
                elem.classList.remove('part--pressed');
                elem.removeEventListener('pointermove', processMovePart);
                elem.removeEventListener('pointerup', finishMovePart);
                elem.removeEventListener('pointercancel', finishMovePart);

                if (e.clientX > coords.minX && e.clientX < coords.maxX && e.clientY > coords.minY && e.clientY < coords.maxY) {
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
    var interval;
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
        document.addEventListener('pointercancel', finishDraw, false);
    }

    function processDraw(e) {
        e.preventDefault();
        ctx.lineTo(e.clientX - coords.left, e.clientY - coords.top);
        ctx.stroke();
    }

    function hidePatronus() {
        popup.removeEventListener('pointerdown', startDraw);
        dementor.style.display = 'none';
        canvas.style.display = 'none';
        stars.forEach(function (star) {
            star.style.display = 'none';
        });
        clear();
    }

    function showDiary() {
        teeth.style.display = 'block';
        diary.style.display = 'block';
        indicator.style.display = 'block';
        teeth.addEventListener('pointerdown', increaseIndicator, false);
        teeth.addEventListener('pointerup', throwTeeth, false);
        teeth.addEventListener('pointercancel', throwTeeth, false);
        teeth.addEventListener('pointerleave', throwTeeth, false);
    }

    function finishDraw(e) {
        e.preventDefault();
        ctx.closePath();
        if (path === '12345') {
            showDialog(dialogs, 1);
            hidePatronus();
            showDiary();
        } else {
            path = '';
        }
        stars.forEach(function (star) {
            star.removeEventListener('pointerover', selectStar);
        });
        document.removeEventListener('pointermove', processDraw, false);
        document.removeEventListener('pointerup', finishDraw, false);
        document.removeEventListener('pointercancel', finishDraw, false);
    }

    function increaseIndicator(e) {
        var height = 0;
        teeth.classList.add('teeth--active');
        interval = setInterval(function () {
            if (height > 150) {
                indicator.classList.add('indicator--ready');
                clearInterval(interval);
                interval = undefined;
                showDialog(dialogs, 3);
                return;
            }
            height++;
            indicator.style.height = height + 'px';
        }, 20);
    }

    function throwTeeth(e) {
        teeth.classList.remove('teeth--active');
        clearInterval(interval);
        interval = undefined;
        if (indicator.offsetHeight > 150) {
            e.target.removeEventListener('pointerdown', increaseIndicator);
            showDialog(dialogs, 4);
            setTimeout(function () {
                _this.unlock();
            }, 2000);
        } else {
            showDialog(dialogs, 2);
            indicator.style.height = 0;
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
