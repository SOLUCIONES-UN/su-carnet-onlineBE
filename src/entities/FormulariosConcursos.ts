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
import { RespuestasUsuariosConcursos } from "./RespuestasUsuariosConcursos";

@Index("formularios_concursos_pkey", ["idFormulario"], { unique: true })
@Entity("formularios_concursos", { schema: "public" })
export class FormulariosConcursos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_formulario" })
  idFormulario: number;

  @Column("character varying", { name: "pregunta", length: 255 })
  pregunta: string;

  @Column("text", { name: "respuesta", nullable: true })
  respuesta: string | null;

  @ManyToOne(
    () => EventosEmpresa,
    (eventosEmpresa) => eventosEmpresa.formulariosConcursos
  )
  @JoinColumn([{ name: "id_evento", referencedColumnName: "idEvento" }])
  idEvento: EventosEmpresa;

  @OneToMany(
    () => RespuestasUsuariosConcursos,
    (respuestasUsuariosConcursos) => respuestasUsuariosConcursos.idFormulario
  )
  respuestasUsuariosConcursos: RespuestasUsuariosConcursos[];
}
