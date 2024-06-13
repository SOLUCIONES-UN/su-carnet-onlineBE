import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasDocumentos } from "./EmpresasDocumentos";
import { RegistroDocumentos } from "./RegistroDocumentos";
import { SucursalesDocumentos } from "./SucursalesDocumentos";

@Index("tipo_documentos_pkey", ["id"], { unique: true })
@Entity("tipo_documentos", { schema: "public" })
export class TipoDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "descripcion", length: 250 })
  descripcion: string;

  @Column("character varying", {
    name: "necesita_validacion",
    nullable: true,
    length: 2,
  })
  necesitaValidacion: string | null;

  @Column("character varying", {
    name: "tiene_vencimiento",
    nullable: true,
    length: 2,
  })
  tieneVencimiento: string | null;

  @Column("integer", { name: "estado", default: () => "1" })
  estado: number;

  @OneToMany(
    () => EmpresasDocumentos,
    (empresasDocumentos) => empresasDocumentos.idTipoDocumento
  )
  empresasDocumentos: EmpresasDocumentos[];

  @OneToMany(
    () => RegistroDocumentos,
    (registroDocumentos) => registroDocumentos.idTipoDocumento
  )
  registroDocumentos: RegistroDocumentos[];

  @OneToMany(
    () => SucursalesDocumentos,
    (sucursalesDocumentos) => sucursalesDocumentos.idTipoDocumento
  )
  sucursalesDocumentos: SucursalesDocumentos[];
}