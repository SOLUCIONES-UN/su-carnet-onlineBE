import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingServicios } from "./OutsoursingServicios";
import { TipoCategoriasServicios } from "./TipoCategoriasServicios";
import { EmpresasInformacion } from "./EmpresasInformacion";

@Index("tipo_servicios_pkey", ["id"], { unique: true })
@Entity("tipo_servicios", { schema: "public" })
export class TipoServicios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 100 })
  descripcion: string;

  @Column("text", { name: "informacion" })
  informacion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => OutsoursingServicios,
    (outsoursingServicios) => outsoursingServicios.idServicio
  )
  outsoursingServicios: OutsoursingServicios[];

  @ManyToOne(
    () => TipoCategoriasServicios,
    (tipoCategoriasServicios) => tipoCategoriasServicios.tipoServicios
  )
  @JoinColumn([{ name: "id_categoria", referencedColumnName: "id" }])
  idCategoria: TipoCategoriasServicios;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.tipoServicios
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;
}
