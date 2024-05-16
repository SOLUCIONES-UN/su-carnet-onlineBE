import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Test } from 'src/entities/Test';
import { Repository } from 'typeorm';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class TestService {

  //Este logger nos ayuda a mostrar en la consola el nombre del servicio donde se produjo el error
  private readonly logger = new Logger("TestService");

  constructor(
    @InjectRepository(Test)
    private testRepository: Repository<Test>,
  ) {}

  async create(createTestDto: CreateTestDto) {
    try {
      const newTest = this.testRepository.create(createTestDto);

      return this.testRepository.save(newTest);
    } catch (error) {

    }
  }

  findAll( PaginationDto: PaginationDto) {

    const { limit =10, offset=0 } = PaginationDto;

    return this.testRepository.find({
      skip: offset,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.testRepository.findOneBy({ id });
  }

  async update(id: number, updateTestDto: UpdateTestDto) {
    //precargamor las propiedades que recibimos en la entidad
    const test = await this.testRepository.preload({
      id: id,
      ...updateTestDto,
    });

    if (!test) throw new NotFoundException(`Test #${id} not found`);

    await this.testRepository.save(test);

    return test;
  }

  remove(id: number) {
    return `This action removes a #${id} test`;
  }

  private handleDBException(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    this.logger.error(`Error creating product: ${error.message}`);
    throw new InternalServerErrorException('Error creating product');
  }
}
