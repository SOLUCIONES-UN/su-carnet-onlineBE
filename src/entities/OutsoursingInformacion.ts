import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasInformacion } from "./EmpresasInformacion";

@Index("outsoursing_informacion_pkey", ["id"], { unique: true })
@Entity("outsoursing_informacion", { schema: "public" })
export class OutsoursingInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_solicitud" })
  fechaSolicitud: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.outsoursingInformacions
  )
  @JoinColumn([{ name: "id_empresa_hijo", referencedColumnName: "id" }])
  idEmpresaHijo: EmpresasInformacion;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.outsoursingInformacions2
  )
  @JoinColumn([{ name: "id_empresa_padre", referencedColumnName: "id" }])
  idEmpresaPadre: EmpresasInformacion;
}
