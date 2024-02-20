import { FindManyOptions } from 'typeorm'
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere'
import { FindOptionsRelations } from 'typeorm/find-options/FindOptionsRelations'

export abstract class CustomFindManyOptions<Entity>
  implements FindManyOptions<Entity>
{
  where?: FindOptionsWhere<Entity>[] | FindOptionsWhere<Entity>
  relations?: FindOptionsRelations<Entity>
}
