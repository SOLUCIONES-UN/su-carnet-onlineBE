import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { OutsoursingDocumentos } from "./OutsoursingDocumentos";
import { RegistroInformacion } from "./RegistroInformacion";
import { TipoDocumentos } from "./TipoDocumentos";

@Index("registro_documentos_pkey", ["id"], { unique: true })
@Entity("registro_documentos", { schema: "public" })
export class RegistroDocumentos {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("date", { name: "fecha_vencimiento" })
  fechaVencimiento: string;

  @Column("character varying", { name: "archivo" })
  archivo: string;

  @Column("character varying", { name: "estado", nullable: true, length: 4 })
  estado: string | null;

  @OneToMany(
    () => OutsoursingDocumentos,
    (outsoursingDocumentos) => outsoursingDocumentos.idDocumento
  )
  outsoursingDocumentos: OutsoursingDocumentos[];

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.registroDocumentos
  )
  @JoinColumn([{ name: "id_registro_informacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;

  @ManyToOne(
    () => TipoDocumentos,
    (tipoDocumentos) => tipoDocumentos.registroDocumentos
  )
  @JoinColumn([{ name: "id_tipo_documento", referencedColumnName: "id" }])
  idTipoDocumento: TipoDocumentos;
}
