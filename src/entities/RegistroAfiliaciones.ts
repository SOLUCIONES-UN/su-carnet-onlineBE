import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";

@Index("registro_afiliaciones_pkey", ["id"], { unique: true })
@Entity("registro_afiliaciones", { schema: "public" })
export class RegistroAfiliaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_solicitud" })
  fechaSolicitud: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("character varying", { name: "estado", length: 4 })
  estado: string;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.registroAfiliaciones
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;
}
