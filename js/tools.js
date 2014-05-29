var sliderSpeed     = 500;  // скорость перемотки слайдера
var sliderPeriod    = 5000; // время автоматической перемотки слайдера (0 - автоперемотки нет)
var sliderTimer     = null;

(function($) {

    $(document).ready(function() {

        // слайдер
        $('.slider').each(function() {
            var curSlider = $(this);
            curSlider.data('curIndex', 0);
            curSlider.data('disableAnimation', true);

            if (curSlider.find('li').length > 1) {
                var newHTML = '';
                curSlider.find('li').each(function() {
                    newHTML += '<a href="#"></a>';
                });
                curSlider.find('.slider-ctrl').html(newHTML);
                curSlider.find('.slider-ctrl a:first').addClass('active');
            }

            curSlider.find('ul').width(curSlider.find('li:first').width() * (curSlider.find('li').length + 1));

            if (curSlider.find('li').length > 1 && sliderPeriod > 0) {
                sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
            }
        });

        function sliderNext() {
            var curSlider = $('.slider');

            window.clearTimeout(sliderTimer);
            sliderTimer = null;

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.data('curIndex');
                curIndex++;
                var isLast = false;
                if (curIndex == curSlider.find('li').length) {
                    isLast = true;
                    curSlider.find('ul').append('<li>' + curSlider.find('li:first').html() + '</li>');
                }

                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, sliderSpeed, function() {
                    if (isLast) {
                        curIndex = 0;
                        curSlider.find('ul').css({'left': 0});
                        curSlider.find('li:last').remove();
                    }

                    curSlider.find('.slider-ctrl a.active').removeClass('active');
                    curSlider.find('.slider-ctrl a').eq(curIndex).addClass('active');

                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                    if (curSlider.find('li').length > 1 && sliderPeriod > 0) {
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    }
                });
            }
        }

        $('.slider').on('click', '.slider-ctrl a', function(e) {
            var curSlider = $('.slider');

            window.clearTimeout(sliderTimer);
            sliderTimer = null;

            if (curSlider.data('disableAnimation')) {
                var curIndex = curSlider.find('.slider-ctrl a').index($(this));

                curSlider.find('.slider-ctrl a.active').removeClass('active');
                curSlider.find('.slider-ctrl a').eq(curIndex).addClass('active');

                curSlider.data('curIndex', curIndex);
                curSlider.data('disableAnimation', false);
                curSlider.find('ul').animate({'left': -curIndex * curSlider.find('li:first').width()}, sliderSpeed, function() {
                    curSlider.data('curIndex', curIndex);
                    curSlider.data('disableAnimation', true);
                    if (curSlider.find('li').length > 1 && sliderPeriod > 0) {
                        sliderTimer = window.setTimeout(sliderNext, sliderPeriod);
                    }
                });
            }

            e.preventDefault();
        });

        // табы
        $('.content-tabs a').click(function(e) {
            var curLi = $(this).parent();

            if (!curLi.hasClass('active')) {
                var curTabs = curLi.parents().filter('.content-tabs');
                var curIndex = curTabs.find('li').index(curLi);
                curTabs.find('li.active').removeClass('active');
                curLi.addClass('active');

                var curTabsContainer = curTabs.next();
                curTabsContainer.find('.content-tabs-inner').removeClass('active');
                curTabsContainer.find('.content-tabs-inner').eq(curIndex).addClass('active');
            }

            e.preventDefault();
        });

        // еще туры
        $('.tours-more a').click(function(e) {
            var curBlock = $(this).parent().parent();
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                curBlock.find('.tours').append(html);
                if (curBlock.find('.tours .tours-more').length == 1) {
                    curBlock.find('.tours-more a').attr('href', curBlock.find('.tours .tours-more a').attr('href'));
                    curBlock.find('.tours .tours-more').remove();
                } else {
                    curBlock.find('.tours-more').remove();
                }
                updateReviews();
            });
            e.preventDefault();
        });

        // формы
        if ($('form').length > 0) {
            $.Placeholder.init({color : '#808080'});

            $.extend($.validator.messages, {
                required: '— Не введен текст сообщения',
                email: '- Введен некорректный e-mail'
            });

            $('.form-checkbox span input:checked').parent().addClass('checked');
            $('.form-checkbox').click(function() {
                $(this).find('span').toggleClass('checked');
                $(this).find('input').prop('checked', $(this).find('span').hasClass('checked')).trigger('change');
            });

            $('.form-radio span input:checked').parent().addClass('checked');
            $('.form-radio').click(function() {
                var curName = $(this).find('input').attr('name');
                $('.form-radio input[name="' + curName + '"]').parent().removeClass('checked');
                $(this).find('span').addClass('checked');
                $(this).find('input').prop('checked', true).trigger('change');
            });

            $('.form-select select').chosen({disable_search: true});

            $('form').each(function() {
                $(this).validate();
            });
        }

        // отзывы
        $(window).load(updateReviews);

        function updateReviews() {
            if ($('.review').length > 0) {
                $('.review-text').css({'min-height': 0});

                $('.review:odd').each(function() {
                    var curItem   = $(this);
                    var curIndex  = $('.review').index(curItem);
                    var prevItem  = $('.review').eq(curIndex - 1);

                    var curHeight = curItem.find('.review-text').height();

                    if (prevItem.find('.review-text').height() > curHeight) {
                        curHeight = prevItem.find('.review-text').height();
                    }

                    curItem.find('.review-text').css({'min-height': curHeight});
                    prevItem.find('.review-text').css({'min-height': curHeight});
                });
            }
        }

        // галерея фото
        $('.gallery-preview a').click(function(e) {
            var curLink = $(this);

            if (!curLink.hasClass('active')) {
                $('.gallery-preview a.active').removeClass('active');
                curLink.addClass('active');
                $('.gallery-big img').attr('src', curLink.attr('href'));
            }

            e.preventDefault();
        });

        // заказ обратного звонка
        $('.header-callback-link a').click(function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);

                $.Placeholder.init({color : '#808080'});

                $.extend($.validator.messages, {
                    required: '— Не введен текст сообщения',
                    email: '- Введен некорректный e-mail'
                });

                $('.window .form-select select').chosen({disable_search: true});

                $('.window form').validate({
                    submitHandler: function(form) {
                        $('.window .loading').show();
                        $.ajax({
                            url: $(form).attr('action'),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            windowClose();
                            windowOpen(html);
                        });
                    }
                });
            });

            e.preventDefault();
        });

        // заказ тура
        $('.wrapper').on('click', '.tour-header a, .tour-anonce-buy a', function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);

                $.Placeholder.init({color : '#808080'});

                $.extend($.validator.messages, {
                    required: '— Не введен текст сообщения',
                    email: '- Введен некорректный e-mail'
                });

                $('.window form').validate({
                    submitHandler: function(form) {
                        $('.window .loading').show();
                        $.ajax({
                            url: $(form).attr('action'),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            windowClose();
                            windowOpen(html);
                        });
                    }
                });
            });

            e.preventDefault();
        });

        $('.tour-inner-list').on('click', '.tour-inner-list-btn a', function(e) {
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                windowOpen(html);

                $.Placeholder.init({color : '#808080'});

                $.extend($.validator.messages, {
                    required: '— Не введен текст сообщения',
                    email: '- Введен некорректный e-mail'
                });

                $('.window form').validate({
                    submitHandler: function(form) {
                        $('.window .loading').show();
                        $.ajax({
                            url: $(form).attr('action'),
                            dataType: 'html',
                            cache: false
                        }).done(function(html) {
                            windowClose();
                            windowOpen(html);
                        });
                    }
                });
            });

            e.preventDefault();
        });

        // заказ
        $('.order-form form').submit(function() {
            if ($('.order-form input.error, .order-form textarea.error').length == 0) {
                $('.order-form .loading').show();
                $.ajax({
                    url: $('.order-form form').attr('action'),
                    dataType: 'html',
                    cache: false
                }).done(function(html) {
                    windowOpen(html);
                    $('.order-form .loading').hide();
                    $('.order-form input[type="text"], .order-form textarea').val('').change();
                });
            }
            return false;
        });

        // варианты
        $('.tour-inner-list-more a').click(function(e) {
            var curBlock = $(this).parent().parent();
            $.ajax({
                url: $(this).attr('href'),
                dataType: 'html',
                cache: false
            }).done(function(html) {
                curBlock.find('.tour-inner-list').append(html);
                if (curBlock.find('.tour-inner-list .tour-inner-list-more').length == 1) {
                    curBlock.find('.tour-inner-list-more a').attr('href', curBlock.find('.tour-inner-list .tour-inner-list-more a').attr('href'));
                    curBlock.find('.tour-inner-list .tour-inner-list-more').remove();
                } else {
                    curBlock.find('.tour-inner-list-more').remove();
                }
            });
            e.preventDefault();
        });

        $('.tour-inner-list').on('click', '.tour-inner-list-item-title a', function(e) {
            var curBlock = $(this).parent().parent();

            if (curBlock.hasClass('active')) {
                curBlock.removeClass('active');
            } else {
                $('.tour-inner-list-item.active').removeClass('active');
                curBlock.addClass('active');
            }

            e.preventDefault();
        });

        $(document).click(function(e) {
            if ($(e.target).parents().filter('.tour-inner-list').length == 0) {
                $('.tour-inner-list-item.active').removeClass('active');
            }
        });

        // полоса "наверх"
        $(document).mousemove(function(e) {
            if (e.pageX > $(window).width() - 90) {
                $('.up').show();
            } else {
                $('.up').hide();
            }
        });

        $('.up').click(function() {
            $.scrollTo(0, 500);
        });

    });

    // открытие окна
    function windowOpen(contentWindow) {
        var windowWidth     = $(window).width();
        var windowHeight    = $(window).height();
        var curScrollTop    = $(window).scrollTop();
        var curScrollLeft   = $(window).scrollLeft();

        $('body').css({'width': windowWidth, 'height': windowHeight, 'overflow': 'hidden'});
        $(window).scrollTop(0);
        $('.wrapper').css({'top': -curScrollTop});
        $('.wrapper').data('scrollTop', curScrollTop);

        $('body').append('<div class="window"><div class="window-overlay"></div><div class="window-container"><div class="window-content">' + contentWindow + '<a href="#" class="window-close"></a></div></div></div>')

        if ($('.window-container').width() > windowWidth - 40) {
            $('.window-container').css({'margin-left': 20, 'left': 'auto'});
            $('.window-overlay').width($('.window-container').width() + 40);
        } else {
            $('.window-container').css({'margin-left': -$('.window-container').width() / 2});
        }

        if ($('.window-container').height() > windowHeight - 40) {
            $('.window-container').css({'margin-top': 20, 'top': 'auto'});
            $('.window-overlay').height($('.window-container').height() + 40);
        } else {
            $('.window-container').css({'margin-top': -$('.window-container').height() / 2});
        }

        $('.window-overlay').click(function() {
            windowClose();
        });

        $('.window-close').click(function(e) {
            windowClose();
            e.preventDefault();
        });

        $('body').bind('keyup', keyUpBody);
    }

    // обработка Esc после открытия окна
    function keyUpBody(e) {
        if (e.keyCode == 27) {
            windowClose();
        }
    }

    // закрытие окна
    function windowClose() {
        $('body').unbind('keyup', keyUpBody);
        $('.window').remove();
        $('.wrapper').css({'top': 'auto', 'left': 'auto'});
        $('body').css({'width': 'auto', 'height': '100%', 'overflow': 'visible'});
        $(window).scrollTop($('.wrapper').data('scrollTop'));
    }

})(jQuery);