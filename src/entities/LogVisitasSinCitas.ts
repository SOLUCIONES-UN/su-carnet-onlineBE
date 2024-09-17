import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("log_visitas_sin_citas_pkey", ["id"], { unique: true })
@Entity("log_visitas_sin_citas", { schema: "public" })
export class LogVisitasSinCitas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "fecha_hora_generacion" })
  fechaHoraGeneracion: Date;

  @Column("integer", { name: "state", default: () => "1" })
  state: number;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.logVisitasSinCitas
  )
  @JoinColumn([{ name: "idregistroinformacion", referencedColumnName: "id" }])
  idregistroinformacion: RegistroInformacion;
}
