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
import { MembresiaInformacion } from "./MembresiaInformacion";
import { OutsoursingInformacion } from "./OutsoursingInformacion";
import { RegistroAfiliaciones } from "./RegistroAfiliaciones";
import { RegistroColaboradores } from "./RegistroColaboradores";
import { SucursalesInformacion } from "./SucursalesInformacion";
import { TarjetaPresentacion } from "./TarjetaPresentacion";
import { TipoServicios } from "./TipoServicios";
import { UsuariosRelacionEmpresas } from "./UsuariosRelacionEmpresas";

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

  @Column("character varying", {
    name: "sitio_web",
    nullable: true,
    length: 100,
  })
  sitioWeb: string | null;

  @Column("character varying", {
    name: "logotipo",
    nullable: true,
    length: 250,
  })
  logotipo: string | null;

  @Column("text", { name: "terminos_condiciones", nullable: true })
  terminosCondiciones: string | null;

  @Column("character varying", {
    name: "codigoEmpresa",
    nullable: true,
    length: 250,
  })
  codigoEmpresa: string | null;

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
    () => MembresiaInformacion,
    (membresiaInformacion) => membresiaInformacion.empresa
  )
  membresiaInformacions: MembresiaInformacion[];

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
    () => RegistroColaboradores,
    (registroColaboradores) => registroColaboradores.idEmpresa
  )
  registroColaboradores: RegistroColaboradores[];

  @OneToMany(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.idEmpresa
  )
  sucursalesInformacions: SucursalesInformacion[];

  @OneToMany(
    () => TarjetaPresentacion,
    (tarjetaPresentacion) => tarjetaPresentacion.idEmpresa
  )
  tarjetaPresentacions: TarjetaPresentacion[];

  @OneToMany(() => TipoServicios, (tipoServicios) => tipoServicios.idEmpresa)
  tipoServicios: TipoServicios[];

  @OneToMany(
    () => UsuariosRelacionEmpresas,
    (usuariosRelacionEmpresas) => usuariosRelacionEmpresas.idEmpresa
  )
  usuariosRelacionEmpresas: UsuariosRelacionEmpresas[];
}
