import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("registro_dispositivos_pkey", ["id"], { unique: true })
@Entity("registro_dispositivos", { schema: "public" })
export class RegistroDispositivos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "fecha_ultimo_uso",
    nullable: true,
  })
  fechaUltimoUso: Date | null;

  @Column("character varying", { name: "estado", length: 4 })
  estado: string;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.registroDispositivos
  )
  @JoinColumn([{ name: "id_registro_informacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;
}