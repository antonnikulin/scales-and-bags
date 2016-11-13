(function () {
    var panel = document.getElementById('panel');
    var bags = createBags(12);
    var shelfs = createShelfs();

    // Помещаем сумки на полки
    bags.forEach(function (bag, i) {
        if (i < bags.length / 2) {
            shelfs[0].appendChild(bag);
        } else {
            shelfs[1].appendChild(bag);
        }
    });

    // Ставим полки на страницу
    shelfs.forEach(function (shelf) {
        panel.appendChild(shelf);
    })

    // Равномерно распределяем сумки по полкам
    shelfs.forEach(function (shelf) {
        var bags = shelf.querySelectorAll('.bag');
        var left = 0;
        var shift = shelf.clientWidth / bags.length / 1.5;

        [].forEach.call(bags, function (bag) {
            bag.style.left = left + 'px';
            left += shift;
        });
    });


    function createBags(num) {
        var arr = [];
        var weight;

        for (var i = 0; i < num; i++) {
            // Обеспечиванием возможность достижения равновесия
            if (i % 2 == 0) weight = Math.round(Math.random() * 10 + 1);

            var bag = document.createElement('img');

            bag.src = 'img/bag_' + (i + 1) + '.png';
            bag.className = 'bag';
            bag.setAttribute('data-weight', weight);
            bag.setAttribute('data-over', 'null');

            arr.push(bag);
        }

        return arr.sort(function () {
            return Math.random() * 10 - 5;
        });;
    }

    function createShelfs() {
        var shelfs = [];

        for (var i = 0; i < 2; i++) {
            var shelf = document.createElement('div');
            shelf.className = 'shelf';
            shelfs.push(shelf);
        }

        return shelfs;
    }
})();
