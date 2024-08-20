import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesInformacion } from "./SucursalesInformacion";
import { TipoDocumentos } from "./TipoDocumentos";

@Index("sucursales_documentos_pkey", ["id"], { unique: true })
@Entity("sucursales_documentos", { schema: "public" })
export class SucursalesDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", nullable: true, default: () => "1" })
  estado: number | null;

  @ManyToOne(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.sucursalesDocumentos
  )
  @JoinColumn([{ name: "id_sucursal", referencedColumnName: "id" }])
  idSucursal: SucursalesInformacion;

  @ManyToOne(
    () => TipoDocumentos,
    (tipoDocumentos) => tipoDocumentos.sucursalesDocumentos
  )
  @JoinColumn([{ name: "id_tipo_documento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumentos;
}
