import {
  BaseEntity,
  Entity,
  Column,
  OneToOne,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import User from './User'

@Entity()
export default class Circle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @OneToOne(type => User, user => user.ownedCircle, {
    eager: true
  })
  owner: User

  @ManyToMany(type => User, user => user.memberOf, {
    eager: true
  })
  members: User[]

  @Column()
  name: string

  @Column()
  key: string

  @Column()
  channel: string

  @Column({
    default: false
  })
  betrayed: boolean

  @ManyToOne(type => User, user => user.betrayedCircles, {
    eager: true
  })
  betrayedBy?: User
}
