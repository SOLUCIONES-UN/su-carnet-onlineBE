import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";

@Index("vendedores_pkey", ["id"], { unique: true })
@Entity("vendedores", { schema: "public" })
export class Vendedores {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombres", length: 250 })
  nombres: string;

  @Column("character varying", { name: "apellidos", length: 250 })
  apellidos: string;

  @Column("character varying", { name: "codigo", length: 100 })
  codigo: string;

  @Column("character varying", { name: "correo", length: 50 })
  correo: string;

  @Column("character varying", { name: "telefono", length: 15 })
  telefono: string;

  @Column("integer", { name: "estado", nullable: true, default: () => "1" })
  estado: number | null;

  @OneToMany(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.idVendedor
  )
  empresasInformacions: EmpresasInformacion[];
}
