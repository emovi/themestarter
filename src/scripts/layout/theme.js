import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import 'lazysizes/plugins/rias/ls.rias';
import 'lazysizes/plugins/bgset/ls.bgset';
import 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';

import '../../styles/theme.scss';
import '../../styles/theme.scss.liquid';

import $ from 'jquery';
import {focusHash, bindInPageLinks} from '@shopify/theme-a11y';
import {cookiesEnabled} from '@shopify/theme-cart';

// Common a11y fixes
focusHash();
bindInPageLinks();

// Apply a specific class to the html element for browser support of cookies.
if (cookiesEnabled()) {
  document.documentElement.className = document.documentElement.className.replace(
    'supports-no-cookies',
    'supports-cookies',
  );
}
//Empieza Código Personalizado
window.eG = window.eG || {};                     //Genera mi varspace 
eG.pageId = $("body").attr("id");
eG.esIndex = eG.pageId == "index";
eG.recalcWinPars = function() {
    //Esta función se ejecuta en window.resize y recalcula las medidas del viewport y elementos
    //Se ejecuta al iniciar cualquier página
    eG.altoViewport = $(window).height();           
    eG.anchoViewport = $(window).width();
    eG.headerH = eG.anchoViewport < 768 ? 94 : 
    										 eG.esIndex ? 172 : 154;
    eG.altoMain = eG.altoViewport - eG.headerH; //alto de la sección main y por tanto del slider ppal y de emovisecc
    //Calcula Media Queries
    // eG.mq[0] Menú Secundario a Columna
    // eG.mq[1] Colapsa Menú Principal
    // eG.mq[2] Colapsa Menú Secundario
    // eG.mq[3] Elimina media icons y deja solo el phone icon
    eG.mq = [919, 736, 613, 449];       
};
eG.recalcWinPars();

eG.despliegaMP = function(e) {
    //Despliega el menú Ppal en ViewPorts <= 768px
    console.log("En despliegaMP: Current Target: ", e.currentTarget.id,
                " Current Event type: ", e.type);
    
    var targetToggleClass = "#menulist";
    
    //e.currentTarget.id == "menucollapsedsvg" => {MenuPpal} 
    //e.currentTarget.id == "menusecuncollapsedsvg" {MenuSecundario}
    if (e.type == "click") {
        $(targetToggleClass).toggleClass("mobile");
    } else {
        $(targetToggleClass).toggleClass("mobile");
    }
    
    e.preventDefault();
    e.stopPropagation();
    return false;
};

