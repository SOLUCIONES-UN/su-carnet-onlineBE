import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventosEmpresa } from "./EventosEmpresa";

@Index("areas_eventos_pkey", ["idArea"], { unique: true })
@Entity("areas_eventos", { schema: "public" })
export class AreasEventos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_area" })
  idArea: number;

  @Column("character varying", { name: "nombre_area", length: 50 })
  nombreArea: string;

  @Column("integer", { name: "cupo_maximo", nullable: true })
  cupoMaximo: number | null;

  @Column("integer", { name: "precio", nullable: true })
  precio: number | null;

  @Column("integer", { name: "estado", nullable: true })
  estado: number | null;

  @ManyToMany(
    () => EventosEmpresa,
    (eventosEmpresa) => eventosEmpresa.areasEventos
  )
  @JoinTable({
    name: "areas_en_eventos",
    joinColumns: [{ name: "id_area", referencedColumnName: "idArea" }],
    inverseJoinColumns: [
      { name: "id_evento", referencedColumnName: "idEvento" },
    ],
    schema: "public",
  })
  eventosEmpresas: EventosEmpresa[];
}
