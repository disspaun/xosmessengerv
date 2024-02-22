import {Entity, Column, BaseEntity, PrimaryGeneratedColumn} from 'typeorm';
import {StatusUser} from "../../../tm/Types";

@Entity('chat')
export class Chat extends BaseEntity {
    @PrimaryGeneratedColumn('increment') id!: number;
    @Column('text') name: string;
    @Column('bigint') status: StatusUser;
    @Column('text', { default: ''}) avatar: string;
    @Column('text', { default: ''}) count: number;
    @Column('text', { default: ''}) lastMessageId: number;
    @Column('text') from: string;
}

@Entity('message')
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('increment') id!: number;
    @Column('text') timestamp: number;
    @Column('text', { default: ''}) body: string;
    @Column('text') from: string;
    @Column('text') with: string;
    @Column('text', { default: ''}) sticker: string;
    @Column('simple-array', { nullable: true }) documents?: number[];

}

@Entity('document')
export class Document extends BaseEntity {
    @PrimaryGeneratedColumn('increment') id!: number;
    @Column('text', { default: ''}) name: string;
    @Column('text') path: string;
    @Column('text', { default: ''}) mimeType: string;
    @Column('text', { default: ''}) width: number;
    @Column('text', { default: ''}) height: number;
}
