import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { FormulariosConcursos } from "./FormulariosConcursos";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("respuestas_usuarios_concursos_pkey", ["idRespuesta"], { unique: true })
@Entity("respuestas_usuarios_concursos", { schema: "public" })
export class RespuestasUsuariosConcursos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id_respuesta" })
  idRespuesta: number;

  @Column("text", { name: "respuesta", nullable: true })
  respuesta: string | null;

  @ManyToOne(
    () => FormulariosConcursos,
    (formulariosConcursos) => formulariosConcursos.respuestasUsuariosConcursos
  )
  @JoinColumn([{ name: "id_formulario", referencedColumnName: "idFormulario" }])
  idFormulario: FormulariosConcursos;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.respuestasUsuariosConcursos
  )
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: RegistroInformacion;
}
