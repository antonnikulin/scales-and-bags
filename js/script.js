(function () {
    var droped;
    var bowlLeft = document.getElementById('bowl-left');
    var bowlRight = document.getElementById('bowl-right');
    var arrow = document.getElementById('arrow');
    var angle = 0;

    var weight = {
        left: 0,
        right: 0,
        balance: function () {
            return this.right - this.left;
        }
    }

    document.onmousedown = function (event) {
        if (event.target.className != 'bag') return;

        clearInterval(droped);
        var bag = event.target;
        var bagWeight = bag.getAttribute('data-weight');

        if (bag.getAttribute('data-over') != null) {
            changeWeight(-bagWeight, bag.getAttribute('data-over'));
        }

        bag.ondragstart = function () {
            return false;
        };

        var coords = getCoords(bag);
        var shiftX = event.pageX - coords.left;
        var shiftY = event.pageY - coords.top;

        moveBag(event);

        document.onmousemove = function (event) {
            moveBag(event);
        };

        bag.onmouseup = function () {
            document.onmousemove = null;
            bag.onmouseup = null;
            dropBag(event);
        };

        function moveBag(event) {
            bag.style.left = event.pageX - shiftX + 'px';
            bag.style.top = event.pageY - shiftY + 'px';
        }

        function dropBag(event) {
            var newCoords = getCoords(bag);

            // Узнаем находится ли чемодан над чашей и над какой
            var bowls = getBowls();
            var coordsTargetBowl = bowls ? getCoords(bowls.target) : undefined;
            var maxDroped = bowls && (newCoords.top <= coordsTargetBowl.top - bag.clientHeight) ? coordsTargetBowl.top - bag.clientHeight : 700;

            droped = setInterval(function () {
                if (newCoords.top >= maxDroped) {
                    if (maxDroped == coordsTargetBowl.top - bag.clientHeight) {
                        changeWeight(bagWeight, bowls.side);
                    }

                    clearInterval(droped);
                };
                newCoords.top += 3;
                bag.style.top = newCoords.top + 'px';
            }, 1);

            function getBowls() {
                var bagCenter = newCoords.left + bag.clientWidth / 2;

                var coordBowLeft = getCoords(bowlLeft);
                var coordBowRight = getCoords(bowlRight);

                var isOverBowlLeft = (bagCenter >= coordBowLeft.left) && (bagCenter <= coordBowLeft.right);
                var isOverBowlRight = (bagCenter >= coordBowRight.left) && (bagCenter <= coordBowRight.right);

                var bowl, anotherBow, side;

                if (isOverBowlLeft) {
                    bowl = bowlLeft;
                    anotherBow = bowlRight;
                    side = 'left';
                }

                if (isOverBowlRight) {
                    bowl = bowlRight;
                    anotherBow = bowlLeft;
                    side = 'right';
                }

                if (bowl) {
                    return {
                        target: bowl,
                        another: anotherBow,
                        side: side
                    }
                } else {
                    bag.setAttribute('data-over', null);
                    return null;
                }
            }

            function changeWeight(weightBag, side) {
                weight[side] += +weightBag;
                bag.setAttribute('data-over', side);
                console.log(weight.balance());

                var bowlTop = parseFloat(getComputedStyle(bowls.target).top);
                var anotherBowTop = parseFloat(getComputedStyle(bowls.another).top);
                var counter = 0;

                var reaction = setInterval(function () {
                    if (counter >= weightBag) clearInterval(reaction);
                    newCoords.top += +weightBag;
                    bag.style.top = newCoords.top + 'px';

                    bowlTop += +weightBag;
                    bowls.target.style.top = bowlTop + 'px';

                    anotherBowTop -= weightBag;
                    bowls.another.style.top = anotherBowTop + 'px';
                    angle -= 1;

                    arrow.style.transform = 'rotate(' + weight.balance() * 10 + 'deg)';
                    counter++;
                }, 10);
            }
        }
    }

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            botton: box.bottom + pageYOffset,
            left: box.left + pageXOffset,
            right: box.right + pageXOffset
        };

    }
})();
