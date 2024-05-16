import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from 'src/entities/Test';

@Module({
  imports: [
    TypeOrmModule.forFeature([Test]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {}
