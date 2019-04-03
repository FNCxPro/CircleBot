import {
  BaseEntity,
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm'
import Circle from './Circle'

import { User as ErisUser } from 'eris'

@Entity()
export default class User extends BaseEntity {
  @PrimaryColumn()
  id: string

  @OneToOne(type => Circle, circle => circle.owner)
  @JoinColumn()
  ownedCircle?: Circle

  @Column({
    default: false
  })
  createdCircle: boolean

  @ManyToMany(type => Circle, circle => circle.members)
  @JoinTable()
  memberOf: Circle[]

  @OneToMany(type => Circle, circle => circle.betrayedBy)
  betrayedCircles: Circle[]

  @Column({
    default: false
  })
  hasBetrayed: boolean

  static async get(user: ErisUser) {
    let dbUser = await this.findOne(user.id, {
      relations: ['ownedCircle', 'memberOf', 'betrayedCircles']
    })
    if (!dbUser) {
      dbUser = new User()
      dbUser.id = user.id
      await dbUser.save()
    }
    return dbUser
  }
}
