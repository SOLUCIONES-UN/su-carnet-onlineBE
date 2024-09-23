import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Opcionesmenu } from "./Opcionesmenu";
import { Roles } from "./Roles";

@Index("permisosopciones_pkey", ["id"], { unique: true })
@Entity("permisosopciones", { schema: "public" })
export class Permisosopciones {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "state" })
  state: number;

  @ManyToOne(
    () => Opcionesmenu,
    (opcionesmenu) => opcionesmenu.permisosopciones
  )
  @JoinColumn([{ name: "opcionid", referencedColumnName: "id" }])
  opcion: Opcionesmenu;

  @ManyToOne(() => Roles, (roles) => roles.permisosopciones)
  @JoinColumn([{ name: "rolid", referencedColumnName: "id" }])
  rol: Roles;
}
