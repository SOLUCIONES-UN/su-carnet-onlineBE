import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
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

  @ManyToOne(() => Usuarios, (usuarios) => usuarios.usuariosRelacionEmpresas)
  @JoinColumn([{ name: "id_usuario", referencedColumnName: "id" }])
  idUsuario: Usuarios;
}
