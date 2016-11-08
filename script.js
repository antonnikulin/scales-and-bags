(function () {
    document.onmousedown = function (event) {
        if (event.target.className != 'bag') return;

        var bag = event.target;
        bag.ondragstart = function () {
            return false;
        };

        var coords = getCoords(bag);
        var shiftX = event.pageX - coords.left;
        var shiftY = event.pageY - coords.top;

        moveBag(event);

        document.onmousemove = function (e) {
            moveBag(e);
        };

        bag.onmouseup = function () {
            document.onmousemove = null;
            bag.onmouseup = null;
        };

        function moveBag(event) {
            bag.style.left = event.pageX - shiftX + 'px';
            bag.style.top = event.pageY - shiftY + 'px';
        }
    }

    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    }
})();
