<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ApuestaRepository")
 */
class Apuesta
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $Porcentaje;


    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPorcentaje(): ?int
    {
        return $this->Porcentaje;
    }

    public function setPorcentaje(int $Porcentaje): self
    {
        $this->Porcentaje = $Porcentaje;

        return $this;
    }


}
