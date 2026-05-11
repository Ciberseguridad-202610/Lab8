import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum ActionType {
  PAGE_VISIT = 'PAGE_VISIT',
  FORM_SUBMIT = 'FORM_SUBMIT',
  LINK_CLICK = 'LINK_CLICK',
}

/**
 * Registra únicamente metadatos de interacción. No almacena credenciales.
 * IP y User-Agent se guardan como hash SHA-256 irreversible (privacidad por diseño).
 */
@Entity()
export class Interaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Generado en el cliente, permite agrupar eventos de una misma sesión
  @Column()
  sessionId: string;

  // Tipo de evento pedagógico capturado
  @Column({ type: 'varchar' })
  action: ActionType;

  // SHA-256 del User-Agent — permite detectar patrones sin identificar al usuario
  @Column({ nullable: true })
  userAgentHash: string;

  // SHA-256 de la IP — nunca se almacena la IP en texto claro
  @Column({ nullable: true })
  ipHash: string;

  // El usuario fue redirigido a la página educativa
  @Column({ default: false })
  redirectedToAwareness: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
