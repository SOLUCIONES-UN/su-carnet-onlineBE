import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposPuertas } from "./SucursalesAreasGruposPuertas";
import { SucursalesAreasPermisos } from "./SucursalesAreasPermisos";

@Index("sucursales_areas_logs_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_logs", { schema: "public" })
export class SucursalesAreasLogs {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("timestamp without time zone", {
    name: "fecha_hora_generacion",
    nullable: true,
  })
  fechaHoraGeneracion: Date | null;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @ManyToOne(
    () => SucursalesAreasGruposPuertas,
    (sucursalesAreasGruposPuertas) =>
      sucursalesAreasGruposPuertas.sucursalesAreasLogs
  )
  @JoinColumn([{ name: "id_puerta", referencedColumnName: "id" }])
  idPuerta: SucursalesAreasGruposPuertas;

  @ManyToOne(
    () => SucursalesAreasPermisos,
    (sucursalesAreasPermisos) => sucursalesAreasPermisos.sucursalesAreasLogs
  )
  @JoinColumn([
    { name: "id_sucursal_area_permiso", referencedColumnName: "id" },
  ])
  idSucursalAreaPermiso: SucursalesAreasPermisos;
}
