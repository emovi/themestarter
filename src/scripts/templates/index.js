import {load} from '@shopify/theme-sections';
import '../sections/product';

load('*');

import '../../styles/templates/index.scss.liquid';
import $ from 'jquery';

//**************************************
//***** Inicia Código eMovi
//**************************************
console.log("Solo en Index gralito: ", eG);
//Crea Opciones de Slider
eG.creaSlider = function() {
	var i = 0;
	eG.sliderTimer = null;
	eG.numSlides = 4;
	//Duration de cada slide
	eG.waitSlides= [10000, 10000, 10000, 10000];
	//Crea HTML
    for(i = 1; i <= eG.numSlides ; i++) {
        //Crea elementos del slide
        // <li>
        //     <span id="slideimg1">Image</span>
        //     <div id="slidecapt1" class="slidecapt"></div>
        // </li>
        $("#ulslider").append('<li><span id="slideimg' + i.toString().trim() + '">Image' + i.toString().trim() +'</span><div id="slidecapt' + i.toString().trim() +'" class="slidecapt"></div></li>');
        //crea un punto index por cada slide
        $("#sliderindx").append("<div class='slidepointerwrap'></div>");
    	
    	switch(i) {
    		//Incluye Textos de captions
        case 1:
            $("#slidecapt1").html("<p>Envíos a toda la república.</p>");
            break;
        case 2:
        	$("#slidecapt2").html("<p>Compra fácil, rápida y segura.</p>");
            break;
        case 3:
            $("#slidecapt3").html("<p>Entra a nuestro grupo, entérate de nuestras promociones.</p>");
            break;
        case 4:
            $("#slidecapt4").html("<p>Fisiotleta. Contigo hasta la meta.</p>");
            break;
        default:
        	break;
        }//Termina switch
    }//Termina For
};
eG.tweenSlider = function(slideNumber) {
        //Presenta las láminas o elementos de un slider
        slideNumber = slideNumber || 1;

        //Elimina láminas pendientes de presentar 
        clearTimeout(eG.sliderTimer);
        
        // //Menú Secundario Colapsado => cierra menú
        // if (eG.anchoViewport <= eG.mq[2]) {
        //     //Cierra Menú
        //     $("#secunmenuwrap").removeClass("mobile");
        //     //Regresa al top
        //     window.scrollTo(0, 0);
        // }
        //Crea parámetros de la presentación
        //Slide Pars
        var esteSlideNum = slideNumber;
        var nextSlide = esteSlideNum == eG.numSlides ? 1 : esteSlideNum + 1;
        var estaOpcionMenu = "#secunmenulist li:nth-child(" + esteSlideNum + ")";
        var estePunto = "#sliderindx div:nth-child(" + esteSlideNum + ")";
        var esteSlide = "#ulslider li:nth-child(" + esteSlideNum + ") span";
        var esteChoro = "#ulslider li:nth-child(" + esteSlideNum + ") div.slidecapt";
        var todasOpcionMenu = "#secunmenulist li";
        var todosLosPuntos = "#sliderindx div";
        var todosLosSlides = "#ulslider span";
        var todosLosChoros = "#ulslider li div.slidecapt";
        
        console.log("En eG.tweenSlider: ", arguments);
        $("#infolog").append("data: ", esteSlide , "<br>");
        
        //Establece opciones iniciales de la animación
        TweenMax.set(todasOpcionMenu, {className: '-=active'});
        TweenMax.set(todosLosSlides, {className: '-=active', opacity:0 ,zIndex:-1, overwrite:1});
        TweenMax.set(todosLosChoros, {className: '-=active', opacity:0 ,zIndex:-1, overwrite:1});
        TweenMax.set(estaOpcionMenu, {className: '+=active'});
        TweenMax.set(esteSlide, {className: '+=active', zIndex:0, opacity:0, scale:0.5, overwrite:1});
        TweenMax.set(esteChoro, {className: '+=active', zIndex:2, opacity:0, scale:0.5, overwrite:1});

        //Cambia color del punto seleccionado y pone en blanco los demás
        TweenMax.set(todosLosPuntos, { backgroundColor: "#F7F6F7" });
        TweenMax.set(estePunto, { backgroundColor: "#17222D" });

        //Presenta esetSlide, este Choro esteDet
        TweenMax.to(esteSlide, 0.5, { opacity: 1 , scale:1, overwrite:1});
        TweenMax.to(esteChoro, 0.5, { opacity: 1 , scale:1, delay: 1, overwrite:1});
      
        //Programa el siguiente slider
        clearTimeout(eG.sliderTimer);
        eG.sliderTimer = setTimeout(eG.tweenSlider, eG.waitSlides[esteSlideNum - 1], nextSlide);
};//Termina funcion tweenSlider
//**************************************
//***** Termina Código eMovi
//**************************************
$(function() {
    console.log( "Index Document ready!", eG);
    //Inicia Código eMovi
	console.log("Solo en Index: ", eG);
	document.addEventListener("visibilitychange", function() {
			    if (document.visibilityState == 'visible') {
			        console.log( document.visibilityState );
			        $('#infolog').append("La Página es visible<br>");
			        eG.tweenSlider(1);
			    }//Termina if document = visible
			    if (document.visibilityState == 'hidden') {
			        console.log( document.visibilityState );
			        $('#infolog').append("Página invisible<br>");
			        clearTimeout(eG.sliderTimer);
			    }//Termina if document = hidden
			}); //Termina addeventlistener visibilitychange
	eG.creaSlider();
	//Asigna altura main a elemento #emovislider
    //$("#emovi-slider").css("height", eG.altoMain);
    //Asigna altura mínima a secciones shopify
    $(".shopify-section").each(function(i, elem){
        var excluyeSecciones = [
                                    "shopify-section-header",
                                    "shopify-section-footer",
                                    "shopify-section-newsletter",
                                ];

        var seccion = elem.getAttribute("id");
        //notExcluded = true si el id de la sección no está en el Array excluyeSecciones 
        //              y la clase de la sección no incluye collection-list-section
        var notExcluded = ! (excluyeSecciones.includes(seccion) || this.classList.contains("collection-list-section"));

        console.log(i + ' ' + elem);
        if ( notExcluded ) {
            $(this).css({
                    "min-height": eG.altoMain + "px",
                    "display":"flex",
                    "justify-content": "center",
                    "align-items": "stretch"
                    //"box-shadow": "inset 0px 10px 10px -10px rgba(23,34,45,0.75)"
                });
        }
    }); //Termina each .shopify-section
    //Asigno funcion scroll a elementos del menuslider
    $("#slidermenu a").on("click", function(e) {
            e.preventDefault();
            var takeMe = this.getAttribute("href");
            //offsetY es 157 y no 137 para compensar el bottom margin del elemento superior  
            TweenMax.to(window, 2, {scrollTo:{y:takeMe, offsetY:(eG.headerH + 10)}, ease:Back.easeOut.config(1)});
        });
    //Asigno funciones a puntos index del Slider
    $(".slidepointerwrap").each(function(index) {
            $(this).on("click", { opcion: index + 1 }, function(e) {
                                                    eG.tweenSlider(e.data.opcion);
                                                });
        });
    eG.tweenSlider(1);
});