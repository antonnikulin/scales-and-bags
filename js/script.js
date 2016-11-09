(function () {
    var droped;
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

            var opposite = side == 'left' ? 'right' : 'left';

            var bowlTarget = this[side + 'Bowl'];
            var bowlOpposite = this[opposite + 'Bowl'];

            var topBowlTarget = parseFloat(getComputedStyle(bowlTarget).top);
            var topBowlOpposite = parseFloat(getComputedStyle(bowlOpposite).top);

            bowlTarget.style.top = topBowlTarget + weightBag + 'px';
            bowlOpposite.style.top = topBowlOpposite - weightBag + 'px';
            scales.arrow.style.transform = 'rotate(' + weight.balance() + 'deg)';
        }
    }

    document.onmousedown = function (event) {
        if (event.target.className != 'bag') return;
        clearInterval(droped);

        var bag = event.target;
        var bagWeight = bag.getAttribute('data-weight');

        if (bag.getAttribute('data-over') != 'null') {
            scales.changeWeight(-bagWeight, bag.getAttribute('data-over'));
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

            var side = getSide();
            var topTargetBowl = side ? getCoords(scales[side + 'Bowl']).top : 0;
            var maxDroped = side != 'null' && (newCoords.top <= topTargetBowl - bag.clientHeight) ? topTargetBowl - bag.clientHeight : 700;

            // попробовать сделать без интервалов
            droped = setInterval(function () {
                if (newCoords.top >= maxDroped) {
                    if (maxDroped == topTargetBowl - bag.clientHeight) {
                        scales.changeWeight(+bagWeight, side);
                        var dopCoords = getCoords(bag);
                        bag.style.top = dopCoords.top - weight;
                    }

                    clearInterval(droped);
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
            botton: box.bottom + pageYOffset,
            left: box.left + pageXOffset,
            right: box.right + pageXOffset
        };

    }
})();
