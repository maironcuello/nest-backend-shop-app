import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seedData';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productService: ProductsService,

    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.createNewsProducts(adminUser);
    return 'SEEDEXCECUTE';
  }

  private async deleteTables() {
    await this.productService.deleteAllProducts();

    const queryBuider = this._userRepository.createQueryBuilder();
    await queryBuider.delete().where({}).execute();
  }

  private async insertUsers() {
    const seedUser = initialData.users;
    const users: User[] = [];

    seedUser.forEach(({ email, fullName, password, roles }) => {
      users.push(
        this._userRepository.create({
          email,
          fullName,
          password: bcrypt.hashSync(password, 10),
          roles,
        }),
      );
    });
    const dbUsers = await this._userRepository.save(users);
    return dbUsers[0];
  }

  private async createNewsProducts(user: User) {
    await this.productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this.productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
