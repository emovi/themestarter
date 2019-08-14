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
eG.recalcWinPars = function() {
    //Esta función se ejecuta en window.resize y recalcula las medidas del viewport y elementos
    //Se ejecuta al iniciar cualquier página
    eG.altoViewport = $(window).height();           
    eG.anchoViewport = $(window).width();
    eG.headerH = eG.anchoViewport < 768 ? 94 : 137;
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
	//Change logo-legasi
	if (eG.anchoViewport < 768) {
		$('#svgintro').attr("viewBox","0 80 920 840");
		//Asigna callback desplegar menú en icono menúcollapsed
		$("#menucollapsedsvg").on("click touchstart", eG.despliegaMP);
	}
	$("body").css("padding-top",eG.headerH);
	//Redirecciona al registrar un cliente
	$('#create_customer').on("submit", function(event) {
	  event.preventDefault();
	  var data = $(this).serialize();
	  var getVault = 'https://legasi.mx/boveda-basica.php?usrmail=' + $("#Email").val();

	  console.log("hit submit");
	  //create new account
	  $.post('/account', data)
	    .done(function(data){
	      var logErrors = $(data).find('.errors').html();

	      console.log("hit done");
	      //if there are errors show them in the html form
	      //debe entrar solo si existen errores
	      if (logErrors){
	        $('#create_customer .errors').html(logErrors);
	        $('#create_customer .errors').show();
	        console.log("hit Errors", logErrors);
	        // var emovierror = $( "<div id='emovierror'></div>" );
	        // $('body').append(emovierror);
	        // $('#emovierror').empty().append(data);
	      //if account creation is successful show checkout page
	      }else{
	        console.log('Transfiriendo a Ultratumba');
	        eG.Redirigido = 'a Ultratumba';
	        document.location.href = '/pages/emovicors';
	      }
	      })
	    .fail(function(){console.log('error en Post Externo');
	  });
	  return false;
	}); //Termina Create customer on submit
	//Facebook SDK Init
	$.ajaxSetup({ cache: true });
	$.getScript('https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js', function(){
	              FB.init({
	                    appId: '270690626878858',
	                    xfbml:true,
	                    version: 'v3.1' // or v2.1, v2.2, v2.3, ...
	                  });
	              (function(d, s, id) {
	                    var js, fjs = d.getElementsByTagName(s)[0];
	                    if (d.getElementById(id)) return;
	                    js = d.createElement(s); js.id = id;
	                    js.src = 'https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js#xfbml=1&version=v3.1&autoLogAppEvents=1';
	                    //js.src = 'https://connect.facebook.net/es_LA/sdk/xfbml.customerchat.js#xfbml=1&version=v3.1&autoLogAppEvents=1'
	                    fjs.parentNode.insertBefore(js, fjs);
	                  }(document, 'script', 'facebook-jssdk'));
	              //$('#loginbutton,#feedbutton').removeAttr('disabled');
	              //FB.getLoginStatus(updateStatusCallback);
	              });//Termina getscript
	$(window).on("resize", function() {
	    eG.recalcWinPars();
	    if (eG.anchoViewport < 768) {
			$('#svgintro').attr("viewBox","0 80 920 840");
		} else {
			$('#svgintro').attr("viewBox","0 0 3005 1000");
		}
	    //Asigna nueva altura a las secciones
	    //$(".emovisecc").css("height",eG.altoMain); 
	    //eG.reportaSVGAR();
	});//Termina función on resize
	$("#popup-snm").on("click touchstart", function(e) {
                $(this).css("visibility","hidden");
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
    $("#showPopup").on("click", function(e) {
					$("#popup-snm").css("visibility","visible");
               		e.preventDefault();
           			e.stopPropagation();
                	return false;
                });
});
//Termina Código Personalizado
