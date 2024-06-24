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

  @Column("time without time zone", { name: "hora_inicio" })
  horaInicio: string;

  @Column("time without time zone", { name: "hora_final" })
  horaFinal: string;

  @ManyToOne(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.sucursalesAreasGruposHorarios
  )
  @JoinColumn([{ name: "id_area_grupo", referencedColumnName: "id" }])
  idAreaGrupo: SucursalesAreasGruposInformacion;
}
