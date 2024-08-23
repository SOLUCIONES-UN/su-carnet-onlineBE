import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { Usuarios } from "./Usuarios";

@Index("registro_afiliaciones_pkey", ["id"], { unique: true })
@Entity("registro_afiliaciones", { schema: "public" })
export class RegistroAfiliaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", { name: "fecha_solicitud" })
  fechaSolicitud: Date;

  @Column("timestamp without time zone", {
    name: "fecha_inicio",
    nullable: true,
  })
  fechaInicio: Date | null;

  @Column("character varying", { name: "estado", length: 4 })
  estado: string;

  @Column("integer", { name: "tipoSolicitud", nullable: true })
  tipoSolicitud: number | null;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.registroAfiliaciones
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.registroAfiliaciones)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;
}
