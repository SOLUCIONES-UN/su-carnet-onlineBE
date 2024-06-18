import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingInformacion } from "./OutsoursingInformacion";
import { RegistroInformacion } from "./RegistroInformacion";
import { SucursalesAreasPermisos } from "./SucursalesAreasPermisos";

@Index("outsoursing_afiliaciones_pkey", ["id"], { unique: true })
@Entity("outsoursing_afiliaciones", { schema: "public" })
export class OutsoursingAfiliaciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_solicitud" })
  fechaSolicitud: string;

  @Column("date", { name: "fecha_inicio" })
  fechaInicio: string;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @ManyToOne(
    () => OutsoursingInformacion,
    (outsoursingInformacion) => outsoursingInformacion.outsoursingAfiliaciones
  )
  @JoinColumn([{ name: "id_outsoursing", referencedColumnName: "id" }])
  idOutsoursing: OutsoursingInformacion;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.outsoursingAfiliaciones
  )
  @JoinColumn([{ name: "id_registro_informacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;

  @OneToMany(
    () => SucursalesAreasPermisos,
    (sucursalesAreasPermisos) =>
      sucursalesAreasPermisos.idOutsoursingAfiliaciones
  )
  sucursalesAreasPermisos: SucursalesAreasPermisos[];
}
