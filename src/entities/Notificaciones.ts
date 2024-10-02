import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Usuarios } from "./Usuarios";

@Index("notificaciones_pkey", ["id"], { unique: true })
@Entity("notificaciones", { schema: "public" })
export class Notificaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "title", length: 250 })
  title: string;

  @Column("text", { name: "body" })
  body: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("character varying", { name: "dispatch", length: 200 })
  dispatch: string;

  @Column("timestamp without time zone", { name: "fecha_generacion" })
  fechaGeneracion: Date;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.notificaciones)
  @JoinColumn([{ name: "idusuario", referencedColumnName: "id" }])
  idusuario: Usuarios;
}