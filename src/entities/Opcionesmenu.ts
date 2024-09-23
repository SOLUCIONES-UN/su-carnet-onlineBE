import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Menusprincipales } from "./Menusprincipales";
import { Permisosopciones } from "./Permisosopciones";

@Index("opcionesmenu_pkey", ["id"], { unique: true })
@Entity("opcionesmenu", { schema: "public" })
export class Opcionesmenu {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", {
    name: "descripcion",
    nullable: true,
    length: 255,
  })
  descripcion: string | null;

  @Column("character varying", { name: "url", nullable: true, length: 255 })
  url: string | null;

  @Column("integer", { name: "state", default: () => "1" })
  state: number;

  @ManyToOne(
    () => Menusprincipales,
    (menusprincipales) => menusprincipales.opcionesmenus
  )
  @JoinColumn([{ name: "menuprincipalid", referencedColumnName: "id" }])
  menuprincipal: Menusprincipales;

  @OneToMany(
    () => Permisosopciones,
    (permisosopciones) => permisosopciones.opcion
  )
  permisosopciones: Permisosopciones[];
}
