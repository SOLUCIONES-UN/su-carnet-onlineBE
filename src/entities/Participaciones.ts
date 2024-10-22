import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AreasEventos } from "./AreasEventos";
import { FechasEventos } from "./FechasEventos";
import { EventosEmpresa } from "./EventosEmpresa";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("participaciones_pkey", ["idParticipacion"], { unique: true })
@Entity("participaciones", { schema: "public" })
export class Participaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_participacion" })
  idParticipacion: number;

  @Column("timestamp without time zone", {
    name: "fecha_respuesta",
    nullable: true,
    default: () => "now()",
  })
  fechaRespuesta: Date | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(() => AreasEventos, (areasEventos) => areasEventos.participaciones)
  @JoinColumn([{ name: "area_inscrito", referencedColumnName: "idArea" }])
  areaInscrito: AreasEventos;

  @ManyToOne(
    () => FechasEventos,
    (fechasEventos) => fechasEventos.participaciones
  )
  @JoinColumn([
    { name: "fecha_participacion", referencedColumnName: "idFecha" },
  ])
  fechaParticipacion: FechasEventos;

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
