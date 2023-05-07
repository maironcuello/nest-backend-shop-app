import { IsOptional, IsPositive, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) //The same -> enableImplicitConversions: true
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Min(0)
  @Type(() => Number) //The same -> enableImplicitConversions: true
  offset?: number;
}