$(function() {
	console.log( "Document ready! Datos Globales: ", eG);
	//Change logo-svg
	if (eG.anchoViewport < 768) {
		$('#svgintro').attr("viewBox","0 0 200 200");
		//Asigna callback desplegar menú en icono menúcollapsed
		$("#menucollapsedsvg").on("click touchstart", eG.despliegaMP);
	}
	$("body").css("padding-top",eG.headerH);
	
	//eMovi functions
	//Facebook SDK Init
	$.ajaxSetup({ cache: true });
	$.getScript('https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js', function(){
			FB.init({
			  appId: '1314828318653827',
			  status:true,
			  version: 'v3.1' // or v2.1, v2.2, v2.3, ...
			});
			(function(d, s, id) {
			  var js, fjs = d.getElementsByTagName(s)[0];
			  if (d.getElementById(id)) return;
			  js = d.createElement(s); js.id = id;
			  js.src = 'https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js#xfbml=1&version=v3.1&autoLogAppEvents=1'; //#xfbml=1&version=v3.1&autoLogAppEvents=1
			  fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
			//$('#loginbutton,#feedbutton').removeAttr('disabled');
			//FB.getLoginStatus(updateStatusCallback);
	});
	//Termina FB Init
	//fisiowidget functions
	eG.faqFlyersUp = false;
	$("#fisiowidget-faqs").on("mouseenter mouseleave click touchstart touchend", function(e) {
			// this es el svg ppal del widget console.log("En fisiowidget: ", this);
			console.log("Last type:", e.type);
			console.log("Esto es:", this);

			TweenMax.set(this, {
			                        opacity:1,
			                        rotation:0,
			                        transformOrigin:"50% 50%",
			                        overwrite:1
			                    });                    
			switch (e.type) {
			            case "mouseenter":
			            	console.log("En mouseenter touchend expanding faqs-flyer", e.type);
			            	//rota widget
			                TweenMax.to(this, 0.5, {rotation:360});
			                //aparece criscross
			                TweenMax.to("#criscross", 0.5, {opacity:1});
			                //desparece nelcross
			                TweenMax.to(".nelcross", 0.5, {opacity:0});
			                //expand widget elements
			                TweenMax.to(".faqs-flyer", 0.5,
											{
											opacity:1,
											y:function( index, target) {
												console.log("En y:", index, target);
												return -80 - (index * 60);
											},
											ease:Power3.easeOut, force3D:true
											});
			                eG.faqFlyersUp = true;
			                break;
			            case "mouseleave":
			            	console.log("En mouselave doing nothing", e.type);
			                break;
			            case "click":
			            	console.log("En click touchend unexpanding faqs-flyer", e.type);
			            	//rota widget
			                TweenMax.to(this, 0.5, {rotation:360});
			                //desaparece criscross
			                TweenMax.to("#criscross", 0.5, {opacity:0});
			                //aparece nelcross
			                TweenMax.to(".nelcross", 0.5, {opacity:1});
			                //retrae widget elements
			            	TweenMax.to(".faqs-flyer", 0.5, {
			                        opacity:0,
			                        y:"20",
			                        overwrite:1
			                    });
			            	eG.faqFlyersUp = false;
			                break;
			            case "touchstart":
			            	console.log("En touchstart handling faqs-flyer", e.type);
			                if (!eG.faqFlyersUp) {
			                    //rota widget si los flyers stán abajo
			                	TweenMax.to(this, 0.5, {rotation:360});
			                    //aparece criscross
			                    TweenMax.to("#criscross", 0.5, {opacity:1});
			                    //desparece nelcross
			                    TweenMax.to(".nelcross", 0.5, {opacity:0});
			                    //expande widget elements
			                    TweenMax.to(".faqs-flyer", 0.5,
												{
												opacity:1,
												y:function( index, target) {
													console.log("En y:", index, target);
													return -80 - (index * 60);
												},
												ease:Power3.easeOut
												});
			                    eG.faqFlyersUp = true;
			                }
			            	else {
			            		//rota widget si los flyers están arriba
			                	TweenMax.to(this, 0.5, {rotation:360});
			                    //desaparece criscross
			                    TweenMax.to("#criscross", 0.5, {opacity:0});
			                    //aparece nelcross
			                    TweenMax.to(".nelcross", 0.5, {opacity:1});
			                    //retrae widget elements
			                	TweenMax.to(".faqs-flyer", 0.5, {
			                            opacity:0,
			                            y:"20",
			                            overwrite:1
			                        });
			                	eG.faqFlyersUp = false;
			                }
			                break;
			            default:
			            	console.log("En Default wondering how this happened", e.type);
			            	break;
			        }//termina switch
			        e.stopPropagation();
				    e.preventDefault();
				    return false;
			}); //Termina Fisiowidget-faqs.on mouseenter click... 
	$("#snm_carrousel").on("mouseenter mouseleave click", function(e) {
	        TweenMax.set(".infinitprod", {
	                        opacity:1,
	                        scale:1,
	                        overwrite:1
	                    });
	        switch (e.type) {
	            case "mouseenter":
	                TweenMax.staggerTo(".infinitprod", 0.25,
									{
									scale:1.1,
									opacity:0.6,
									ease:Power3.easeOut, 
	                                repeat:1,
	                                yoyo:true
									}, 0.1);
	                break;
	            case "mouseleave":
	                break;
	            case "click":
	                break;
	        }//termina switch 
    });
    //Termina eMovi functions from fisiotleta
	
	$(window).on("resize", function() {
	    eG.recalcWinPars();
	    if (eG.anchoViewport < 768) {
			$('#svgintro').attr("viewBox","0 0 200 200");
		} else {
			$('#svgintro').attr("viewBox","0 0 200 200");
		}
	    //Asigna nueva altura a las secciones
	    //$(".emovisecc").css("height",eG.altoMain); 
	    //eG.reportaSVGAR();
	});//Termina función on resize
	//Esconde Popup
	$(".popupback").on("click touchstart", function(e) {
                $(this).parent().css("visibility","hidden");
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
    //Despliega Popups
    $("[data-popup-id]").on("click  touchstart", function(e) {
					var popupId;

					popupId = "#" + $(this).data("popupId");
					console.log("En data-popup-id: ", popupId);
					$(popupId).css("visibility","visible");
               		e.preventDefault();
           			e.stopPropagation();
                	return false;
                });
});
//Termina Código Personalizado
