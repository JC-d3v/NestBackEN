import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from "uuid";
import { CreateCarDto } from './dto/create-car.dto';

import { Car } from './interfaces/car.interface';



@Injectable()
export class CarsService {

  private cars: Car[] = [
    {
      id: uuid(),
      brand: 'Toyota',
      model: 'Corolla'
    },
    {
      id: uuid(),
      brand: 'Honda',
      model: 'Civic'
    },
    {
      id: uuid(),
      brand: 'Jeep',
      model: 'Cherokee'
    },
  ];

  findAll() {
    return this.cars;
  }

  findOneById(id: string) {
    const car = this.cars.find(car => car.id === id);
    if (!car) {
      throw new NotFoundException(`Car with ID '${id}' not found`)
    }
    return car;
  }

  create(createCarDto: CreateCarDto) {
    const car: Car = {
      id: uuid(),
      ...createCarDto
    }
    this.cars.push(car)
    return car;
  }
}
