import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposInformacion } from "./SucursalesAreasGruposInformacion";
import { TipoPermisos } from "./TipoPermisos";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("sucursales_areas_permisos_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_permisos", { schema: "public" })
export class SucursalesAreasPermisos {
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

  @Column("character varying", {
    name: "genera_alerta",
    nullable: true,
    length: 2,
  })
  generaAlerta: string | null;

  @Column("character varying", { name: "estado", nullable: true, length: 3 })
  estado: string | null;

  @ManyToOne(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.sucursalesAreasPermisos
  )
  @JoinColumn([{ name: "id_area_grupo", referencedColumnName: "id" }])
  idAreaGrupo: SucursalesAreasGruposInformacion;

  @ManyToOne(
    () => TipoPermisos,
    (tipoPermisos) => tipoPermisos.sucursalesAreasPermisos
  )
  @JoinColumn([{ name: "id_permiso", referencedColumnName: "id" }])
  idPermiso: TipoPermisos;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.sucursalesAreasPermisos
  )
  @JoinColumn([{ name: "id_registro", referencedColumnName: "id" }])
  idRegistro: RegistroInformacion;
}
