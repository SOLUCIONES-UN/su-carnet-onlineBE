import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
import { EmpresasInformacion } from "./EmpresasInformacion";
import { SucursalesInformacion } from "./SucursalesInformacion";
import { Usuarios } from "./Usuarios";

@Index("usuarios_relacion_empresas_pkey", ["id"], { unique: true })
@Entity("usuarios_relacion_empresas", { schema: "public" })
export class UsuariosRelacionEmpresas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) =>
      sucursalesAreasInformacion.usuariosRelacionEmpresas
  )
  @JoinColumn([{ name: "id_area_sucursal", referencedColumnName: "id" }])
  idAreaSucursal: SucursalesAreasInformacion;

  @ManyToOne(
    () => EmpresasInformacion,
    (empresasInformacion) => empresasInformacion.usuariosRelacionEmpresas
  )
  @JoinColumn([{ name: "id_empresa", referencedColumnName: "id" }])
  idEmpresa: EmpresasInformacion;

  @ManyToOne(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.usuariosRelacionEmpresas
  )
  @JoinColumn([{ name: "id_sucursal", referencedColumnName: "id" }])
  idSucursal: SucursalesInformacion;

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuariosRelacionEmpresas)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;
}
