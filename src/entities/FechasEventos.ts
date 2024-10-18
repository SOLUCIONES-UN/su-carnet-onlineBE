import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventosEmpresa } from "./EventosEmpresa";

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
}
