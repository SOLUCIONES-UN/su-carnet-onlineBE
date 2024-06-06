import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TipoPaises } from "./TipoPaises";

@Index("registro_informacion_pkey", ["id"], { unique: true })
@Entity("registro_informacion", { schema: "public" })
export class RegistroInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "documento" })
  documento: string;

  @Column("character varying", { name: "nombres" })
  nombres: string;

  @Column("character varying", { name: "apellidos" })
  apellidos: string;

  @Column("date", { name: "fecha_nacimiento" })
  fechaNacimiento: string;

  @Column("character varying", { name: "telefono" })
  telefono: string;

  @Column("character varying", { name: "correo" })
  correo: string;

  @Column("character varying", {
    name: "contacto_emergencia_nombre",
    nullable: true,
    length: 250,
  })
  contactoEmergenciaNombre: string | null;

  @Column("character varying", {
    name: "contacto_emergencia_telefono",
    nullable: true,
    length: 250,
  })
  contactoEmergenciaTelefono: string | null;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @ManyToOne(() => TipoPaises, (tipoPaises) => tipoPaises.registroInformacions)
  @JoinColumn([{ name: "id_pais", referencedColumnName: "id" }])
  idPais: TipoPaises;
}
