import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";

@Index("tiposcuentas_pkey", ["id"], { unique: true })
@Entity("tiposcuentas", { schema: "public" })
export class Tiposcuentas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 40 })
  descripcion: string;

  @Column("numeric", { name: "precio", precision: 10, scale: 2 })
  precio: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.tipoCuenta
  )
  empresasInformacions: EmpresasInformacion[];
}
