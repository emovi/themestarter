/**
 * Page Template Script
 */

import $ from 'jquery';
import '../../styles/templates/page.scss';

window.eG = window.eG || {};

eG.clearMssg = function() { 
    $("#emovimsjuser").empty().removeClass();
};

eG.getBovedaBasica = function() {
    var user =  eG.Customer,
                apiUrl = 'https://legasi.mx/api/edit-bbas.php';

    console.log("En Ajax Call getBovedaBasica");

	$.ajax({
        // The URL for the request
        // El Archivo php que procesará la llamada AJAX
        url: apiUrl,
     
        // The data to send (llega a $_REQUEST)
        // la información que pasaremos al Servidor,
        data: {
            isAjax: true,              //Flag reconoce llamada Ajax en PHP
            usuario: user
        },
     
        // Whether this is a POST or GET request
        // Esta opción determina si en el PHP se genera un $_POST o $_GET
        type: "POST",
     
        // The type of data we expect back
        // Es el tipo de información que regresa el PHP
        dataType: "json",

        //Request headers mandados al server
    })
        // Code to run if the request succeeds (is done);
        // The response is passed to the function
        .done(function( r ) {
            var deporray = "";
            console.log("Hit Done, Respuesta API: ", r);
            console.log("usr_id: ", r.bbas.usr_id);
            //Asigna valores a inputs
            $("input[name='user_id']").val(r.bbas.usr_id);
            $("input[name='bov_status']").val(r.bbas.status);
            $("#volantic").val(r.bbas.voluntad_antic);
            $("#donacorg").val(r.bbas.donacion_org);
            $("#planesfun").val(r.bbas.planes_funer);
            $("#preferenciasfun").val(r.bbas.preferencias_funer);
            //Asigna valores a depositarios
            for ( var i = 1; i <= r.numdep; i++) {
                deporray = "depositario" + i;
                deporray = deporray.trim();
                console.log("deporray: ", deporray);
                console.log("input[name='" + deporray + "[clave]']" + ").val(r.bbas[" + deporray +"].depositario_clave");
                $("input[name='" + deporray + "[email]']").val(r[deporray].email);
                $("input[name='" + deporray + "[nombre]']").val(r[deporray].nombre_oficial);
                $("input[name='" + deporray + "[alias]']").val(r[deporray].nombre_familiar);
                $("input[name='" + deporray + "[clave]']").val(r[deporray].depositario_clave);
            }
            //calcula valor de esRegistro true si es Registro false si no.  
            eG.esRegistro = (r.bbas.status == "cuenta"); 
            if ( eG.esRegistro ) {
                $("#guardabov").attr("disabled", false);
                $("input[type='checkbox']").attr("disabled", true);
            } else {
                $("#guardabov").attr("disabled", true);
                $("input[type='checkbox']").attr("disabled", false);
            }
            //deshabilita botón de envío de mail
            //para esRegistro siempre queda deshabilitada
            //para !esRegistro se habilita cuando se modifica algún input  
            $("#envmail").attr("disabled", true);
        }) //Termina Done
        // Code to run if the request fails; the raw request and
        // status codes are passed to the function
        .fail(function( xhr, status, errorThrown ) {
            //Avisa regreso de mailhandler si hay errores
            console.log( "La llamada Ajax tuvo problemas" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.log( "Respuesta: " + xhr.responseText);
            console.dir( "jqXHR: ", xhr );
        }) //Termina fail
        // Code to run regardless of success or failure;
        .always(function( a, textStatus ) {
            console.log( "Respuesta: ", textStatus, "Info en a: ", a );
        });//Termina jQuery.ajax() y funciones .done, .fail y .always concatenadas
};

eG.captBovedaBasica = function (e) {
    //Callback for onsubmit event form #emoviform
    //stop form from submitting normally
    e.preventDefault();
    //console.log("En Forma Bóveda Básica:", e);
    //return false;
    //Valida que se hayan capturado los elementos requeridos
    //y prepara llamada AJAX
    var requeridos = ["user_id", "user_cve", "user_email", "volantic", "donacorg", "planesfun", "preferenciasfun", "depositario1[email]", "depositario1[nombre]", "depositario1[alias]" ,"depositario1[clave]" ];
    var targetBlur = "#volantic, #donacorg, #planesfun, #preferenciasfun";
    var faltan = [];
    var goodDepo2 = false, goodDepo3 = false;   //Inicializo Banderas de cuenta de depositarios
    var Depo2Capt = 0, Depo3Capt=0;             //Inicializo variables cuenta de depositarios
    //Variable con los valores de los campos capturados
    var formatoBBas = $(this).serialize();
    var formatoValidate = $(this).serializeArray();
    console.log("Antes de ajax call.- Serialized BBasica: ", formatoBBas);
    console.log("Antes de ajax call.- Array BBasica: ", formatoValidate);
    //despliega valores capturados
    $('#popbody-snm').empty().append("Validando campos antes de ajax call<br>");
    $('#popbody-snm').append("Se recorre serializeArray()...<br>");
    //recorre el arreglo con los valores de los campos capturados
    //i.- indice del arreglo (0, 1, 2,...) 
    //campo.- array con nombre y valor de cada campo capturado
    $.each(formatoValidate, function(i, campo) {
        //recorre todos los elementos de los campos del formato
        $("#popbody-snm").append(i+1, ".- " , campo.name + " - " + campo.value + " tipo: " + typeof campo.value + "<br>");
        
        //Prepara arreglos para registrar errores en captura de campos
        if (!$.trim(campo.value) && requeridos.indexOf(campo.name) >= 0) {
            //revisa si el nombre del campo está en el array "requeridos" y, si está,
            //entra si el valor del campo requerido es ""
            //Asigna empty string en vez de string de espacios
            document.getElementById(campo.name).value="";
            if (campo.name=="user_email") {
                $("#user_email").attr("value","");
            }
            $("#" + campo.name).focus().blur();        //Refresca el campo, aparece placeholder
            faltan.push(campo.name);
            console.log("Apañado: ", faltan);
        }
        //Valida datos de depositarios dos y tres
        //Prepara variables de confirmación
        //cada variable será la cuenta de todos los campos string capturados de cada depositario diferentes a ""
        if (campo.name.indexOf("depositario2") != -1) {
            //Entra si es campo de depositario 2
            //incrementa Depo2Capt solo si el valor capturado es diferente de ""
            Depo2Capt += campo.value.trim() ? 1 : 0;
        }
        if (campo.name.indexOf("depositario3") != -1) {
            //Entra si es campo de depositario 3
            //incrementa Depo3Capt solo si el valor capturado es diferente de "" 
            Depo3Capt += campo.value.trim() ? 1 : 0;
        }
    }); //Termina each(camposSrArr)
    
    //Valida Campos de Depositarios 2 y 3
    //goodDepo serán true si DepoCapt = 0 o DepoCapt = 4
    //Estos casos son 2: 1.- No se capturó Depositario ó 2.- Se capturó toda la info del Depositario
    //goodDepo será false en cualquier otro caso y generará un error 
    $("#popbody-snm").append("<br> Depo2Capt: " + Depo2Capt + "<br>");
    $("#popbody-snm").append("<br> Depo3Capt: " + Depo3Capt + "<br>");
    goodDepo2 = Depo2Capt == 4 || Depo2Capt === 0;
    goodDepo3 = Depo3Capt == 4 || Depo3Capt === 0;
    
    //Valida información capturada
    eG.gotreCaptcha = true;         //Solo hasta incluir recptcha
    eG.isreCaptchaExpired = false;  //Solo hasta incluir recaptcha
    if (faltan.length > 0 || (!eG.gotreCaptcha) || eG.isreCaptchaExpired || (!goodDepo2) || (!goodDepo3)) {
        //Entra si hay problemas con la captura de datos
        $("#emovimsjuser").empty().addClass("msjerror");
        if ( faltan.length > 0 ) {
            //Entra solo si faltan campos requeridos
            //Si faltan requeridos faltan.length > 0
            $("#emovimsjuser").append("<div>Faltan datos requeridos</div>");
            $.each(faltan, function(i, valor) {
                $("#emoviinfo").append("<br>Falta: ", i + ".- ", valor, "<br>");
            });
        }
        if ( !eG.gotreCaptcha ) {
            //Entra si no se resolvió el widget reCaptcha
            $("#emovimsjuser").append("<div>Resolver reCaptcha</div>");
        }
        if ( eG.isreCaptchaExpired ) {
            //Entra si el widget reCaptcha ha expirado
            $("#emovimsjuser").append("<div>el token reCaptcha has expirado</div>");
        }
        if ( !goodDepo2 ) {
            //Entra si faltan datos de depositarios
            $("#emovimsjuser").append("<div>Faltan datos de Depositario 2</div>");
        }
        if ( !goodDepo3 ) {
            //Entra si faltan datos de depositarios
            $("#emovimsjuser").append("<div>Faltan datos de Depositario 3</div>");
        }
        $(targetBlur).blur();
        return false;
    }//Termina if falta, reCaptcha, reCaptcha expired

    //Si no hay problemas de captura hace la llamada jQuery AJAX
    //Despliega mensaje
    $("#popbody-snm").append("<br>Realizando llamada ajax...<br>");
    $("#emovimsjuser").empty().removeClass("msjerror").addClass("msjexito").append("<div>Procesando solicitud</div>");
    $.ajax({
        // The URL for the request
        // El Archivo php que procesará la llamada AJAX
        //eMoviModif
        url: "https://legasi.mx/ajax/capt-bov-basica.php",
     
        // The data to send (llega a $_REQUEST)
        // la información que pasaremos al Servidor,
        data: {
            campos: formatoBBas,       //Datos de Campos capturados
            isAjax: true,              //Flag reconoce llamada Ajax en PHP
            isDepo2: Depo2Capt == 4,
            isDepo3: Depo3Capt == 4
        },
     
        // Whether this is a POST or GET request
        // Esta opción determina si en el PHP se genera un $_POST o $_GET
        type: "POST",
     
        // The type of data we expect back
        // Es el tipo de información que regresa el PHP
        dataType : "json"
    })
        // Code to run if the request succeeds (is done);
        // The response is passed to the function
        .done(function( respuestaJSON ) {
            //recicla y resetea botones, focus, valores, etc. de la forma
            //Resetea la forma
            //emoviFormReset();
            //Avisa regreso de mailhandler
            //Revisa respuesta de la llamada AJAX y detecta errores o éxito en el envío
            $("#popbody-snm").empty().append("<br> Respuesta JSON...<br>", respuestaJSON);
            console.log("Respuesta JSON: ", respuestaJSON);
            var seEnvio = true;
            var tipoError = "";
            $.each(respuestaJSON, function(key, value) {
                    if (key === "errores") { 
                        seEnvio = false;                //Si existe el objeto errores, seEnvio = false
                    }             
                });
            //Despliega mensaje de resultado de envío
            if (seEnvio) {
                $("#emovimsjuser").empty().removeClass("msjerror").addClass("msjexito").append("<div>Información recibida, se envió correo de confirmación</div>");
            } else {
                tipoError += respuestaJSON.errores.reCaptcha ? "Error de reCaptcha" : ""; 
                tipoError += respuestaJSON.errores.isSuspect ? "Error de captura" : "";
                tipoError += respuestaJSON.errores.emoviemail ? "Dirección de correo incorrecta" : "";
                tipoError += respuestaJSON.errores.mailNotSent ? "Correo no entegado a carrier" : "";
                $("#emovimsjuser").empty().removeClass("msjexito").addClass("msjerror").append("<div>Error de sistema. Datos no guadados. Mensaje no enviado. " + tipoError +"</div>");
            }
        }) //Termina Done
        // Code to run if the request fails; the raw request and
        // status codes are passed to the function
        .fail(function( xhr, status, errorThrown ) {
            //Avisa regreso de mailhandler si hay errores
            $("#emovimsjuser").empty().append("Error en el proceso. Favor de reportar.").removeClass("msjexito").addClass("msjerror");
            console.log( "La llamada Ajax tuvo problemas" );
            console.log( "Error: " + errorThrown );
            console.log( "Status: " + status );
            console.log( "Respuesta: " + xhr.responseText);
            console.dir( "jqXHR: ", xhr );
        }) //Termina fail
        // Code to run regardless of success or failure;
        .always(function( a, textStatus ) {
            console.log( "Respuesta: ", textStatus, "Info en a: ", a );
            setTimeout(eG.clearMssg, 8000);
        });//Termina jQuery.ajax() y funciones concatenadas
};//Termina eG.captBovedaBasica

$(function() {
	console.log("Document ready! Ejemplo CORS", eG);
    //Ejecuta Script que trae información desde Base de Datos
    eG.getBovedaBasica();

    //Ejecuta Script que maneja edición de datos en Bóveda Básica
	$("#boveda_basica").on("submit", eG.captBovedaBasica);

    //Presenta botones para guardar datos y enviar mails cuando haya algún
    $("#boveda_basica .snm-control").on("change", function() {
        $("#guardabov").attr("disabled", false);
        if (!eG.esRegistro) {
            //aplica selección de envío de mails solo cuando no sea Registro
            $("#envmail").attr("disabled", false);
        }
    });
});//Termina page Document Ready 