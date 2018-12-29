<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Jugador;
use Symfony\Component\HttpFoundation\Response;
use App\Entity\Apuesta;
use App\Entity\Color;

class RuletaController extends AbstractController
{
    /**
     * @Route("/ruleta", name="ruleta")
     */
    public function index()
    {
        $em = $this->getDoctrine()->getManager();
        $apuestas = $em->getRepository(Apuesta::class)->findAll();
        $colores = $em->getRepository(Color::class)->findAll();

        return $this->render('ruleta/index.html.twig', [
            'controller_name' => 'RuletaController',
            'apuestas' => $apuestas,
            'colores' => $colores
        ]);
    }

    /**
     *
     *
     * @Route("/IniciarSesion", name="iniciar_sesion", options={"expose" = true})
     * 
     */
    public function iniciarSesion (Request $request){
        $usuario = $request->get("usuario");
        $contraseña = $request->get("contraseña");
        $em = $this->getDoctrine()->getManager();
        $jugador = $em->getRepository(Jugador::class)->findOneBy(array('usuario' => $usuario));

        if ($jugador !== null && $jugador->getPassword() == $contraseña) {
            $jugador_response = (array("usuario" => $jugador->getUsuario(), "dinero" => $jugador->getDinero()));
            $response = new Response(\json_encode($jugador_response));
            $response->headers->set('Content-Type', 'application/json');
            return $response;
        } else {
            $response = new Response(-1);
            return $response;
        }
    }


    //     /**
    //  *
    //  *
    //  * @Route("/acabar_juego", name="acabar_juego", options={"expose" = true})
    //  * 
    //  */
    // public function acabarJuego(Request $request) {
    //     $jugadores = $request->get("jugadores");
    //     $data = json_decode($request->get("alias"));
    //     $data2 = json_decode($request->get("Totales"));
    //     if($data == null || $data2 == null){
    //         throw new Exception("no pasa");
    //     }
        
        
    //     $em = $this->getDoctrine()->getManager();
         
    //     for ($i = 0; $i < $jugadores ; $i ++) {
    //         $usuario = $data[$i];
    //         $dineroTotal = $data2[$i];
    //         $jugador = $em->getRepository(Jugador::class)->findOneBy(array('usuario' => $usuario));
    //         $jugador->setDinero($dineroTotal);
    //         $em->persist($jugador);
    //         $em->flush();
    //     }
    //     $response = new Response(1);
    //     $response->headers->set('Content-Type', 'application/json');
    //     return $response;
    // }

        /**
     *
     *
     * @Route("/CerrarSesion", name="cerrar_sesion", options={"expose" = true})
     * 
     */
    public function cerrarSesion (Request $request){
        $usuario = $request->get("usuario");
        $dinero = $request->get("dinero");
        $em = $this->getDoctrine()->getManager();
        $jugador = $em->getRepository(Jugador::class)->findOneBy(array('usuario' => $usuario));
        $jugador->setDinero((int)$dinero);
        $em->persist($jugador);
        $em->flush();
        $response = new Response(1);
        $response->headers->set('Content-Type', 'application/json');
        return $response;

    }
}
