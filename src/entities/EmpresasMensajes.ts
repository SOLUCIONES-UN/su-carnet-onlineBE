import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { RegistroMensajes } from "./RegistroMensajes";

@Index("empresas_mensajes_pkey", ["id"], { unique: true })
@Entity("empresas_mensajes", { schema: "public" })
export class EmpresasMensajes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "titulo", length: 200 })
  titulo: string;

  @Column("text", { name: "contenido" })
  contenido: string;

  @Column("character varying", { name: "accion", length: 2 })
  accion: string;

  @Column("timestamp without time zone", {
    name: "fecha_hora_envio",
    nullable: true,
  })
  fechaHoraEnvio: Date | null;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.empresasMensajes
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @OneToMany(
    () => RegistroMensajes,
    (registroMensajes) => registroMensajes.idMensaje
  )
  registroMensajes: RegistroMensajes[];
}
