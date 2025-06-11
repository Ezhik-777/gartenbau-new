// Main Preloader Logic
(function() {
  const preloader = document.getElementById('mainPreloader');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  
  let progress = 0;
  let loadedResources = 0;
  const totalResources = 8; // CSS, JS, основные изображения, шрифты
  
  function updateProgress(percentage) {
    progress = Math.min(percentage, 100);
    progressBar.style.width = progress + '%';
    progressPercentage.textContent = Math.round(progress) + '%';
  }
  
  function incrementProgress() {
    loadedResources++;
    const newProgress = (loadedResources / totalResources) * 90; // 90% для ресурсов, 10% для DOM
    updateProgress(newProgress);
  }
  
  // Симуляция загрузки критических ресурсов
  function simulateResourceLoading() {
    const resources = [
      { name: 'CSS', delay: 200 },
      { name: 'Fonts', delay: 400 },
      { name: 'JavaScript', delay: 300 },
      { name: 'Hero Image', delay: 500 },
      { name: 'Service Images', delay: 600 },
      { name: 'Gallery System', delay: 300 },
      { name: 'Form Scripts', delay: 200 },
      { name: 'Final Setup', delay: 400 }
    ];
    
    resources.forEach((resource, index) => {
      setTimeout(() => {
        incrementProgress();
        if (loadedResources === totalResources) {
          // Завершаем до 100%
          setTimeout(() => {
            updateProgress(100);
            // Скрываем прелоадер
            setTimeout(() => {
              preloader.classList.add('hidden');
              // Удаляем через 500ms после анимации
              setTimeout(() => {
                if (preloader.parentNode) {
                  preloader.parentNode.removeChild(preloader);
                }
              }, 500);
            }, 300);
          }, 200);
        }
      }, resource.delay + index * 100);
    });
  }
  
  // Запускаем симуляцию после загрузки DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', simulateResourceLoading);
  } else {
    simulateResourceLoading();
  }
  
  // Резервный скрыватель через максимум 4 секунды
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      updateProgress(100);
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 500);
      }, 200);
    }
  }, 4000);
})();

jQuery(document).ready(function( $ ) {



  $('body').click(function () {
    if( $(".toggle-mnu").hasClass("on") ){
      $(".toggle-mnu").removeClass("on");
      $(".top-mnu").fadeOut();
    }
  });


  $(".top-mnu").click(function (e) {
    e.stopPropagation();
  });


  $('.burger').click(function () {
    $(this).toggleClass('burger-open');
    $('body').toggleClass("body-open");
    $('.header__col').toggleClass("open");    
  });

  // Закрыть мобильное меню при клике на ссылку
  $('.head__mn-ul li a').click(function () {
    $('.burger').removeClass('burger-open');
    $('body').removeClass("body-open");
    $('.header__col').removeClass("open");
  });


  $('[data-fancybox="gallery"]').fancybox({
    arrows: true,
    infobar: false,
    smallBtn: true,
    toolbar: true,
    iframe : {
      css : {
        width : '950px'
      }
    },    
    slideClass: "myClass",
    baseClass: "myclass"
  });

  $('[data-fancybox="gallery2"]').fancybox({
    arrows: true,
    infobar: false,
    smallBtn: true,
    toolbar: true,
    iframe : {
      css : {
        width : '950px'
      }
    },    
    slideClass: "myClass",
    baseClass: "myclass"
  });


  $('.projecs__sl').slick({
    infinite: true,    
    speed: 600,
    slidesToScroll: 1,
    autoplay: false,    
    slidesToShow: 4,
    cssEase: 'linear',  
    autoplaySpeed: 0,  
    touchThreshold: 10,
    arrows: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2
        }
      }
    ]
  });



/************************************/

/*$('.wrapper').prepend('<span class="eye-3"></span>');
const url = window.location.href;
const match = url.match(/(\d+-?\d*)\.html$/);
const pg = match[1];
$('body').addClass('active').css('background-image', "url('../img/"+pg+".jpg')");
$('body:not(.active)').css('background-image', "unset");

$('.eye-3').click(function (e) {
  e.preventDefault();  
  $('body').toggleClass('active');    
  $('body.active').css('background-image', "url('../img/"+pg+".jpg')");
  $('body:not(.active)').css('background-image', "unset");
});*/

/************************************/



  $('a[href*=\\#]:not([href=\\#])').click(function () {
    elementClick = $(this).attr("href");
    destination = $(elementClick).offset().top;
    $("html:not(:animated),body:not(:animated)").animate({scrollTop: destination - 85}, 1100);
    return false;
  });


  /*$(window).scroll(function(){
    var wt = $(window).scrollTop();  
    var wh = $(window).height();    
    if (wt > 600) {
      $('.serv-arr-up').show(400);
    }
    else {
     $('.serv-arr-up').hide();
   }
 });*/

  


}); //ready

