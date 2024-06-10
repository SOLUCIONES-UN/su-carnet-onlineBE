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
import { TipoRelacionEmpresas } from "./TipoRelacionEmpresas";
import { OutsoursingServicios } from "./OutsoursingServicios";

@Index("outsoursing_informacion_pkey", ["id"], { unique: true })
@Entity("outsoursing_informacion", { schema: "public" })
export class OutsoursingInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombre_proyecto", length: 250 })
  nombreProyecto: string;

  @Column("character varying", { name: "descripcion_proyecto", length: 250 })
  descripcionProyecto: string;

  @Column("date", { name: "fecha_solicitud" })
  fechaSolicitud: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_finalizacion" })
  fechaFinalizacion: string;

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
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.outsoursingInformacions2
  )
  @JoinColumn([{ name: "id_empresa_relacionada", referencedColumnName: "id" }])
  idEmpresaRelacionada: EmpresasInformacion;

  @ManyToOne(
    () => TipoRelacionEmpresas,
    (tipoRelacionEmpresas) => tipoRelacionEmpresas.outsoursingInformacions
  )
  @JoinColumn([{ name: "id_tipo_relacion", referencedColumnName: "id" }])
  idTipoRelacion: TipoRelacionEmpresas;

  @OneToMany(
    () => OutsoursingServicios,
    (outsoursingServicios) => outsoursingServicios.idOutsoursing
  )
  outsoursingServicios: OutsoursingServicios[];
}
