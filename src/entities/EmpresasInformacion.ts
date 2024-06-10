import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasDocumentos } from "./EmpresasDocumentos";
import { Vendedores } from "./Vendedores";
import { EmpresasMensajes } from "./EmpresasMensajes";
import { OutsoursingInformacion } from "./OutsoursingInformacion";
import { RegistroAfiliaciones } from "./RegistroAfiliaciones";
import { SucursalesInformacion } from "./SucursalesInformacion";
import { TipoServicios } from "./TipoServicios";

@Index("empresas_informacion_pkey", ["id"], { unique: true })
@Entity("empresas_informacion", { schema: "public" })
export class EmpresasInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "nombre", length: 250 })
  nombre: string;

  @Column("text", { name: "disclaimer" })
  disclaimer: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("date", { name: "fecha_vencimiento" })
  fechaVencimiento: string;

  @Column("character varying", { name: "factura_nit", length: 20 })
  facturaNit: string;

  @Column("character varying", { name: "factura_nombre", length: 250 })
  facturaNombre: string;

  @Column("character varying", { name: "factura_direccion", length: 50 })
  facturaDireccion: string;

  @Column("character varying", { name: "factura_correo", length: 50 })
  facturaCorreo: string;

  @Column("numeric", { name: "factura_monto", precision: 10, scale: 2 })
  facturaMonto: string;

  @Column("character varying", { name: "factura_descripcion", length: 250 })
  facturaDescripcion: string;

  @Column("character varying", { name: "miembro", length: 5 })
  miembro: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => EmpresasDocumentos,
    (empresasDocumentos) => empresasDocumentos.idEmpresa
  )
  empresasDocumentos: EmpresasDocumentos[];

  @ManyToOne(() => Vendedores, (vendedores) => vendedores.empresasInformacions)
  @JoinColumn([{ name: "id_vendedor", referencedColumnName: "id" }])
  idVendedor: Vendedores;

  @OneToMany(
    () => EmpresasMensajes,
    (empresasMensajes) => empresasMensajes.idEmpresa
  )
  empresasMensajes: EmpresasMensajes[];

  @OneToMany(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.idEmpresa
  )
  outsoursingInformacions: OutsoursingInformacion[];

  @OneToMany(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.idEmpresaRelacionada
  )
  outsoursingInformacions2: OutsoursingInformacion[];

  @OneToMany(
    () => RegistroAfiliaciones,
    (registroAfiliaciones) => registroAfiliaciones.idEmpresa
  )
  registroAfiliaciones: RegistroAfiliaciones[];

  @OneToMany(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.idEmpresa
  )
  sucursalesInformacions: SucursalesInformacion[];

  @OneToMany(() => TipoServicios, (tipoServicios) => tipoServicios.idEmpresa)
  tipoServicios: TipoServicios[];
}
