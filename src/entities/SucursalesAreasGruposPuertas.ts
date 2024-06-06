import {
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposInformacion } from "./SucursalesAreasGruposInformacion";
import { SucursalesAreasPuertas } from "./SucursalesAreasPuertas";
import { SucursalesAreasLogs } from "./SucursalesAreasLogs";

@Index("sucursales_areas_grupos_puertas_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_grupos_puertas", { schema: "public" })
export class SucursalesAreasGruposPuertas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @ManyToOne(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.sucursalesAreasGruposPuertas
  )
  @JoinColumn([{ name: "id_area_grupo", referencedColumnName: "id" }])
  idAreaGrupo: SucursalesAreasGruposInformacion;

  @ManyToOne(
    () => SucursalesAreasPuertas,
    (sucursalesAreasPuertas) =>
      sucursalesAreasPuertas.sucursalesAreasGruposPuertas
  )
  @JoinColumn([{ name: "id_puerta", referencedColumnName: "id" }])
  idPuerta: SucursalesAreasPuertas;

  @OneToMany(
    () => SucursalesAreasLogs,
    (sucursalesAreasLogs) => sucursalesAreasLogs.idPuerta
  )
  sucursalesAreasLogs: SucursalesAreasLogs[];
}
