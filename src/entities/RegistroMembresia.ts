import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CaracteristicasSucursales } from "./CaracteristicasSucursales";

@Index("registro_membresia_pkey", ["id"], { unique: true })
@Entity("registro_membresia", { schema: "public" })
export class RegistroMembresia {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_vencimiento" })
  fechaVencimiento: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => CaracteristicasSucursales,
    (caracteristicasSucursales) => caracteristicasSucursales.registroMembresias
  )
  @JoinColumn([
    { name: "id_caracteristicas_sucursales", referencedColumnName: "id" },
  ])
  idCaracteristicasSucursales: CaracteristicasSucursales;
}
