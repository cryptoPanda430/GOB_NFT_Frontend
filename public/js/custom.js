$(document).ready(function () {
    AOS.init();

    // $('.minus').click(function () {
    //     var $input = $(this).parent().find('input');
    //     var count = parseInt($input.val()) - 1;
    //     count = count < 1 ? 1 : count;
    //     $input.val(count);
    //     $input.change();
    //     return false;
    // });
    // $('.plus').click(function () {
    //     var $input = $(this).parent().find('input');
    //     $input.val(parseInt($input.val()) + 1);
    //     $input.change();
    //     return false;
    // });

    // Set the date we're counting down to
    var countDownDate = new Date("Dec 31, 2022 0:0:0").getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="countdown"
        document.getElementById("countdown").innerHTML = days + "d : " + hours + "h : "
            + minutes + "m : " + seconds + "s";

        // If the count down is over, write some text 
        if (distance < 0) {
            clearInterval(x);
            document.getElementById("countdown").innerHTML = "";
        }
    }, 1000);

    var Emblem = {
        init: function (el, str) {
            var element = document.querySelector(el);
            var text = str ? str : element.innerHTML;
            element.innerHTML = '';
            for (var i = 0; i < text.length; i++) {
                var letter = text[i];
                var span = document.createElement('span');
                var node = document.createTextNode(letter);
                var r = (360 / text.length) * (i);
                var x = (Math.PI / text.length).toFixed(0) * (i);
                var y = (Math.PI / text.length).toFixed(0) * (i);
                span.appendChild(node);
                span.style.webkitTransform = 'rotateZ(' + r + 'deg) translate3d(' + x + 'px,' + y + 'px,0)';
                span.style.transform = 'rotateZ(' + r + 'deg) translate3d(' + x + 'px,' + y + 'px,0)';
                element.appendChild(span);
            }
        }
    };

    Emblem.init('.circle-text');

    $(".follow-btn").click(function () {
        $(this).toggleClass("followed");
    });

    var containers = $('.scrolling-content');

    if (containers.length) {
        containers.each(function () {
            var container = $(this);

            // Support small text - copy to fill screen width
            if (container.find('.scrolling-text').outerWidth() < $(window).width()) {
                var windowToScrolltextRatio = Math.round($(window).width() / container.find('.scrolling-text').outerWidth()),
                    scrollTextContent = container.find('.scrolling-text .scrolling-text-content').text(),
                    newScrollText = '';
                for (var i = 0; i < windowToScrolltextRatio; i++) {
                    newScrollText += ' ' + scrollTextContent;
                }
                container.find('.scrolling-text .scrolling-text-content').text(newScrollText);
            }

            // Init variables and config
            var scrollingText = container.find('.scrolling-text'),
                scrollingTextWidth = scrollingText.outerWidth(),
                scrollingTextHeight = scrollingText.outerHeight(true),
                startLetterIndent = parseInt(scrollingText.find('.scrolling-text-content').css('font-size'), 10) / 4.8,
                startLetterIndent = Math.round(startLetterIndent),
                scrollAmountBoundary = Math.abs($(window).width() - scrollingTextWidth),
                transformAmount = 0,
                leftBound = 0,
                rightBound = scrollAmountBoundary,
                transformDirection = container.hasClass('left-to-right') ? -1 : 1,
                transformSpeed = 200;

            // Read transform speed
            if (container.attr('speed')) {
                transformSpeed = container.attr('speed');
            }

            // Make scrolling text copy for scrolling infinity
            container.append(scrollingText.clone().addClass('scrolling-text-copy'));
            container.find('.scrolling-text').css({ 'position': 'absolute', 'left': 0 });
            container.css('height', scrollingTextHeight);

            var getActiveScrollingText = function (direction) {
                var firstScrollingText = container.find('.scrolling-text:nth-child(1)');
                var secondScrollingText = container.find('.scrolling-text:nth-child(2)');

                var firstScrollingTextLeft = parseInt(container.find('.scrolling-text:nth-child(1)').css("left"), 10);
                var secondScrollingTextLeft = parseInt(container.find('.scrolling-text:nth-child(2)').css("left"), 10);

                if (direction === 'left') {
                    return firstScrollingTextLeft < secondScrollingTextLeft ? secondScrollingText : firstScrollingText;
                } else if (direction === 'right') {
                    return firstScrollingTextLeft > secondScrollingTextLeft ? secondScrollingText : firstScrollingText;
                }
            }

            $(window).on('wheel', function (e) {
                var delta = e.originalEvent.deltaY;

                if (delta > 0) {
                    // going down
                    transformAmount += transformSpeed * transformDirection;
                    // container.find('.scrolling-text .scrolling-text-content').css('transform', 'skewX(10deg)');
                }
                else {
                    transformAmount -= transformSpeed * transformDirection;
                    // container.find('.scrolling-text .scrolling-text-content').css('transform', 'skewX(-10deg)');
                }
                setTimeout(function () {
                    container.find('.scrolling-text').css('transform', 'translate3d(' + transformAmount * -1 + 'px, 0, 0)');
                }, 10);
                setTimeout(function () {
                    container.find('.scrolling-text .scrolling-text-content').css('transform', 'skewX(0)');
                }, 500)

                // Boundaries
                if (transformAmount < leftBound) {
                    var activeText = getActiveScrollingText('left');
                    activeText.css({ 'left': Math.round(leftBound - scrollingTextWidth - startLetterIndent) + 'px' });
                    leftBound = parseInt(activeText.css("left"), 10);
                    rightBound = leftBound + scrollingTextWidth + scrollAmountBoundary + startLetterIndent;

                } else if (transformAmount > rightBound) {
                    var activeText = getActiveScrollingText('right');
                    activeText.css({ 'left': Math.round(rightBound + scrollingTextWidth - scrollAmountBoundary + startLetterIndent) + 'px' });
                    rightBound += scrollingTextWidth + startLetterIndent;
                    leftBound = rightBound - scrollingTextWidth - scrollAmountBoundary - startLetterIndent;
                }
            });
        })
    }
});