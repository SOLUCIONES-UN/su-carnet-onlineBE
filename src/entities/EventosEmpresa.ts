import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArchivosEventos } from "./ArchivosEventos";
import { AreasEventos } from "./AreasEventos";
import { RegistroInformacion } from "./RegistroInformacion";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { FechasEventos } from "./FechasEventos";
import { FormulariosConcursos } from "./FormulariosConcursos";
import { Participaciones } from "./Participaciones";

@Index("eventos_empresa_pkey", ["idEvento"], { unique: true })
@Entity("eventos_empresa", { schema: "public" })
export class EventosEmpresa {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_evento" })
  idEvento: number;

  @Column("character varying", { name: "titulo", length: 200 })
  titulo: string;

  @Column("text", { name: "descripcion", nullable: true })
  descripcion: string | null;

  @Column("character varying", {
    name: "ubicacion",
    nullable: true,
    length: 200,
  })
  ubicacion: string | null;

  @Column("integer", { name: "tipo_evento", nullable: true })
  tipoEvento: number | null;

  @Column("timestamp without time zone", {
    name: "fecha_creacion",
    default: () => "now()",
  })
  fechaCreacion: Date;

  @Column("timestamp without time zone", {
    name: "fecha_publicacion",
    nullable: true,
  })
  fechaPublicacion: Date | null;

  @Column("integer", { name: "estado", nullable: true })
  estado: number | null;

  @Column("character varying", {
    name: "path_image",
    nullable: true,
    length: 255,
  })
  pathImage: string | null;

  @Column("character varying", {
    name: "color_letra",
    nullable: true,
    length: 10,
  })
  colorLetra: string | null;

  @OneToMany(
    () => ArchivosEventos,
    (archivosEventos) => archivosEventos.idEvento
  )
  archivosEventos: ArchivosEventos[];

  @ManyToMany(
    () => AreasEventos,
    (areasEventos) => areasEventos.eventosEmpresas
  )
  areasEventos: AreasEventos[];

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.eventosEmpresas
  )
  @JoinColumn([{ name: "creado_por", referencedColumnName: "id" }])
  creadoPor: RegistroInformacion;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.eventosEmpresas
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @OneToMany(() => FechasEventos, (fechasEventos) => fechasEventos.idEvento)
  fechasEventos: FechasEventos[];

  @OneToMany(
    () => FormulariosConcursos,
    (formulariosConcursos) => formulariosConcursos.idEvento
  )
  formulariosConcursos: FormulariosConcursos[];

  @OneToMany(
    () => Participaciones,
    (participaciones) => participaciones.idEvento
  )
  participaciones: Participaciones[];
}
