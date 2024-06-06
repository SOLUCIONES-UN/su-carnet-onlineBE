import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposInformacion } from "./SucursalesAreasGruposInformacion";

@Index("sucursales_areas_grupos_horarios_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_grupos_horarios", { schema: "public" })
export class SucursalesAreasGruposHorarios {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "dia_semana" })
  diaSemana: number;

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

  @ManyToOne(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.sucursalesAreasGruposHorarios
  )
  @JoinColumn([{ name: "id_area_grupo", referencedColumnName: "id" }])
  idAreaGrupo: SucursalesAreasGruposInformacion;
}
