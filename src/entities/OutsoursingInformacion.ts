import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingAfiliaciones } from "./OutsoursingAfiliaciones";
import { OutsoursingDocumentos } from "./OutsoursingDocumentos";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { OutsoursingServicios } from "./OutsoursingServicios";

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

  @OneToMany(
    () => OutsoursingAfiliaciones,
    (outsoursingAfiliaciones) => outsoursingAfiliaciones.idOutsoursing
  )
  outsoursingAfiliaciones: OutsoursingAfiliaciones[];

  @OneToMany(
    () => OutsoursingDocumentos,
    (outsoursingDocumentos) => outsoursingDocumentos.idOutsoursing
  )
  outsoursingDocumentos: OutsoursingDocumentos[];

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

  @OneToMany(
    () => OutsoursingServicios,
    (outsoursingServicios) => outsoursingServicios.idOutsoursing
  )
  outsoursingServicios: OutsoursingServicios[];
}
