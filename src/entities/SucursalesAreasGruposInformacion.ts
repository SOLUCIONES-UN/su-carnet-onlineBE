import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposFechas } from "./SucursalesAreasGruposFechas";
import { SucursalesAreasGruposHorarios } from "./SucursalesAreasGruposHorarios";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";
import { SucursalesAreasGruposPuertas } from "./SucursalesAreasGruposPuertas";

@Index("sucursales_areas_grupos_informacion_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_grupos_informacion", { schema: "public" })
export class SucursalesAreasGruposInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => SucursalesAreasGruposFechas,
    (sucursalesAreasGruposFechas) => sucursalesAreasGruposFechas.idAreaGrupo
  )
  sucursalesAreasGruposFechas: SucursalesAreasGruposFechas[];

  @OneToMany(
    () => SucursalesAreasGruposHorarios,
    (sucursalesAreasGruposHorarios) => sucursalesAreasGruposHorarios.idAreaGrupo
  )
  sucursalesAreasGruposHorarios: SucursalesAreasGruposHorarios[];

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) =>
      sucursalesAreasInformacion.sucursalesAreasGruposInformacions
  )
  @JoinColumn([{ name: "id_sucursal_area", referencedColumnName: "id" }])
  idSucursalArea: SucursalesAreasInformacion;

  @OneToMany(
    () => SucursalesAreasGruposPuertas,
    (sucursalesAreasGruposPuertas) => sucursalesAreasGruposPuertas.idAreaGrupo
  )
  sucursalesAreasGruposPuertas: SucursalesAreasGruposPuertas[];
}
