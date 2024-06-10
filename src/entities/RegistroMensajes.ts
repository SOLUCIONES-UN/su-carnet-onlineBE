import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EmpresasMensajes } from "./EmpresasMensajes";
import { RegistroInformacion } from "./RegistroInformacion";

@Index("registro_mensajes_pkey", ["id"], { unique: true })
@Entity("registro_mensajes", { schema: "public" })
export class RegistroMensajes {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "estado", length: 4 })
  estado: string;

  @ManyToOne(
    () => EmpresasMensajes,
    (empresasMensajes) => empresasMensajes.registroMensajes
  )
  @JoinColumn([{ name: "id_mensaje", referencedColumnName: "id" }])
  idMensaje: EmpresasMensajes;

  @ManyToOne(
    () => RegistroInformacion,
    (registroInformacion) => registroInformacion.registroMensajes
  )
  @JoinColumn([{ name: "id_registro_informacion", referencedColumnName: "id" }])
  idRegistroInformacion: RegistroInformacion;
}
