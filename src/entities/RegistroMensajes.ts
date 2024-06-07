import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("registro_mensajes_pkey", ["id"], { unique: true })
@Entity("registro_mensajes", { schema: "public" })
export class RegistroMensajes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "titulo" })
  titulo: string;

  @Column("text", { name: "contenido" })
  contenido: string;

  @Column("character varying", { name: "accion", length: 2 })
  accion: string;

  @Column("character varying", { name: "estado", length: 4 })
  estado: string;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.registroMensajes
  )
  @JoinColumn([{ name: "id_registro_informacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;
}
