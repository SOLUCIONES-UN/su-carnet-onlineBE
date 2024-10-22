import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventosEmpresa } from "./EventosEmpresa";
import { Participaciones } from "./Participaciones";

@Index("fechas_eventos_pkey", ["idFecha"], { unique: true })
@Entity("fechas_eventos", { schema: "public" })
export class FechasEventos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_fecha" })
  idFecha: number;

  @Column("timestamp without time zone", { name: "fecha_inicio" })
  fechaInicio: Date;

  @Column("timestamp without time zone", { name: "fecha_fin" })
  fechaFin: Date;

  @ManyToOne(
    () => EventosEmpresa,
    (eventosEmpresa) => eventosEmpresa.fechasEventos
  )
  @JoinColumn([{ name: "id_evento", referencedColumnName: "idEvento" }])
  idEvento: EventosEmpresa;

  @OneToMany(
    () => Participaciones,
    (participaciones) => participaciones.fechaParticipacion
  )
  participaciones: Participaciones[];
}
