import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { AreasSucursalesDocumentos } from "./AreasSucursalesDocumentos";
import { SucursalesAreasGruposInformacion } from "./SucursalesAreasGruposInformacion";
import { SucursalesInformacion } from "./SucursalesInformacion";
import { SucursalesAreasPuertas } from "./SucursalesAreasPuertas";
import { Usuarios } from "./Usuarios";
import { UsuariosRelacionEmpresas } from "./UsuariosRelacionEmpresas";

@Index("sucursales_areas_informacion_pkey", ["id"], { unique: true })
@Entity("sucursales_areas_informacion", { schema: "public" })
export class SucursalesAreasInformacion {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("text", { name: "informacion", array: true })
  informacion: string[];

  @Column("character varying", { name: "archivo_imagen1", length: 250 })
  archivoImagen1: string;

  @Column("character varying", { name: "archivo_imagen2", length: 250 })
  archivoImagen2: string;

  @Column("character varying", { name: "horario_propio", length: 2 })
  horarioPropio: string;

  @Column("character varying", { name: "tiene_programacion", length: 2 })
  tieneProgramacion: string;

  @Column("integer", { name: "minutos_programacion" })
  minutosProgramacion: number;

  @Column("integer", { name: "cantidad_programacion" })
  cantidadProgramacion: number;

  @Column("character varying", { name: "outsoursing", length: 2 })
  outsoursing: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @Column("text", { name: "instrucciones_qr", nullable: true, array: true })
  instruccionesQr: string[] | null;

  @Column("integer", { name: "tiempo_qr", nullable: true })
  tiempoQr: number | null;

  @OneToMany(
    () => AreasSucursalesDocumentos,
    (areasSucursalesDocumentos) => areasSucursalesDocumentos.idAreasucursal
  )
  areasSucursalesDocumentos: AreasSucursalesDocumentos[];

  @OneToMany(
    () => SucursalesAreasGruposInformacion,
    (sucursalesAreasGruposInformacion) =>
      sucursalesAreasGruposInformacion.idSucursalArea
  )
  sucursalesAreasGruposInformacions: SucursalesAreasGruposInformacion[];

  @ManyToOne(
    () => SucursalesInformacion,
    (sucursalesInformacion) => sucursalesInformacion.sucursalesAreasInformacions
  )
  @JoinColumn([{ name: "id_sucursal", referencedColumnName: "id" }])
  idSucursal: SucursalesInformacion;

  @OneToMany(
    () => SucursalesAreasPuertas,
    (sucursalesAreasPuertas) => sucursalesAreasPuertas.idSucursalArea
  )
  sucursalesAreasPuertas: SucursalesAreasPuertas[];

  @OneToMany(() => Usuarios, (usuarios) => usuarios.areaSucursal)
  usuarios: Usuarios[];

  @OneToMany(
    () => UsuariosRelacionEmpresas,
    (usuariosRelacionEmpresas) => usuariosRelacionEmpresas.idAreaSucursal
  )
  usuariosRelacionEmpresas: UsuariosRelacionEmpresas[];
}
