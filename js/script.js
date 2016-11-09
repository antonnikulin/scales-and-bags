(function () {
    var droped;
    var bowlLeft = document.getElementById('bowl-left');
    var bowlRight = document.getElementById('bowl-right');

    document.onmousedown = function (event) {
        if (event.target.className != 'bag') return;

        clearInterval(droped);
        var bag = event.target;
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
            var bagCenter = newCoords.left + bag.clientWidth / 2;

            var coordBowLeft = getCoords(bowlLeft);
            var coordBowRight = getCoords(bowlRight);

            var isOverBowlLeft = (bagCenter >= coordBowLeft.left) && (bagCenter <= coordBowLeft.right);
            var isOverBowlRight = (bagCenter >= coordBowRight.left) && (bagCenter <= coordBowRight.right);

            var bowl = null;

            if (isOverBowlLeft) bowl = bowlLeft;
            if (isOverBowlRight) bowl = bowlRight;

            var coordsBowl = bowl ? getCoords(bowl) : undefined;

            var maxDroped = bowl && (newCoords.top <= coordsBowl.top - bag.clientHeight) ? coordsBowl.top - bag.clientHeight : 700;

            droped = setInterval(function () {
                if (newCoords.top >= maxDroped) {
                    // Тут должна быть реакция чаши на упавший чемодан
                    if (maxDroped == coordsBowl.top - bag.clientHeight) {
                        var bowlTop = parseFloat(getComputedStyle(bowl).top);
                        var counter = 0;

                        var reaction = setInterval(function () {
                            if (counter == 10) clearInterval(reaction);
                            newCoords.top += 1;
                            bag.style.top = newCoords.top + 'px';

                            bowlTop += 1;
                            bowl.style.top = bowlTop + 'px';
                            counter++;
                        }, 10);
                    }

                    clearInterval(droped);
                };
                newCoords.top += 3;
                bag.style.top = newCoords.top + 'px';
            }, 1);
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
