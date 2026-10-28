// Модальное окно
$('.open-modal').click(function() {
    $('.sm-quest-modal').addClass('sm-open')
    $('body').addClass('lock')
})

$('.sm-quest-modal-close').click(function() {
    $('.sm-quest-modal').removeClass('sm-open')
    $('body').removeClass('lock')
})


function setMonthCalendar(year, month, day) {

    let monthDays = new Date(year, Number(month) , 0).getDate(),
        monthPrefix = new Date(year, Number(month) - 1, 0).getDay(),
        monthDaysText = '';

    if(monthPrefix > 5 && monthDays === 31) {
        $('.sm-date__content-right').addClass('big');
    }

    let dweeks_own = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    let lang = $('body[data-lang]').attr('data-lang');
    if (typeof lang == 'undefined') {
        lang = 'ru';
    }
    if(lang=='en'){
        dweeks_own = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
    }

    if (typeof dweeks_short != 'undefined') {
    dweeks_own = Array.from(dweeks_short);
    if(!parent.dweeks_short_init) {
        dweeks_own[7] = dweeks_own[0];
        dweeks_own.splice(0, 1);
    }
}
    for (let i = 0; i < 7; i++) {
        monthDaysText += '<div class="sm-date__calendar__day">' + dweeks_own[i] + '</div>';
    }

    if (monthPrefix > 0) {
        for (let i = 1; i <= monthPrefix; i++) {
            monthDaysText += '<div class="sm-date__calendar__num"></div>';
        }
    }

    for (let i = 1; i <= monthDays; i++) {
        monthDaysText += '<div ' + ((i == day) ? 'class="sm-date__calendar__num sm-number-active"' : 'class="sm-date__calendar__num"') + '>' + i + '</div>';
    }

    $('.sm-date__calendar-bottom').html(monthDaysText);
}

function StartCountDown(myDiv, myTargetDate) {
    let dthen = new Date(myTargetDate);
    let dnow = new Date();
    ddiff = new Date(dthen - dnow);
    gsecs = Math.floor(ddiff.valueOf() / 1000);
    CountBack(myDiv, gsecs);
}

function Calcage(secs, num1, num2) {
    s = ((Math.floor(secs / num1)) % num2).toString();
    if (s.length < 2) {
        s = "0" + s;
    }
    return (s);
}

function CountBack(myDiv, secs) {
    let timeArr = [],
        holder;
    if (secs <= 0) {secs = 0}
    timeArr.days = Calcage(secs, 86400, 100000).split('');
    timeArr.hours = Calcage(secs, 3600, 24).split('');
    timeArr.minutes = Calcage(secs, 60, 60).split('');
    timeArr.seconds = Calcage(secs, 1, 60).split('');


    Object.keys(timeArr).map(function (key) {
        holder = document.getElementById(key);
        for (let i = 0; i < holder.childNodes.length; ++i) {
            $($(holder).find('.sm-timer-time_number > span')[i]).text(timeArr[key][i])
            if(key == 'days')
            {
                $(holder).find('.sm-timer-time_number').hide();
                for(var t=0; t < timeArr[key].length; t ++){
                    $($(holder).find('.sm-timer-time_number')[t]).show();
                }
            }
        }
    });

    if(secs > 0) {
        setTimeout(function () {
            CountBack(myDiv, secs - 1);
        }, 990);
    }
}
function onResize(){
    if($('.slick-initialized').length > 0)
    {
        $('.slick-initialized').slick("unslick");
    }

    $('.sm-slider').slick({
        slidesToShow: 1,
        infinite: true,
        adaptiveHeight: false,
        nextArrow: document.querySelector('.sm-wishes-slider_next'),
        prevArrow: document.querySelector('.sm-wishes-slider_prev'),
    });


    $(".sm-slider").on('afterChange', function (event, slick, currentSlide) {
        $("#sm-number").text(currentSlide + 1);
    });

    $('.sm-dress-code__slider1').slick({
        slidesToShow: 1,
        infinite: true,
        adaptiveHeight: true,
        nextArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.arrow-next'),
        prevArrow: $('.sm-dress-code__slider1').parents('.sm-dress-code__box-gallery__item').find('.arrow-prev'),
    });

    $('.sm-dress-code__slider2').slick({
        slidesToShow: 1,
        infinite: true,
        adaptiveHeight: true,
        nextArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.arrow-next'),
        prevArrow: $('.sm-dress-code__slider2').parents('.sm-dress-code__box-gallery__item').find('.arrow-prev'),
    });

}

$(window).on('resize', function() {
    onResize();
});
function startAll() {

    var year = 2026;
    var month = 7;
    var day = 24;

    var nd = "24.07.2026";
    if(nd != '')
    {
        nd = nd.split('.');
        if(nd.length >= 3 && nd[2] >= new Date().getFullYear()) {
            year = nd[2];
            month = nd[1];
            day = nd[0];
        }
    }

    StartCountDown("timer", year + '/' + month + '/' + day);
    setMonthCalendar(year,month,day);
    onResize();
}

// Initialize the invitation directly, without the original editor frame.
$(function () {
    startAll();
    Fancybox.bind('[data-fancybox]', { Thumbs: false });
    jsScrollAnimations().init();
    $('body').removeClass('sm-loader sm-editor_preview');
    function updateFloatingButton() {
        $('.sm-mob-btn').toggleClass('sm-hidden_slow', window.scrollY < window.innerHeight / 2);
    }
    updateFloatingButton();
    $(window).on('scroll', updateFloatingButton);
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape') {
            $('.sm-quest-modal').removeClass('sm-open');
            $('body').removeClass('lock');
        }
    });
    $('.sm-form').on('submit', function (event) {
        event.preventDefault();
        var note = $(this).find('.local-form-note');
        if (!note.length) {
            note = $('<p class="local-form-note" role="status"></p>').appendTo(this);
        }
        note.text('Отправка анкеты пока не подключена. Пожалуйста, подтвердите присутствие у организатора по телефону +7 (926) 888-77-88.');
    });
});
