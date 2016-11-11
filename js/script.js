(function () {
    var shelfs = document.querySelectorAll('.shelf');

    // Аккуратно размещаем чемоданы на полках
    [].forEach.call(shelfs, function (shelf) {
        var bags = shelf.querySelectorAll('.bag');
        var left = 0;

        [].forEach.call(bags, function (bag) {
            bag.style.left = left + 'px';
            left += 40;
        });
    });

    var weight = {
        left: 0,
        right: 0,
        balance: function () {
            return this.right - this.left;
        }
    }

    var scales = {
        leftBowl: document.getElementById('bowl-left'),
        rightBowl: document.getElementById('bowl-right'),
        arrow: document.getElementById('arrow'),
        changeWeight: function (weightBag, side) {
            weight[side] += weightBag;
            var balance = weight.balance();

            console.log('balance', balance);
            if (balance * 2 >= 90 || balance * 2 <= -90) return;

            var opposite = side == 'left' ? 'right' : 'left';

            var bowlTarget = this[side + 'Bowl'];
            var bowlOpposite = this[opposite + 'Bowl'];

            var topBowlTarget = parseFloat(getComputedStyle(bowlTarget).top);
            var topBowlOpposite = parseFloat(getComputedStyle(bowlOpposite).top);

            var oversTarget = document.querySelectorAll('[data-over="' + side + '"]');
            var oversOpposite = document.querySelectorAll('[data-over="' + opposite + '"]');

            var counter = 0;
            var step = weightBag >= 0 ? 1 : -1;

            // Динамически изменяем положение чаш, стрелки и всех чемоданов на чашах
            var reaction = setInterval(function () {
                if (counter == +weightBag) clearInterval(reaction);
                topBowlTarget += step;
                topBowlOpposite -= step;

                bowlTarget.style.top = topBowlTarget + 'px';
                bowlOpposite.style.top = topBowlOpposite + 'px';
                scales.arrow.style.transform = 'rotate(' + balance * 2 + 'deg)';

                [].forEach.call(oversTarget, function (item) {
                    var coords = getCoords(item).top;
                    item.style.top = coords + step + 'px';
                });

                [].forEach.call(oversOpposite, function (item) {
                    var coords = getCoords(item).top;
                    item.style.top = coords - step + 'px';
                });

                counter += step;
            }, 10);
        }
    }

    document.onmousedown = function (event) {
        if (event.target.className != 'bag') return;

        var droped;
        clearInterval(droped);

        var bag = event.target;
        var bagWeight = bag.getAttribute('data-weight');

        bag.ondragstart = function () {
            return false;
        };

        if (bag.getAttribute('data-over') != 'null') {
            scales.changeWeight(-bagWeight, bag.getAttribute('data-over'));
        }

        var coords = getCoords(bag);
        var shiftX = event.pageX - coords.left;
        var shiftY = event.pageY - coords.top;

        moveBag(event);
        document.body.appendChild(bag);

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

        function dropBag() {
            var newCoords = getCoords(bag);

            var side = getSide();
            var topTargetBowl = side ? getCoords(scales[side + 'Bowl']).top : 0;
            var maxDroped = side != 'null' && (newCoords.top <= topTargetBowl - bag.clientHeight) ? topTargetBowl - bag.clientHeight : 800;

            if (maxDroped == 800) {
                bag.setAttribute('data-over', null);
            }

            droped = setInterval(function () {
                if (newCoords.top >= maxDroped) {
                    if (maxDroped == topTargetBowl - bag.clientHeight) {
                        scales.changeWeight(+bagWeight, side);
                    }

                    clearInterval(droped);
                    bag.style.top = maxDroped + 'px';
                    return;
                };

                newCoords.top += +bagWeight;
                bag.style.top = newCoords.top + 'px';
            }, 1);

            function getSide() {
                var bagCenter = newCoords.left + bag.clientWidth / 2;

                var coordBowLeft = getCoords(scales.leftBowl);
                var coordBowRight = getCoords(scales.rightBowl);

                var isOverBowlLeft = (bagCenter >= coordBowLeft.left) && (bagCenter <= coordBowLeft.right);
                var isOverBowlRight = (bagCenter >= coordBowRight.left) && (bagCenter <= coordBowRight.right);

                var side = null;

                if (isOverBowlLeft) side = 'left';
                if (isOverBowlRight) side = 'right';

                bag.setAttribute('data-over', side);
                return side;
            }
        }
    }

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset,
            right: box.right + pageXOffset
        };
    }
})();
