import { User } from "../../auth/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./";
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: 'e8152e94-b49f-42e3-9fd6-b16e794ab678',
    description: 'Producto ID',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: "Men's Quilted Shirt Jacket",
    description: 'Product Title',
    uniqueItems: true
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 0,
    description: 'Product price',
  }) @Column('float', {
    default: 0,
  })
  price: number;

  @ApiProperty({
    example: 'este es un texto de prueba',
    description: 'Product description',
    default: null
  }) @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ApiProperty({
    example: "Mens_Quilted_Shirt_Jacket",
    description: 'Product SLUG - SEO',
    uniqueItems: true
  }) @Column('text', {
    unique: true,
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product stock',
    default: 0
  }) @Column('int', {
    default: 0,
  })
  stock: number;

  @ApiProperty({
    example: ['M', 'XL', 'XXL'],
    description: 'Product Title',
    uniqueItems: true
  }) @Column('json')
  sizes: string[];

  @ApiProperty({
    example: "Men",
    description: 'Product Gender'
  }) @Column('text')
  gender: string;

  @ApiProperty()
  @Column('json', {
    default: '[]'
  })
  tags: string[];

  //images
  @ApiProperty()
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    {
      cascade: true,
      eager: true
    }
  )
  images?: ProductImage[];

  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true }
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')

  };

  @BeforeUpdate()
  checkSlugUpdate() {

    this.slug = this.title;
    this.slug = this.slug
      .toLocaleLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '')

  }

}
