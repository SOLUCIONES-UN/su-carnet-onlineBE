import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
import { TipoDocumentos } from "./TipoDocumentos";

@Index("areas_sucursales_documentos_pkey", ["id"], { unique: true })
@Entity("areas_sucursales_documentos", { schema: "public" })
export class AreasSucursalesDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "estado", nullable: true })
  estado: number | null;

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) =>
      sucursalesAreasInformacion.areasSucursalesDocumentos
  )
  @JoinColumn([{ name: "id_areasucursal", referencedColumnName: "id" }])
  idAreasucursal: SucursalesAreasInformacion;

  @ManyToOne(
    () => TipoDocumentos,
    (tipoDocumentos) => tipoDocumentos.areasSucursalesDocumentos
  )
  @JoinColumn([{ name: "id_tipo_documento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumentos;
}
