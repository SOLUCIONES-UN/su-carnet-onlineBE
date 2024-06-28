import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CaracteristicasSucursales } from "./CaracteristicasSucursales";

@Index("registro_pasaporte_pkey", ["id"], { unique: true })
@Entity("registro_pasaporte", { schema: "public" })
export class RegistroPasaporte {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_emision" })
  fechaEmision: string;

  @Column("date", { name: "fecha_vencimiento" })
  fechaVencimiento: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => CaracteristicasSucursales,
    (caracteristicasSucursales) => caracteristicasSucursales.registroPasaportes
  )
  @JoinColumn([
    { name: "id_caracteristicas_sucursales", referencedColumnName: "id" },
  ])
  idCaracteristicasSucursales: CaracteristicasSucursales;
}
