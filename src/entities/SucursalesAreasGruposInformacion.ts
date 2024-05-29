import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";

@Index("sucursales_areas_grupos_informacion_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_grupos_informacion", { schema: "public" })
export class SucursalesAreasGruposInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) =>
      sucursalesAreasInformacion.sucursalesAreasGruposInformacions
  )
  @JoinColumn([{ name: "id_sucursal_area", referencedColumnName: "id" }])
  idSucursalArea: SucursalesAreasInformacion;
}
