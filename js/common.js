// Main Preloader Logic with Gallery Integration
(function() {
  const preloader = document.getElementById('mainPreloader');
  const progressBar = document.getElementById('progressBar');
  const progressPercentage = document.getElementById('progressPercentage');
  
  let progress = 0;
  let loadedResources = 0;
  let totalResources = 8; // CSS, JS, основные изображения, шрифты
  let galleryImagesLoaded = 0;
  let totalGalleryImages = 12; // количество изображений на первой странице
  let isGalleryLoading = false;
  
  // Глобальная функция для обновления прогресса
  window.updatePreloaderProgress = function(percentage) {
    updateProgress(percentage);
  };
  
  // Глобальная функция для установки режима загрузки галереи
  window.setGalleryLoadingMode = function(totalImages) {
    isGalleryLoading = true;
    totalGalleryImages = totalImages;
    galleryImagesLoaded = 0;
    totalResources = 8 + totalImages; // основные ресурсы + изображения галереи
    const baseProgress = (8 / totalResources) * 100;
    updateProgress(baseProgress);
  };
  
  // Глобальная функция для отслеживания загрузки изображений галереи
  window.incrementGalleryProgress = function() {
    if (isGalleryLoading) {
      galleryImagesLoaded++;
      const galleryProgress = (galleryImagesLoaded / totalGalleryImages) * 30; // 30% от общего прогресса для галереи
      const baseProgress = 70; // базовый прогресс после загрузки основных ресурсов
      updateProgress(baseProgress + galleryProgress);
      
      if (galleryImagesLoaded >= totalGalleryImages) {
        finishPreloader();
      }
    }
  };
  
  function updateProgress(percentage) {
    progress = Math.min(percentage, 100);
    progressBar.style.width = progress + '%';
    progressPercentage.textContent = Math.round(progress) + '%';
  }
  
  function incrementProgress() {
    loadedResources++;
    const newProgress = (loadedResources / totalResources) * (isGalleryLoading ? 70 : 90);
    updateProgress(newProgress);
  }
  
  function finishPreloader() {
    setTimeout(() => {
      updateProgress(100);
      setTimeout(() => {
        preloader.classList.add('hidden');
        setTimeout(() => {
          if (preloader.parentNode) {
            preloader.parentNode.removeChild(preloader);
          }
        }, 500);
      }, 300);
    }, 200);
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
        if (loadedResources === 8 && !isGalleryLoading) {
          finishPreloader();
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
  
  // Резервный скрыватель через максимум 6 секунд
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      finishPreloader();
    }
  }, 6000);
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



  // Scroll functionality moved to inline JavaScript for better performance


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

