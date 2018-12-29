//Numero de jugadores que activos o que iniciaron sesion.
 var jugadoresActivos = 0;
 // contador de numero de jugadores que ya relizaron sus apuestas, cuando sea igual a la cantidad de jugadores activos se puede acctivar el boton para girar la ruleta. 
 var numeroDeApuestas = 0; 
 // array donde se guardan los jugadores que estan apostando , para luego tomar sus datos (color,porcentaje y dinero actual).
 var jugadoresApostando = [];
 // usuarios en uso
 var usuarios = [];
// plazas de jugadores ocupados
 var jugadoresEnUso = [];
 //dinero de los usuarios
 var dinero = [];

function iniciarSesion(id) {
            var contraseña;
            var usuario = $('#' + id).val();
            if( usuarios.includes(usuario) == true ){
                alert('Este usuario ya esta en uso');
            }else{
            bootbox.prompt({
            title: "Ingrese su contraseña",
            inputType: 'password',
            callback: function (result) {
            contraseña = result;
            $.ajax({
                url: Routing.generate('iniciar_sesion'),
                data: ({usuario: usuario, contraseña: contraseña}),
                method: 'POST',
                dataType: "json",
                success: function (data) {
                    if (data === -1 || data === null) {

                        alert('CONTRASEÑA EQUIVOCADA O EL USUARIO NO EXISTE ');
                    } 
                    else
                    {
                            $("#" + id).val(data["usuario"]);
                            $("#" + id).attr('disabled', true);
                            $("#" + id + "Dinero").val(data["dinero"]);
                            $("#" + id + "porcentaje").attr('disabled', false);
                            $("#" + id + "Apuesta").attr('disabled', false);
                            $("#" + id + "clo").attr('disabled', false);
                            $("#" + id + "ini").attr('disabled', true);
                            usuarios[jugadoresActivos] = data["usuario"];
                            jugadoresEnUso[jugadoresActivos] = id;
                            dinero[data["usuario"]] = data["dinero"];
                            jugadoresActivos++;


                    }

                }



            });


            }
            });

        }
            
        }

            function Apostar(id) {
            $("#AcabarJuego").attr('disabled', true);
            var claveporcentaje = id + "porcentaje";
            var claveDinero = id + "Dinero";
            var porcentaje = $("#" + claveporcentaje).val();
            var dinero = $("#" + claveDinero).val();
            var monto = $("#monto").val();
            if (dinero <= 1000) {
                var apuesta = dinero;
                $("#" + claveDinero).val("0");
                $("#monto").val(parseInt(monto) + parseInt(apuesta));
                $("#" + id).attr("disabled", true);
                $("#" + id + "ALLIN").attr('disabled', false);
            } else {
                if (dinero === 0) {
                    alert("El" + id + "no tiene mas dinero");
                    cerrarSesion(id);

                } else {
                    var apuesta = parseInt(dinero) * parseFloat(porcentaje);
                    var Restante = parseInt(dinero) - parseInt(apuesta);
                    $("#" + claveDinero).val(Restante);
                    $("#monto").val(parseInt(monto) + parseInt(apuesta));
                    $("#" + claveporcentaje).attr("disabled", true);
                    $("#AcabarJuego").attr('disabled', true);
                    jugadoresApostando[numeroDeApuestas] = id;
                    numeroDeApuestas++
                    if (jugadoresActivos >= 2 && numeroDeApuestas === jugadoresActivos) {
                                $("#ruleta").attr('disabled', false);
                    }
                }


            }


        }

        function EscogerColor(id) {

            $('#' + id).attr('disabled', true);

        }

        function AcabarJuego()
        {

           for (var i = 0 ; i < jugadoresActivos; i++){
                 cerrarSesion(jugadoresEnUso[i]);
           }

        }

        function Ruleta() {

            var ganador = 0; // guarda el numero para escoger el color ganador,
            var ganadores = []; // array con todos los jugadores que acertaron el numero.
            var total = $("#monto").val();//Dinero total apostado.
            var contadorGanadores = 0;//Numero de ganadores
            var multiplicador = 0;// multiplica el total por la cantidad del color ganador.

            var Color = Math.floor((Math.random() * 10) + 1);
            switch (Color) {
                case 1:
                    ganador = "NEGRO";
                    break;
                case 2:
                    ganador = "ROJO";
                    break;
                case 3:
                    ganador = "NEGRO";
                    break;
                case 4:
                    ganador = "ROJO";
                    break;
                case 5:
                    ganador = "NEGRO";
                    break;
                case 6:
                    ganador = "ROJO";
                    break;
                case 7:
                    ganador = "ROJO";
                    break;
                case 8:
                    ganador = "NEGRO";
                    break;
                case 9:
                    ganador = "NEGRO";
                    break;
                default :
                    ganador = "VERDE";

            }


            for (var i = 0; i < jugadoresActivos; i++) {
                var jugador = jugadoresApostando[i] + "Apuesta";
                $("#" + jugadoresApostando[i] + "Apuesta").attr('disabled', false);
                $("#" + jugadoresApostando[i] + "porcentaje").attr('disabled', false);
                var colorA = $('#' + jugador).val();
                if (colorA === ganador) {
                    ganadores [contadorGanadores] = jugadoresApostando[i];
                    contadorGanadores++;
                }
            }
            if (ganador === 'NEGRO' || ganador === 'ROJO') {

                         multiplicador = 2;


            } else {
                multiplicador = 15;
                    }
                for (var k = 0; k < contadorGanadores; k++) {
                    var dineroActual = $("#" + ganadores[k] + "Dinero");
                    var premio = (total * multiplicador / contadorGanadores);
                    var ganancia = parseInt(dineroActual.val()) + parseInt(premio);
                    dineroActual.val(ganancia);
                }
                swal("FIN DE RONDA", "COLOR:"+" "+ ganador +"  " + "GANADORES"+ " " + contadorGanadores, "info");
                $("#AcabarJuego").attr('disabled', false);
                $("#monto").val("0");
                numeroDeApuestas = 0;
                jugadoresApostando = [];
                $("#ruleta").attr('disabled', true);
        }

            function cerrarSesion(id){
               var usuario = $('#' + id).val();
               var campodinero = $('#'+ id + 'Dinero');
               var dineroGuardar = parseInt(campodinero.val());
               $("#" + id).val("");
               $("#" + id + "Apuesta").attr('disabled', true);
               $("#" + id + "porcentaje").attr('disabled', true);
                $.ajax({
                url: Routing.generate('cerrar_sesion'),
                data: ({usuario:usuario, dinero:dineroGuardar}),
                method: 'POST',
                dataType: "json",
                success: function(data){
                 if(data !== null){
                    $('#' + id).attr('disabled', false);
                    $('#' + id + 'ini').attr('disabled', false);
                    $('#' + id + 'clo').attr('disabled', true); 
                    $('#' + id + 'Dinero').val("");  
                    usuarios[usuarios.indexOf(usuario)] = null;
                    jugadoresActivos--;  
                    }

                }
               });
            }
        