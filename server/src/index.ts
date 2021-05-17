import { MikroORM } from "@mikro-orm/core"
import microConfig from "./mikro-orm.config"
import { Post } from "./entities/Post"

const main = async () => {
  const orm = await MikroORM.init(microConfig)
  await orm.getMigrator().up()

  const post = orm.em.create(Post, { title: "my first post" })
  orm.em.persistAndFlush(post)

  // 클래스를 만들 때만 엔티티의 new Date()가 호출된다.
  // 클래스를 새로 create하지 않을 땐 default가 필요하다.
  // nativeInsert는 클래스를 새로 만들지 않고 내가 원하는 데이터만 추가한다. 나머지는 dafeault를 따른다.
  // await orm.em.nativeInsert(Post, { title: "my second post" })
  // const posts = await orm.em.find(Post, {})
  // console.log(posts)
}

main().catch(err => {
  console.log(err)
})