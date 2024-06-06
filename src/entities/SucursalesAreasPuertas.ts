import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { SucursalesAreasGruposPuertas } from "./SucursalesAreasGruposPuertas";
import { SucursalesAreasInformacion } from "./SucursalesAreasInformacion";

@Index("sucursales_areas_puertas_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_puertas", { schema: "public" })
export class SucursalesAreasPuertas {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("character varying", { name: "direccion_ip", length: 250 })
  direccionIp: string;

  @Column("character varying", { name: "genera_alerta", length: 2 })
  generaAlerta: string;

  @OneToMany(
    () => SucursalesAreasGruposPuertas,
    (sucursalesAreasGruposPuertas) => sucursalesAreasGruposPuertas.idPuerta
  )
  sucursalesAreasGruposPuertas: SucursalesAreasGruposPuertas[];

  @ManyToOne(
    () => SucursalesAreasInformacion,
    (sucursalesAreasInformacion) =>
      sucursalesAreasInformacion.sucursalesAreasPuertas
  )
  @JoinColumn([{ name: "id_sucursal_area", referencedColumnName: "id" }])
  idSucursalArea: SucursalesAreasInformacion;
}
