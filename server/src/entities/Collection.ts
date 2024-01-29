import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Collection {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({ type: 'text' })
    collection: string

    @Column({ type: 'text' })
    nodes: string

    @Column({ type: 'text' })
    rootPath: string

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date
}
