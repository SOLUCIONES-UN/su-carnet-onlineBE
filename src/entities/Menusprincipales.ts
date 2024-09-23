import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Opcionesmenu } from "./Opcionesmenu";

@Index("menusprincipales_pkey", ["id"], { unique: true })
@Entity("menusprincipales", { schema: "public" })
export class Menusprincipales {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 255 })
  descripcion: string;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(() => Opcionesmenu, (opcionesmenu) => opcionesmenu.menuprincipal)
  opcionesmenus: Opcionesmenu[];
}
