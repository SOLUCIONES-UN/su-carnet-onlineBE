import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Vendedores } from "./Vendedores";
import { SucursalesInformacion } from "./SucursalesInformacion";

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

  @ManyToOne(() => Vendedores, (vendedores) => vendedores.empresasInformacions)
  @JoinColumn([{ name: "id_vendedor", referencedColumnName: "id" }])
  idVendedor: Vendedores;

  @OneToMany(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.idEmpresa
  )
  sucursalesInformacions: SucursalesInformacion[];
}
