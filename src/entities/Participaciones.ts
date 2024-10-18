import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventosEmpresa } from "./EventosEmpresa";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("participaciones_pkey", ["idParticipacion"], { unique: true })
@Entity("participaciones", { schema: "public" })
export class Participaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_participacion" })
  idParticipacion: number;

  @Column("boolean", { name: "participa", default: () => "false" })
  participa: boolean;

  @Column("timestamp without time zone", {
    name: "fecha_respuesta",
    nullable: true,
  })
  fechaRespuesta: Date | null;

  @ManyToOne(
    () => EventosEmpresa,
    (eventosEmpresa) => eventosEmpresa.participaciones
  )
  @JoinColumn([{ name: "id_evento", referencedColumnName: "idEvento" }])
  idEvento: EventosEmpresa;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.participaciones
  )
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: RegistroInformacion;
}
