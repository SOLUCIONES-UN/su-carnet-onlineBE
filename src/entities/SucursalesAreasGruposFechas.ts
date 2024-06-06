import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposInformacion } from "./SucursalesAreasGruposInformacion";

@Index("sucursales_areas_grupos_fechas_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_grupos_fechas", { schema: "public" })
export class SucursalesAreasGruposFechas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha" })
  fecha: string;

  @Column("character varying", {
    name: "hora_inicio",
    nullable: true,
    length: 5,
  })
  horaInicio: string | null;

  @Column("character varying", {
    name: "hora_final",
    nullable: true,
    length: 5,
  })
  horaFinal: string | null;

  @Column("character varying", { name: "tipo", nullable: true, length: 2 })
  tipo: string | null;

  @ManyToOne(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.sucursalesAreasGruposFechas
  )
  @JoinColumn([{ name: "id_area_grupo", referencedColumnName: "id" }])
  idAreaGrupo: SucursalesAreasGruposInformacion;
}
